<template>
  <div class="statistics">
    <div class="page-header mb-4">
      <p class="text-muted text-sm mb-2">Performance Analytics</p>
    </div>

    <div class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
        <h3>No Statistics Available</h3>
        <p class="empty-text">Statistics will appear here once you start recording games and tracking player performance.</p>
        <router-link to="/games" class="btn btn-primary mt-4">Record Your First Game</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Statistics component - placeholder only
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
