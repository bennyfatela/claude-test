<template>
  <div class="games">
    <div class="page-header flex justify-between items-center mb-4">
      <div>
        <p class="text-muted text-sm mb-2">{{ t('games.subtitle') }}</p>
      </div>
      <button class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
        </svg>
        {{ t('games.scheduleGame') }}
      </button>
    </div>

    <div class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
        </svg>
        <h3>{{ t('games.noGames') }}</h3>
        <p class="empty-text">{{ t('games.noGamesText') }}</p>
        <button class="btn btn-primary mt-4">{{ t('games.scheduleFirstGame') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-lg);
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
</style>
