<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ t('attendance.markAttendance') }}</h3>
        <button class="close-btn" @click="handleCancel" :title="t('common.close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Legend -->
        <div class="attendance-legend">
          <div class="legend-item">
            <div class="legend-icon present">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="legend-text">{{ t('attendance.present') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon late">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="legend-text">{{ t('attendance.late') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon excused">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="legend-text">{{ t('attendance.excused') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon absent">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="legend-text">{{ t('attendance.absent') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon not_applicable">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="legend-text">{{ t('attendance.not_applicable') }}</span>
          </div>
        </div>

        <div class="attendance-summary">
          <div class="summary-stat">
            <span class="stat-label">{{ t('attendance.present') }}</span>
            <span class="stat-value present">{{ presentCount }}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">{{ t('attendance.absent') }}</span>
            <span class="stat-value absent">{{ absentCount }}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">{{ t('attendance.total') }}</span>
            <span class="stat-value">{{ players.length }}</span>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <p>{{ t('common.loading') }}...</p>
        </div>

        <div v-else-if="players.length === 0" class="empty-state">
          <p>{{ t('attendance.noPlayers') }}</p>
        </div>

        <div v-else class="players-list">
          <div
            v-for="player in players"
            :key="player.id"
            class="player-item"
            :class="{ 'marked': playerAttendance[player.id] }"
          >
            <div class="player-info">
              <div v-if="player.photo" class="player-avatar">
                <img :src="player.photo" :alt="`${player.firstName} ${player.lastName}`" />
              </div>
              <div v-else class="player-avatar-placeholder">
                {{ player.firstName[0] }}{{ player.lastName[0] }}
              </div>
              <div class="player-details">
                <span class="player-name">{{ player.firstName }} {{ player.lastName }}</span>
                <div class="player-meta">
                  <span v-if="player.jerseyNumber" class="player-number">#{{ player.jerseyNumber }}</span>
                  <span v-if="playerAttendance[player.id]" class="player-status" :class="playerAttendance[player.id].toLowerCase()">
                    {{ t(`attendance.${playerAttendance[player.id].toLowerCase()}`) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="attendance-buttons">
              <button
                class="status-btn present"
                :class="{ 'active': playerAttendance[player.id] === 'PRESENT' }"
                @click="markAttendance(player.id, 'PRESENT')"
                :title="t('attendance.present')"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
              <button
                class="status-btn late"
                :class="{ 'active': playerAttendance[player.id] === 'LATE' }"
                @click="markAttendance(player.id, 'LATE')"
                :title="t('attendance.late')"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </button>
              <button
                class="status-btn excused"
                :class="{ 'active': playerAttendance[player.id] === 'EXCUSED' }"
                @click="markAttendance(player.id, 'EXCUSED')"
                :title="t('attendance.excused')"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
              <button
                class="status-btn absent"
                :class="{ 'active': playerAttendance[player.id] === 'ABSENT' }"
                @click="markAttendance(player.id, 'ABSENT')"
                :title="t('attendance.absent')"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
              <button
                class="status-btn not_applicable"
                :class="{ 'active': playerAttendance[player.id] === 'NOT_APPLICABLE' }"
                @click="markAttendance(player.id, 'NOT_APPLICABLE')"
                :title="t('attendance.not_applicable')"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleCancel">
          {{ t('common.cancel') }}
        </button>
        <button class="btn btn-primary" @click="handleSave" :disabled="saving">
          {{ saving ? t('common.saving') : t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apolloClient } from '../graphql/client';
import { GET_PLAYERS } from '../graphql/queries';
import { GET_ATTENDANCE_RECORDS } from '../graphql/queries';
import { RECORD_ATTENDANCE, DELETE_ATTENDANCE } from '../graphql/mutations';
import type { Player, AttendanceStatus, SessionType } from '../types';

interface Props {
  isOpen: boolean;
  sessionId: string;
  sessionType: SessionType;
}

interface Emits {
  (e: 'close'): void;
  (e: 'saved'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const players = ref<Player[]>([]);
const playerAttendance = ref<Record<string, AttendanceStatus>>({});
const originalAttendance = ref<Record<string, AttendanceStatus>>({});
const loading = ref(false);
const saving = ref(false);

const presentCount = computed(() => {
  return Object.values(playerAttendance.value).filter(status => status === 'PRESENT').length;
});

const absentCount = computed(() => {
  return Object.values(playerAttendance.value).filter(status => status === 'ABSENT').length;
});

const fetchPlayers = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_PLAYERS,
    });
    players.value = data.players || [];
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

const fetchAttendance = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ATTENDANCE_RECORDS,
      variables: { sessionId: props.sessionId },
      fetchPolicy: 'network-only',
    });

    const records = data.attendanceRecords || [];
    const attendanceMap: Record<string, AttendanceStatus> = {};

    records.forEach((record: any) => {
      attendanceMap[record.playerId] = record.status;
    });

    playerAttendance.value = { ...attendanceMap };
    originalAttendance.value = { ...attendanceMap };
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

const loadData = async () => {
  loading.value = true;
  await Promise.all([fetchPlayers(), fetchAttendance()]);
  loading.value = false;
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadData();
  }
});

// Load data on mount if dialog is already open (e.g., when created from calendar)
onMounted(() => {
  if (props.isOpen) {
    loadData();
  }
});

const markAttendance = (playerId: string, status: AttendanceStatus) => {
  if (playerAttendance.value[playerId] === status) {
    // Toggle off if clicking the same status
    delete playerAttendance.value[playerId];
  } else {
    playerAttendance.value[playerId] = status;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    const mutations = [];

    // Record/update attendance for all marked players
    for (const [playerId, status] of Object.entries(playerAttendance.value)) {
      mutations.push(
        apolloClient.mutate({
          mutation: RECORD_ATTENDANCE,
          variables: {
            input: {
              playerId,
              sessionId: props.sessionId,
              sessionType: props.sessionType,
              status,
            },
          },
        })
      );
    }

    // Delete attendance for players that were unmarked
    for (const playerId of Object.keys(originalAttendance.value)) {
      if (!(playerId in playerAttendance.value)) {
        mutations.push(
          apolloClient.mutate({
            mutation: DELETE_ATTENDANCE,
            variables: {
              playerId,
              sessionId: props.sessionId,
            },
          })
        );
      }
    }

    await Promise.all(mutations);
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Error saving attendance:', error);
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  emit('close');
};
</script>

<style scoped>
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
  padding: var(--spacing-md);
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: var(--gray-100);
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
}

.attendance-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.legend-icon {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.legend-icon.present {
  background: var(--secondary-color);
}

.legend-icon.late {
  background: #f59e0b;
}

.legend-icon.excused {
  background: #3b82f6;
}

.legend-icon.absent {
  background: var(--danger-color);
}

.legend-icon.not_applicable {
  background: var(--gray-500);
}

.legend-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}

.attendance-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--gray-50);
  border-radius: var(--border-radius);
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray-600);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-800);
}

.stat-value.present {
  color: var(--secondary-color);
}

.stat-value.absent {
  color: var(--danger-color);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--gray-600);
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.player-item:hover {
  border-color: var(--gray-300);
  background: var(--gray-50);
}

.player-item.marked {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.player-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-name {
  font-weight: 500;
  color: var(--gray-800);
}

.player-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.player-number {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.player-status {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.player-status.present {
  background: var(--secondary-color);
  color: white;
}

.player-status.late {
  background: #f59e0b;
  color: white;
}

.player-status.excused {
  background: #3b82f6;
  color: white;
}

.player-status.absent {
  background: var(--danger-color);
  color: white;
}

.player-status.not_applicable {
  background: var(--gray-500);
  color: white;
}

.attendance-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.status-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-300);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.status-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.status-btn.present {
  color: var(--secondary-color);
}

.status-btn.present.active {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
  color: white;
}

.status-btn.late {
  color: #f59e0b;
}

.status-btn.late.active {
  background: #f59e0b;
  border-color: #f59e0b;
  color: white;
}

.status-btn.excused {
  color: #3b82f6;
}

.status-btn.excused.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.status-btn.absent {
  color: var(--danger-color);
}

.status-btn.absent.active {
  background: var(--danger-color);
  border-color: var(--danger-color);
  color: white;
}

.status-btn.not_applicable {
  color: var(--gray-500);
}

.status-btn.not_applicable.active {
  background: var(--gray-500);
  border-color: var(--gray-500);
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .attendance-legend {
    gap: var(--spacing-sm);
  }

  .legend-text {
    font-size: 0.75rem;
  }

  .legend-icon {
    width: 20px;
    height: 20px;
  }

  .attendance-summary {
    grid-template-columns: 1fr;
  }

  .player-item {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .attendance-buttons {
    width: 100%;
    justify-content: space-around;
  }
}
</style>
