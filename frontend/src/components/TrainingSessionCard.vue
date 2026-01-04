<template>
  <div class="session-card">
    <div class="session-header">
      <div class="session-title-row">
        <h3 class="session-title">
          {{ session.title }}
          <svg
            v-if="isRecurring"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="recurring-icon"
            :title="t('trainingSessions.form.recurring')"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </h3>
        <div class="session-actions">
          <button class="action-btn" @click="$emit('edit', session)" :title="t('common.edit')">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </button>
          <button
            class="action-btn delete-btn"
            @click="handleDelete"
            :title="t('common.delete')"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="session-body">
      <div class="session-info">
        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="info-icon">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ formatDate(session.date) }}</span>
        </div>

        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="info-icon">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ formatTime(session.startTime) }}{{ session.endTime ? ` - ${formatTime(session.endTime)}` : '' }}</span>
        </div>

        <div v-if="session.location" class="info-item">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="info-icon">
            <path
              fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ session.location }}</span>
        </div>
      </div>

      <div v-if="session.objective" class="session-objective">
        <strong>{{ t('trainingSessions.form.objective') }}:</strong>
        {{ session.objective }}
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>{{ isRecurring ? t('trainingSessions.deleteSession') : t('trainingSessions.confirmDelete') }}</h3>
        <p v-if="!isRecurring">{{ t('trainingSessions.confirmDelete') }}</p>

        <div v-if="isRecurring" class="delete-options">
          <button class="btn btn-secondary" @click="deleteThisInstance">
            {{ t('trainingSessions.deleteThisInstance') }}
          </button>
          <button class="btn btn-danger" @click="deleteAllInstances">
            {{ t('trainingSessions.deleteAllInstances') }} ({{ recurringCount }})
          </button>
        </div>
        <div v-else class="modal-actions">
          <button class="btn btn-secondary" @click="showDeleteModal = false">
            {{ t('common.cancel') }}
          </button>
          <button class="btn btn-danger" @click="confirmDelete">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TrainingSession } from '../types';

interface Props {
  session: TrainingSession;
  recurringCount?: number;
}

interface Emits {
  (e: 'edit', session: TrainingSession): void;
  (e: 'delete', sessionId: string): void;
  (e: 'deleteAll', recurringId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t, locale } = useI18n();

const showDeleteModal = ref(false);

const isRecurring = computed(() => !!props.session.recurringId);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString: string) => {
  return timeString;
};

const handleDelete = () => {
  showDeleteModal.value = true;
};

const deleteThisInstance = () => {
  emit('delete', props.session.id);
  showDeleteModal.value = false;
};

const deleteAllInstances = () => {
  if (props.session.recurringId) {
    emit('deleteAll', props.session.recurringId);
  }
  showDeleteModal.value = false;
};

const confirmDelete = () => {
  emit('delete', props.session.id);
  showDeleteModal.value = false;
};
</script>

<style scoped>
.session-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  transition: all 0.2s;
}

.session-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--gray-300);
}

.session-header {
  margin-bottom: var(--spacing-md);
}

.session-title-row {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: var(--spacing-md);
}

.session-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.recurring-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.session-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  background: none;
  border: 1px solid var(--gray-300);
  color: var(--gray-600);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: var(--gray-100);
  color: var(--gray-800);
}

.delete-btn:hover {
  background-color: var(--red-50);
  color: var(--red-600);
  border-color: var(--red-300);
}

.session-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.session-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--gray-600);
}

.info-icon {
  color: var(--gray-400);
  flex-shrink: 0;
}

.session-objective {
  font-size: 0.875rem;
  color: var(--gray-700);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--gray-100);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-xl);
}

.modal-content h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1.25rem;
}

.modal-content p {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--gray-600);
}

.delete-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background-color: var(--gray-50);
}

.btn-danger {
  background-color: var(--red-600);
  color: white;
}

.btn-danger:hover {
  background-color: var(--red-700);
}

:root {
  --red-50: #fef2f2;
  --red-300: #fca5a5;
  --red-600: #dc2626;
  --red-700: #b91c1c;
}
</style>
