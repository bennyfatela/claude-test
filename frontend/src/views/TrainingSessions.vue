<template>
  <div class="training-sessions">
    <div class="page-header">
      <div>
        <p class="text-muted text-sm mb-2">{{ t('trainingSessions.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ t('trainingSessions.viewList') }}
          </button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'calendar' }"
            @click="viewMode = 'calendar'"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            {{ t('trainingSessions.viewCalendar') }}
          </button>
        </div>
        <button class="btn btn-primary" @click="openNewSessionForm">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t('trainingSessions.newSession') }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="sessionsStore.sessionsCount === 0" class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          />
        </svg>
        <h3>{{ t('trainingSessions.noSessions') }}</h3>
        <p class="empty-text">{{ t('trainingSessions.noSessionsText') }}</p>
        <button class="btn btn-primary mt-4" @click="openNewSessionForm">
          {{ t('trainingSessions.planFirstSession') }}
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="sessions-list">
      <TrainingSessionCard
        v-for="session in sessionsStore.getAllSessions"
        :key="session.id"
        :session="session"
        :recurringCount="session.recurringId ? getRecurringCount(session.recurringId) : 0"
        @edit="handleEditSession"
        @delete="handleDeleteSession"
        @deleteAll="handleDeleteAllSessions"
      />
    </div>

    <!-- Calendar View -->
    <CalendarView
      v-else-if="viewMode === 'calendar'"
      :sessions="sessionsStore.getAllSessions"
      @sessionClick="handleEditSession"
      @dateClick="handleDateClick"
    />

    <!-- Session Form Modal -->
    <TrainingSessionForm
      :isOpen="showSessionForm"
      :session="editingSession"
      @close="closeSessionForm"
      @submit="handleSubmitSession"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTrainingSessionsStore } from '../stores/trainingSessions';
import TrainingSessionCard from '../components/TrainingSessionCard.vue';
import TrainingSessionForm from '../components/TrainingSessionForm.vue';
import CalendarView from '../components/CalendarView.vue';
import type { TrainingSession } from '../types';

const { t } = useI18n();
const sessionsStore = useTrainingSessionsStore();

// Fetch sessions when component mounts
onMounted(() => {
  sessionsStore.fetchTrainingSessions();
});

const viewMode = ref<'list' | 'calendar'>('list');
const showSessionForm = ref(false);
const editingSession = ref<TrainingSession | null>(null);

const openNewSessionForm = () => {
  editingSession.value = null;
  showSessionForm.value = true;
};

const closeSessionForm = () => {
  showSessionForm.value = false;
  editingSession.value = null;
};

const handleEditSession = (session: TrainingSession) => {
  editingSession.value = session;
  showSessionForm.value = true;
};

const handleDateClick = (date: string) => {
  // Open form with pre-filled date
  editingSession.value = null;
  showSessionForm.value = true;
};

const handleSubmitSession = async (data: Partial<TrainingSession>) => {
  try {
    console.log('Submitting session with data:', data);
    if (editingSession.value) {
      // Update existing session
      await sessionsStore.updateSession(editingSession.value.id, data);
    } else {
      // Create new session(s)
      await sessionsStore.addSession(data as Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>);
    }
    // Refresh sessions from backend first, then renumber
    await sessionsStore.fetchTrainingSessions();
    await sessionsStore.renumberAllSessions();
  } catch (error) {
    console.error('Error submitting session:', error);
  } finally {
    closeSessionForm();
  }
};

const handleDeleteSession = async (sessionId: string) => {
  try {
    await sessionsStore.deleteSession(sessionId);
    // Refresh sessions from backend first, then renumber
    await sessionsStore.fetchTrainingSessions();
    await sessionsStore.renumberAllSessions();
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

const handleDeleteAllSessions = async (recurringId: string) => {
  try {
    await sessionsStore.deleteAllRecurringSessions(recurringId);
    // Refresh sessions from backend first, then renumber
    await sessionsStore.fetchTrainingSessions();
    await sessionsStore.renumberAllSessions();
  } catch (error) {
    console.error('Error deleting recurring sessions:', error);
  }
};

const getRecurringCount = (recurringId: string): number => {
  return sessionsStore.getSessionsByRecurringId(recurringId).length;
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  background-color: var(--gray-100);
  padding: 4px;
  border-radius: var(--border-radius);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--gray-600);
  transition: all 0.2s;
}

.toggle-btn:hover {
  background-color: var(--gray-200);
}

.toggle-btn.active {
  background-color: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
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

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mt-4 {
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
