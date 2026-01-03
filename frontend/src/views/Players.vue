<template>
  <div class="players">
    <div class="page-header">
      <div>
        <p class="text-muted text-sm mb-2">Team Roster</p>
        <p class="text-sm text-muted" v-if="playersCount > 0">
          {{ playersCount }} {{ playersCount === 1 ? 'jogador' : 'jogadores' }}
          {{ selectedPosition ? `(${positionFilterLabel})` : '' }}
        </p>
      </div>
      <button class="btn btn-primary" @click="showForm = true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
        </svg>
        Adicionar Jogador
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section" v-if="playersCount > 0">
      <div class="filters">
        <button
          class="filter-btn"
          :class="{ active: selectedPosition === null }"
          @click="selectedPosition = null"
        >
          Todos
        </button>
        <button
          v-for="position in positions"
          :key="position.value"
          class="filter-btn"
          :class="{ active: selectedPosition === position.value }"
          @click="selectedPosition = position.value"
        >
          {{ position.label }}
        </button>
      </div>
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
        <h3>{{ selectedPosition ? 'Nenhum jogador nesta posição' : 'Ainda sem jogadores' }}</h3>
        <p class="empty-text">
          {{ selectedPosition
            ? 'Experimente filtrar por outra posição ou adicionar um novo jogador.'
            : 'Comece por adicionar o seu primeiro jogador ao plantel dos Sub-18.'
          }}
        </p>
        <button class="btn btn-primary mt-4" @click="showForm = true">
          Adicionar Primeiro Jogador
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlayersStore } from '../stores/players';
import PlayerCard from '../components/PlayerCard.vue';
import PlayerForm from '../components/PlayerForm.vue';
import type { Player, Position } from '../types';

const playersStore = usePlayersStore();
const showForm = ref(false);
const editingPlayer = ref<Player | null>(null);
const selectedPosition = ref<Position | null>(null);

const positions = [
  { value: 'GOALKEEPER' as Position, label: 'Guarda-Redes' },
  { value: 'LEFT_WING' as Position, label: 'Ponta Esquerda' },
  { value: 'LEFT_BACK' as Position, label: 'Lateral Esquerdo' },
  { value: 'CENTER_BACK' as Position, label: 'Central' },
  { value: 'PIVOT' as Position, label: 'Pivot' },
  { value: 'RIGHT_BACK' as Position, label: 'Lateral Direito' },
  { value: 'RIGHT_WING' as Position, label: 'Ponta Direita' },
];

const playersCount = computed(() => playersStore.playersCount);

const filteredPlayers = computed(() => {
  return playersStore.getPlayersByPosition(selectedPosition.value);
});

const positionFilterLabel = computed(() => {
  if (!selectedPosition.value) return '';
  const position = positions.find(p => p.value === selectedPosition.value);
  return position?.label || '';
});

function handleSubmit(formData: any) {
  if (editingPlayer.value) {
    playersStore.updatePlayer(editingPlayer.value.id, formData);
  } else {
    playersStore.addPlayer(formData);
  }
  closeForm();
}

function handleEdit(player: Player) {
  editingPlayer.value = player;
  showForm.value = true;
}

function handleDelete(player: Player) {
  if (confirm(`Tem a certeza que deseja eliminar ${player.firstName} ${player.lastName}?`)) {
    playersStore.deletePlayer(player.id);
  }
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  background: var(--bg-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
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
