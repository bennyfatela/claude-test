<template>
  <div class="game-card" :class="{ 'past-game': isPast }">
    <div class="card-header">
      <div class="game-info">
        <div class="opponent-name">
          <span class="vs-label">vs</span>
          {{ game.opponent }}
        </div>
        <div class="game-meta">
          <span class="game-type-badge" :class="{ 'home': game.homeGame, 'away': !game.homeGame }">
            {{ game.homeGame ? t('games.form.homeGame') : t('games.form.awayGame') }}
          </span>
          <span class="game-date">{{ formatDate(game.date) }}</span>
          <span class="game-time">{{ formatTime(game.startTime) }}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="action-btn edit-btn" @click="handleEdit" :title="t('common.edit')">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </button>
        <button class="action-btn delete-btn" @click="handleDelete" :title="t('common.delete')">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Final Score -->
      <div v-if="game.finalScore" class="final-score">
        <span class="score-label">{{ t('games.form.finalScore') }}:</span>
        <span class="score-value">{{ game.finalScore }}</span>
      </div>

      <!-- Location -->
      <div v-if="game.location" class="game-location">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" class="location-icon">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        <a v-if="isGoogleMapsLink(game.location)" :href="game.location" target="_blank" rel="noopener noreferrer" class="location-link">
          {{ t('games.form.location') }} (Google Maps)
        </a>
        <span v-else class="location-text">{{ game.location }}</span>
      </div>

      <!-- Video URL -->
      <div v-if="game.videoUrl" class="game-video">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" class="video-icon">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
        <a :href="game.videoUrl" target="_blank" rel="noopener noreferrer" class="video-link">
          {{ t('games.form.videoUrl') }}
        </a>
      </div>

      <!-- Comments -->
      <div v-if="game.comments" class="game-comments">
        <p>{{ game.comments }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Game } from '../types';

interface Props {
  game: Game;
}

interface Emits {
  (e: 'edit'): void;
  (e: 'delete'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t, locale } = useI18n();

const isPast = computed(() => {
  const gameDate = new Date(props.game.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return gameDate < today;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString: string) => {
  return timeString.substring(0, 5); // HH:MM
};

const isGoogleMapsLink = (location: string): boolean => {
  return location.includes('maps.google') || location.includes('goo.gl/maps') || location.startsWith('https://maps');
};

const handleEdit = () => {
  emit('edit');
};

const handleDelete = () => {
  emit('delete');
};
</script>

<style scoped>
.game-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all 0.2s ease;
  border-left: 4px solid var(--primary-color);
}

.game-card:hover {
  box-shadow: var(--shadow-md);
  border-left-color: var(--primary-hover);
}

.game-card.past-game {
  opacity: 0.85;
  border-left-color: var(--gray-400);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50);
}

.game-info {
  flex: 1;
  min-width: 0;
}

.opponent-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.vs-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-500);
  text-transform: uppercase;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.game-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.game-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.game-type-badge.home {
  background: #dbeafe;
  color: #1e40af;
}

.game-type-badge.away {
  background: #fef3c7;
  color: #92400e;
}

.game-date,
.game-time {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.card-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  background: white;
  border: 1px solid var(--gray-300);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.edit-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.delete-btn:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
  background: #fee2e2;
}

.card-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.final-score {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--secondary-light);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--secondary-color);
}

.score-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}

.score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.game-location,
.game-video {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--gray-600);
}

.location-icon,
.video-icon {
  color: var(--gray-400);
  flex-shrink: 0;
}

.location-link,
.video-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.location-link:hover,
.video-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.location-text {
  color: var(--gray-700);
}

.game-comments {
  padding: var(--spacing-md);
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--gray-300);
}

.game-comments p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-700);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .opponent-name {
    font-size: 1rem;
  }

  .game-meta {
    font-size: 0.8125rem;
  }
}
</style>
