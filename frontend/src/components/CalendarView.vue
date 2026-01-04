<template>
  <div class="calendar-view">
    <div v-if="sessions.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
        <path
          fill-rule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clip-rule="evenodd"
        />
      </svg>
      <h3>{{ t('trainingSessions.calendarEmpty') }}</h3>
      <p>{{ t('trainingSessions.calendarEmptyText') }}</p>
    </div>

    <div v-else>
      <div class="calendar-header">
        <button class="nav-btn" @click="previousMonth">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <h3 class="current-month">{{ currentMonthLabel }}</h3>
        <button class="nav-btn" @click="nextMonth">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
      <div
        v-for="(date, index) in calendarDates"
        :key="index"
        class="calendar-cell"
        :class="{
          'other-month': !date.isCurrentMonth,
          'today': date.isToday,
        }"
        @click="handleDateClick(date)"
      >
        <div class="date-number">{{ date.day }}</div>
        <div v-if="date.sessions.length > 0" class="sessions-list">
          <div
            v-for="session in date.sessions"
            :key="session.id"
            class="session-item"
            @click.stop="handleSessionClick(session)"
          >
            <div class="session-header">
              <div class="session-title">{{ session.title }}</div>
              <div class="session-time">
                {{ formatTime(session.startTime) }}{{ session.endTime ? ` - ${formatTime(session.endTime)}` : '' }}
              </div>
            </div>
            <div v-if="session.objectives && session.objectives.length > 0" class="session-objectives">
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
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TrainingSession } from '../types';
import { SessionObjective } from '../types';

interface Props {
  sessions: TrainingSession[];
}

interface Emits {
  (e: 'sessionClick', session: TrainingSession): void;
  (e: 'dateClick', date: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t, locale } = useI18n();

const currentDate = ref(new Date());

interface CalendarDate {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  sessions: TrainingSession[];
}

const weekDays = computed(() => {
  const days = [
    t('trainingSessions.form.sunday').substring(0, 3),
    t('trainingSessions.form.monday').substring(0, 3),
    t('trainingSessions.form.tuesday').substring(0, 3),
    t('trainingSessions.form.wednesday').substring(0, 3),
    t('trainingSessions.form.thursday').substring(0, 3),
    t('trainingSessions.form.friday').substring(0, 3),
    t('trainingSessions.form.saturday').substring(0, 3),
  ];
  return days;
});

const currentMonthLabel = computed(() => {
  return currentDate.value.toLocaleDateString(locale.value, {
    month: 'long',
    year: 'numeric',
  });
});

const calendarDates = computed((): CalendarDate[] => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDateOfMonth = lastDay.getDate();
  const lastDateOfPrevMonth = prevLastDay.getDate();

  const dates: CalendarDate[] = [];

  // Previous month's dates
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = lastDateOfPrevMonth - i;
    const date = new Date(year, month - 1, day);
    dates.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
      sessions: getSessionsForDate(date),
    });
  }

  // Current month's dates
  const today = new Date();
  for (let day = 1; day <= lastDateOfMonth; day++) {
    const date = new Date(year, month, day);
    dates.push({
      date,
      day,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      sessions: getSessionsForDate(date),
    });
  }

  // Next month's dates to fill the grid
  const remainingCells = 42 - dates.length; // 6 weeks * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    dates.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
      sessions: getSessionsForDate(date),
    });
  }

  return dates;
});

const getSessionsForDate = (date: Date): TrainingSession[] => {
  const dateString = date.toISOString().split('T')[0];
  return props.sessions.filter((session) => session.date === dateString);
};

const formatTime = (timeString: string) => {
  return timeString.substring(0, 5); // HH:MM
};

const getObjectiveLabel = (objective: SessionObjective) => {
  return t(`trainingSessions.objectives.${objective}`);
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const handleDateClick = (date: CalendarDate) => {
  if (date.isCurrentMonth) {
    const dateString = date.date.toISOString().split('T')[0];
    emit('dateClick', dateString);
  }
};

const handleSessionClick = (session: TrainingSession) => {
  emit('sessionClick', session);
};
</script>

<style scoped>
.calendar-view {
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
  min-height: 400px;
}

.empty-icon {
  color: var(--gray-300);
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-700);
}

.empty-state p {
  margin: 0;
  color: var(--gray-500);
  font-size: 0.875rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--gray-200);
}

.current-month {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: capitalize;
}

.nav-btn {
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

.nav-btn:hover {
  background-color: var(--gray-100);
  color: var(--gray-800);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-left: 1px solid var(--gray-200);
  border-top: 1px solid var(--gray-200);
}

.day-header {
  padding: var(--spacing-sm);
  text-align: center;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--gray-600);
  background-color: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
}

.calendar-cell {
  min-height: 100px;
  padding: var(--spacing-xs);
  border-right: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.calendar-cell:hover {
  background-color: var(--gray-50);
}

.calendar-cell.other-month {
  background-color: var(--gray-50);
  opacity: 0.5;
}

.calendar-cell.today .date-number {
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.date-number {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item {
  background-color: white;
  border: 1px solid var(--gray-200);
  border-left: 3px solid var(--primary-color);
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.session-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-dark);
}

.session-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-title {
  font-weight: 600;
  color: var(--gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-time {
  color: var(--gray-600);
  font-size: 0.5rem;
}

.session-objectives {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 3px;
}

.objective-badge {
  display: inline-block;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.5rem;
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

@media (max-width: 768px) {
  .calendar-cell {
    min-height: 80px;
  }

  .session-item {
    font-size: 0.5rem;
  }

  .day-header {
    font-size: 0.625rem;
  }
}
</style>
