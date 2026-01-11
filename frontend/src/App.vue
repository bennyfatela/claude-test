<template>
  <div id="app" class="app-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#2563eb" opacity="0.1"/>
            <circle cx="16" cy="16" r="10" stroke="#2563eb" stroke-width="2"/>
            <circle cx="16" cy="16" r="4" fill="#2563eb"/>
          </svg>
          <div class="logo-text">
            <h1>{{ t('app.name') }}</h1>
            <p>{{ t('app.subtitle') }}</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span>{{ t('nav.dashboard') }}</span>
        </router-link>

        <router-link to="/players" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          <span>{{ t('nav.players') }}</span>
        </router-link>

        <router-link to="/sessions" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
          </svg>
          <span>{{ t('nav.trainingSessions') }}</span>
        </router-link>

        <router-link to="/games" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
          </svg>
          <span>{{ t('nav.games') }}</span>
        </router-link>

        <router-link to="/drills" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
          </svg>
          <span>{{ t('nav.drills') }}</span>
        </router-link>

        <router-link to="/statistics" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
          <span>{{ t('nav.statistics') }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="team-info">
          <div class="team-badge">U18</div>
          <div class="team-details">
            <p class="team-name">{{ t('team.name') }}</p>
            <p class="team-season">{{ t('team.season') }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-content">
          <div class="breadcrumb">
            <span class="breadcrumb-item">{{ currentPageTitle }}</span>
          </div>
          <div class="header-actions">
            <div class="language-switcher">
              <button
                class="lang-btn"
                :class="{ active: locale === 'en' }"
                @click="changeLanguage('en')"
              >
                EN
              </button>
              <button
                class="lang-btn"
                :class="{ active: locale === 'pt' }"
                @click="changeLanguage('pt')"
              >
                PT
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLocale } from './i18n';

const route = useRoute();
const { t, locale } = useI18n();

const currentPageTitle = computed(() => {
  const routeMap: Record<string, string> = {
    'Dashboard': t('nav.dashboard'),
    'Players': t('nav.players'),
    'TrainingSessions': t('nav.trainingSessions'),
    'Games': t('nav.games'),
    'GameDetails': t('nav.games'),
    'Drills': t('nav.drills'),
    'Statistics': t('nav.statistics'),
  };
  return routeMap[route.name as string] || t('nav.dashboard');
});

function changeLanguage(lang: string) {
  setLocale(lang);
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-text h1 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.logo-text p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.2;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 0.75rem var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background: var(--primary-light);
  color: var(--primary-color);
}

.nav-item svg {
  flex-shrink: 0;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.team-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
}

.team-badge {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.team-details {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.team-season {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.2;
}

/* Main Content Area */
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-md) var(--spacing-xl);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.breadcrumb-item {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.language-switcher {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: 0.25rem;
  border: 1px solid var(--border-color);
}

.lang-btn {
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lang-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.lang-btn.active {
  background: var(--primary-color);
  color: white;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl);
  max-width: 1400px;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .main-content {
    padding: var(--spacing-md);
  }
}
</style>
