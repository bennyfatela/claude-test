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
          <button class="action-btn attendance-btn" @click="showAttendanceDialog = true" :title="t('attendance.markAttendance')">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <span v-if="attendanceCount > 0" class="attendance-badge">{{ attendanceCount }}</span>
          </button>
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
      <div v-if="isRecurring" class="recurring-badge">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ t('trainingSessions.partOfRecurringSeries') }}</span>
      </div>

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

      <!-- Objectives and Components in 2 columns -->
      <div v-if="(session.objectives && session.objectives.length > 0) || (session.components && session.components.length > 0)" class="session-section two-column-section">
        <div v-if="session.objectives && session.objectives.length > 0" class="column">
          <strong class="section-label">{{ t('trainingSessions.form.objectives') }}:</strong>
          <div class="objectives-list">
            <span
              v-for="objective in session.objectives"
              :key="objective"
              class="objective-badge"
              :class="`objective-${objective.toLowerCase()}`"
            >
              {{ getObjectiveLabel(objective) }}
            </span>
          </div>
        </div>

        <div v-if="session.components && session.components.length > 0" class="column">
          <strong class="section-label">{{ t('trainingSessions.form.components') }}:</strong>
          <div class="components-list">
            <span
              v-for="component in session.components"
              :key="component"
              class="component-tag"
            >
              {{ getComponentLabel(component) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Expandable Comments Drawer -->
      <div v-if="session.comments" class="comments-drawer">
        <button class="drawer-toggle" @click="toggleComments">
          <span class="drawer-label">{{ t('trainingSessions.form.comments') }}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="drawer-icon"
            :class="{ 'expanded': showComments }"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <div v-show="showComments" class="drawer-content">
          <p class="session-comments">{{ session.comments }}</p>
        </div>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <ConfirmDialog
      :isOpen="showDeleteModal"
      :title="isRecurring ? t('trainingSessions.deleteSession') : t('trainingSessions.confirmDelete')"
      :message="isRecurring ? t('trainingSessions.deleteRecurringMessage') : t('trainingSessions.confirmDeleteMessage')"
      :danger="true"
      :confirmText="t('common.delete')"
      :verticalButtons="isRecurring"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <template v-if="isRecurring" #footer>
        <button class="btn btn-dialog btn-secondary" @click="deleteThisInstance">
          {{ t('trainingSessions.deleteThisInstance') }}
        </button>
        <button class="btn btn-dialog btn-danger" @click="deleteAllInstances">
          {{ t('trainingSessions.deleteAllInstances') }} ({{ recurringCount }})
        </button>
      </template>
    </ConfirmDialog>

    <!-- Attendance Dialog -->
    <AttendanceDialog
      :isOpen="showAttendanceDialog"
      :sessionId="session.id"
      sessionType="TRAINING"
      @close="showAttendanceDialog = false"
      @saved="handleAttendanceSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmDialog from './ConfirmDialog.vue';
import AttendanceDialog from './AttendanceDialog.vue';
import { apolloClient } from '../graphql/client';
import { GET_ATTENDANCE_RECORDS } from '../graphql/queries';
import type { TrainingSession } from '../types';
import { SessionObjective, SessionComponent } from '../types';

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
const showComments = ref(false);
const showAttendanceDialog = ref(false);
const attendanceCount = ref(0);

const isRecurring = computed(() => !!props.session.recurringId);

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const fetchAttendanceCount = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ATTENDANCE_RECORDS,
      variables: { sessionId: props.session.id },
    });
    attendanceCount.value = (data.attendanceRecords || []).filter((r: any) => r.status === 'PRESENT').length;
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

const handleAttendanceSaved = () => {
  fetchAttendanceCount();
};

onMounted(() => {
  fetchAttendanceCount();
});

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
  return timeString.substring(0, 5); // HH:MM
};

const getObjectiveLabel = (objective: SessionObjective) => {
  return t(`trainingSessions.objectives.${objective}`);
};

const getComponentLabel = (component: SessionComponent) => {
  return t(`trainingSessions.components.${component}`);
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

.attendance-btn {
  position: relative;
}

.attendance-btn:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.attendance-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--secondary-color);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.session-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.recurring-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
  margin-bottom: var(--spacing-xs);
}

.recurring-badge svg {
  flex-shrink: 0;
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

.session-section {
  padding-top: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  border-top: 1px solid var(--gray-100);
}

.two-column-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.column {
  min-width: 0;
}

.section-label {
  display: block;
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.objectives-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.objective-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.objective-attack {
  background-color: #fee2e2;
  color: #991b1b;
}

.objective-defense {
  background-color: #dbeafe;
  color: #1e40af;
}

.objective-transitions {
  background-color: #fef3c7;
  color: #92400e;
}

.components-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.component-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  background-color: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.session-comments {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-700);
  line-height: 1.5;
}

/* Comments Drawer */
.comments-drawer {
  padding-top: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  border-top: 1px solid var(--gray-100);
}

.drawer-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: var(--spacing-xs) 0;
  cursor: pointer;
  color: var(--gray-700);
  font-weight: 500;
  transition: color 0.2s;
}

.drawer-toggle:hover {
  color: var(--primary-color);
}

.drawer-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-600);
}

.drawer-icon {
  color: var(--gray-400);
  transition: transform 0.2s ease;
}

.drawer-icon.expanded {
  transform: rotate(180deg);
}

.drawer-content {
  padding-top: var(--spacing-sm);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-dialog {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-dialog.btn-secondary {
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-dialog.btn-secondary:hover {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
}

.btn-dialog.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-dialog.btn-danger:hover {
  background-color: var(--danger-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .two-column-section {
    grid-template-columns: 1fr;
  }
}
</style>
