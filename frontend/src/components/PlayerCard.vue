<template>
  <div class="player-card">
    <div class="player-avatar" :class="{ 'has-photo': player.photo }">
      <img v-if="player.photo" :src="player.photo" :alt="`${player.firstName} ${player.lastName}`" class="player-photo" />
      <span v-else class="player-initials">{{ initials }}</span>
    </div>

    <div class="player-info">
      <h3 class="player-name">{{ player.firstName }} {{ player.lastName }}</h3>
      <div class="player-positions">
        <span
          v-for="position in player.positions"
          :key="position"
          class="badge"
          :class="getPositionBadgeClass(position)"
        >
          {{ getPositionLabel(position) }}
        </span>
      </div>
    </div>

    <div class="player-actions">
      <button class="action-btn" @click="emit('edit', player)" :title="t('common.edit')">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
      </button>
      <button class="action-btn danger" @click="emit('delete', player)" :title="t('common.delete')">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Player, Position } from '../types';

interface Props {
  player: Player;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [player: Player];
  delete: [player: Player];
}>();

const { t } = useI18n();

const initials = computed(() => {
  return `${props.player.firstName[0]}${props.player.lastName[0]}`.toUpperCase();
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

function getPositionLabel(position: Position): string {
  const key = positionNameMap[position];
  return t(`players.positions.${key}`);
}

function getPositionBadgeClass(position: Position): string {
  const classes: Record<Position, string> = {
    GOALKEEPER: 'badge-primary',
    LEFT_WING: 'badge-success',
    LEFT_BACK: 'badge-warning',
    CENTER_BACK: 'badge-danger',
    PIVOT: 'badge-primary',
    RIGHT_BACK: 'badge-warning',
    RIGHT_WING: 'badge-success',
  };
  return classes[position] || 'badge-primary';
}
</script>

<style scoped>
.player-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.player-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--primary-light);
}

.player-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.player-avatar.has-photo {
  background: var(--bg-secondary);
  padding: 0;
}

.player-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-initials {
  user-select: none;
}

.player-info {
  text-align: center;
  width: 100%;
}

.player-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  line-height: 1.3;
}

.player-positions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
  margin-bottom: var(--spacing-xs);
}

.player-actions {
  display: flex;
  gap: var(--spacing-xs);
  width: 100%;
  padding-top: var(--spacing-sm);
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
