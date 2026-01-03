<template>
  <div class="player-card">
    <div class="player-header">
      <div class="player-avatar">
        {{ initials }}
      </div>
      <div class="player-number" v-if="player.jerseyNumber">
        #{{ player.jerseyNumber }}
      </div>
    </div>

    <div class="player-body">
      <h3 class="player-name">{{ player.firstName }} {{ player.lastName }}</h3>
      <div class="player-position">
        <span class="badge" :class="positionBadgeClass">
          {{ positionLabel }}
        </span>
      </div>

      <div class="player-details" v-if="player.dateOfBirth">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
        </svg>
        <span>{{ formatDate(player.dateOfBirth) }}</span>
      </div>

      <p class="player-comments" v-if="player.comments">
        {{ player.comments }}
      </p>
    </div>

    <div class="player-actions">
      <button class="action-btn" @click="emit('edit', player)" title="Editar">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
      </button>
      <button class="action-btn danger" @click="emit('delete', player)" title="Eliminar">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from '../types';

interface Props {
  player: Player;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [player: Player];
  delete: [player: Player];
}>();

const initials = computed(() => {
  return `${props.player.firstName[0]}${props.player.lastName[0]}`.toUpperCase();
});

const positionLabel = computed(() => {
  const labels: Record<string, string> = {
    GOALKEEPER: 'GR',
    LEFT_WING: 'PE',
    LEFT_BACK: 'LE',
    CENTER_BACK: 'CT',
    PIVOT: 'PV',
    RIGHT_BACK: 'LD',
    RIGHT_WING: 'PD',
  };
  return labels[props.player.position] || props.player.position;
});

const positionBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    GOALKEEPER: 'badge-primary',
    LEFT_WING: 'badge-success',
    LEFT_BACK: 'badge-warning',
    CENTER_BACK: 'badge-danger',
    PIVOT: 'badge-primary',
    RIGHT_BACK: 'badge-warning',
    RIGHT_WING: 'badge-success',
  };
  return classes[props.player.position] || 'badge-primary';
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-PT');
}
</script>

<style scoped>
.player-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  position: relative;
}

.player-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.player-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.player-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-light);
}

.player-body {
  margin-bottom: var(--spacing-md);
}

.player-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.player-position {
  margin-bottom: var(--spacing-sm);
}

.player-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.player-comments {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.player-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.danger:hover {
  background: #fee2e2;
  border-color: var(--danger-color);
  color: var(--danger-color);
}
</style>
