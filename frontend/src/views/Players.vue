<template>
  <div class="players">
    <div class="page-header">
      <div>
        <p class="text-muted text-sm mb-2">{{ t('players.subtitle') }}</p>
        <p class="text-sm text-muted" v-if="playersCount > 0">
          {{ playersCount }} {{ playersCount === 1 ? t('players.playerCount', { count: 1 }).split('|')[0].trim() : t('players.playerCount', { count: playersCount }).split('|')[1].trim() }}
          {{ selectedPosition ? `(${positionFilterLabel})` : '' }}
        </p>
      </div>
      <button class="btn btn-primary" @click="showForm = true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
        </svg>
        {{ t('players.addPlayer') }}
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section" v-if="playersCount > 0">
      <PositionFilter v-model="selectedPosition" />
    </div>

    <!-- Players Grid -->
    <div v-if="filteredPlayers.length > 0" class="players-grid">
      <PlayerCard
        v-for="player in filteredPlayers"
        :key="player.id"
        :player="player"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
        <h3>{{ selectedPosition ? t('players.noPlayersInPosition') : t('players.noPlayers') }}</h3>
        <p class="empty-text">
          {{ selectedPosition ? t('players.noPlayersInPositionText') : t('players.noPlayersText') }}
        </p>
        <button class="btn btn-primary mt-4" @click="showForm = true">
          {{ t('players.addFirstPlayer') }}
        </button>
      </div>
    </div>

    <!-- Player Form Modal -->
    <PlayerForm
      v-if="showForm"
      :player="editingPlayer"
      @close="closeForm"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :isOpen="showDeleteDialog"
      :title="t('players.deletePlayer')"
      :message="playerToDelete ? t('players.confirmDelete', { name: `${playerToDelete.firstName} ${playerToDelete.lastName}` }) : ''"
      :danger="true"
      :confirmText="t('common.delete')"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePlayersStore } from '../stores/players';
import PlayerCard from '../components/PlayerCard.vue';
import PlayerForm from '../components/PlayerForm.vue';
import PositionFilter from '../components/PositionFilter.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import type { Player, Position } from '../types';

const { t } = useI18n();
const playersStore = usePlayersStore();
const showForm = ref(false);
const editingPlayer = ref<Player | null>(null);
const selectedPosition = ref<Position | null>(null);
const showDeleteDialog = ref(false);
const playerToDelete = ref<Player | null>(null);

const playersCount = computed(() => playersStore.playersCount);

// Fetch players on mount
onMounted(() => {
  playersStore.fetchPlayers();
});

const filteredPlayers = computed(() => {
  return playersStore.getPlayersByPosition(selectedPosition.value);
});

const positionFilterLabel = computed(() => {
  if (!selectedPosition.value) return '';
  return t(`players.positions.${positionNameMap[selectedPosition.value]}`);
});

const positionNameMap: Record<Position, string> = {
  GOALKEEPER: 'goalkeeper',
  LEFT_WING: 'leftWing',
  LEFT_BACK: 'leftBack',
  CENTER_BACK: 'centerBack',
  PIVOT: 'pivot',
  RIGHT_BACK: 'rightBack',
  RIGHT_WING: 'rightWing',
};

async function handleSubmit(formData: any) {
  if (editingPlayer.value) {
    await playersStore.updatePlayer(editingPlayer.value.id, formData);
  } else {
    await playersStore.addPlayer(formData);
  }
  closeForm();
}

function handleEdit(player: Player) {
  editingPlayer.value = player;
  showForm.value = true;
}

function handleDelete(player: Player) {
  playerToDelete.value = player;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  if (playerToDelete.value) {
    await playersStore.deletePlayer(playerToDelete.value.id);
    playerToDelete.value = null;
  }
  showDeleteDialog.value = false;
}

function cancelDelete() {
  playerToDelete.value = null;
  showDeleteDialog.value = false;
}

function closeForm() {
  showForm.value = false;
  editingPlayer.value = null;
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.filters-section {
  margin-bottom: var(--spacing-lg);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .players-grid {
    grid-template-columns: 1fr;
  }
}
</style>
