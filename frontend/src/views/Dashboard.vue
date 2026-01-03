<template>
  <div class="dashboard">
    <!-- Quick Stats Grid -->
    <div class="stats-grid grid grid-cols-4 gap-4 mb-4">
      <div class="stat-card">
        <div class="stat-icon players">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Players</p>
          <p class="stat-value">0</p>
          <p class="stat-change positive">Ready for season</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon games">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Upcoming Games</p>
          <p class="stat-value">0</p>
          <p class="stat-change">No games scheduled</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon training">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Training Sessions</p>
          <p class="stat-value">0</p>
          <p class="stat-change">This month</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon attendance">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Attendance Rate</p>
          <p class="stat-value">0%</p>
          <p class="stat-change">Last 30 days</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Upcoming Events -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Recent Games -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Games</h3>
          <router-link to="/games" class="text-sm text-muted">View all</router-link>
        </div>
        <div class="card-body">
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
            <p class="empty-text">No games recorded yet</p>
            <router-link to="/games" class="btn btn-outline">Schedule a game</router-link>
          </div>
        </div>
      </div>

      <!-- Upcoming Training -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Upcoming Training</h3>
          <router-link to="/sessions" class="text-sm text-muted">View all</router-link>
        </div>
        <div class="card-body">
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
            </svg>
            <p class="empty-text">No sessions scheduled</p>
            <router-link to="/sessions" class="btn btn-outline">Add session</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card mt-4">
      <div class="card-header">
        <h3 class="card-title">Quick Actions</h3>
      </div>
      <div class="card-body">
        <div class="quick-actions">
          <router-link to="/players" class="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
            </svg>
            <span>Add Player</span>
          </router-link>

          <router-link to="/games" class="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            <span>Schedule Game</span>
          </router-link>

          <router-link to="/sessions" class="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
            <span>Plan Training</span>
          </router-link>

          <router-link to="/statistics" class="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
            <span>View Statistics</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard component - placeholder only
</script>

<style scoped>
.dashboard {
  width: 100%;
}

/* Stats Cards */
.stats-grid {
  gap: var(--spacing-md);
}

.stat-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.players {
  background: #dbeafe;
  color: #2563eb;
}

.stat-icon.games {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon.training {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.attendance {
  background: #e0e7ff;
  color: #6366f1;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
}

.stat-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0.5rem 0 0 0;
}

.stat-change.positive {
  color: var(--secondary-color);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
}

.empty-icon {
  color: var(--gray-300);
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.action-button svg {
  flex-shrink: 0;
  color: var(--text-secondary);
}

.action-button:hover svg {
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
