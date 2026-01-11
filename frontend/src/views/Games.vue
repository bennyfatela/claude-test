<template>
  <div class="games">
    <div class="page-header">
      <div>
        <p class="text-muted text-sm mb-2">{{ t('games.subtitle') }}</p>
      </div>
      <button class="btn btn-primary" @click="openCreateDialog">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
        </svg>
        {{ t('games.scheduleGame') }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <p>{{ t('common.loading') }}...</p>
    </div>

    <div v-else-if="games.length === 0" class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
        </svg>
        <h3>{{ t('games.noGames') }}</h3>
        <p class="empty-text">{{ t('games.noGamesText') }}</p>
        <button class="btn btn-primary mt-4" @click="openCreateDialog">{{ t('games.scheduleFirstGame') }}</button>
      </div>
    </div>

    <div v-else class="games-container">
      <!-- Upcoming Games -->
      <div v-if="upcomingGames.length > 0" class="games-section">
        <h3 class="section-title">{{ t('dashboard.upcomingGames') }}</h3>
        <div class="games-grid">
          <GameCard
            v-for="game in upcomingGames"
            :key="game.id"
            :game="game"
            @edit="openEditDialog(game)"
            @delete="handleDeleteGame(game)"
          />
        </div>
      </div>

      <!-- Past Games -->
      <div v-if="pastGames.length > 0" class="games-section">
        <h3 class="section-title">{{ t('dashboard.recentGames') }}</h3>
        <div class="games-grid">
          <GameCard
            v-for="game in pastGames"
            :key="game.id"
            :game="game"
            @edit="openEditDialog(game)"
            @delete="handleDeleteGame(game)"
          />
        </div>
      </div>
    </div>

    <!-- Game Dialog -->
    <GameDialog
      :isOpen="showGameDialog"
      :game="selectedGame"
      @close="closeGameDialog"
      @save="handleSaveGame"
    />

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="closeDeleteConfirm">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3>{{ t('games.deleteGame') }}</h3>
          <button class="close-btn" @click="closeDeleteConfirm" :title="t('common.close')">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ t('games.confirmDelete') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDeleteConfirm" type="button">
            {{ t('common.cancel') }}
          </button>
          <button class="btn btn-danger" @click="confirmDelete" type="button">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apolloClient } from '../graphql/client';
import { GET_GAMES } from '../graphql/queries';
import { CREATE_GAME, UPDATE_GAME, DELETE_GAME } from '../graphql/mutations';
import GameCard from '../components/GameCard.vue';
import GameDialog from '../components/GameDialog.vue';
import type { Game } from '../types';

const { t } = useI18n();

const games = ref<Game[]>([]);
const loading = ref(false);
const showGameDialog = ref(false);
const showDeleteConfirm = ref(false);
const selectedGame = ref<Game | null>(null);
const gameToDelete = ref<Game | null>(null);

const upcomingGames = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return games.value
    .filter(game => new Date(game.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const pastGames = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return games.value
    .filter(game => new Date(game.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const fetchGames = async () => {
  loading.value = true;
  try {
    const { data } = await apolloClient.query({
      query: GET_GAMES,
      fetchPolicy: 'network-only',
    });
    games.value = data.games || [];
  } catch (error) {
    console.error('Error fetching games:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  selectedGame.value = null;
  showGameDialog.value = true;
};

const openEditDialog = (game: Game) => {
  selectedGame.value = game;
  showGameDialog.value = true;
};

const closeGameDialog = () => {
  showGameDialog.value = false;
  selectedGame.value = null;
};

const handleSaveGame = async (data: any) => {
  try {
    if (selectedGame.value) {
      // Update existing game
      await apolloClient.mutate({
        mutation: UPDATE_GAME,
        variables: {
          id: selectedGame.value.id,
          input: data,
        },
      });
    } else {
      // Create new game
      await apolloClient.mutate({
        mutation: CREATE_GAME,
        variables: {
          input: data,
        },
      });
    }
    await fetchGames();
    closeGameDialog();
  } catch (error) {
    console.error('Error saving game:', error);
  }
};

const handleDeleteGame = (game: Game) => {
  gameToDelete.value = game;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  gameToDelete.value = null;
};

const confirmDelete = async () => {
  if (!gameToDelete.value) return;

  try {
    await apolloClient.mutate({
      mutation: DELETE_GAME,
      variables: {
        id: gameToDelete.value.id,
      },
    });
    await fetchGames();
    closeDeleteConfirm();
  } catch (error) {
    console.error('Error deleting game:', error);
  }
};

onMounted(() => {
  fetchGames();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--gray-600);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.empty-icon {
  color: var(--gray-300);
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
}

.empty-text {
  max-width: 400px;
  margin-bottom: 0;
}

.games-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.games-section {
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.section-title {
  padding: var(--spacing-lg);
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-800);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.games-grid {
  padding: var(--spacing-lg);
  display: grid;
  gap: var(--spacing-lg);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
  animation: fadeIn 0.2s ease;
}

.modal-content.delete-modal {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: var(--gray-100);
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
