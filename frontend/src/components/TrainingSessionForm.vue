<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ editMode ? t('trainingSessions.editSession') : t('trainingSessions.addSession') }}</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="date">{{ t('trainingSessions.form.date') }} *</label>
            <input id="date" v-model="formData.date" type="date" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="startTime">{{ t('trainingSessions.form.startTime') }} *</label>
            <input
              id="startTime"
              v-model="formData.startTime"
              type="time"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="endTime">{{ t('trainingSessions.form.endTime') }}</label>
            <input id="endTime" v-model="formData.endTime" type="time" class="form-control" />
          </div>
        </div>

        <div class="form-group">
          <label for="location">{{ t('trainingSessions.form.location') }}</label>
          <input
            id="location"
            v-model="formData.location"
            type="text"
            class="form-control"
            :placeholder="t('trainingSessions.form.locationPlaceholder')"
          />
        </div>

        <div class="form-group">
          <label>{{ t('trainingSessions.form.objectives') }}</label>
          <div class="checkbox-grid">
            <label
              v-for="option in objectiveOptions"
              :key="option.value"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :checked="formData.objectives?.includes(option.value)"
                @change="toggleObjective(option.value)"
                class="checkbox-input"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('trainingSessions.form.components') }}</label>
          <div class="checkbox-grid">
            <label
              v-for="option in componentOptions"
              :key="option.value"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                :checked="formData.components?.includes(option.value)"
                @change="toggleComponent(option.value)"
                class="checkbox-input"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="comments">{{ t('trainingSessions.form.comments') }}</label>
          <textarea
            id="comments"
            v-model="formData.comments"
            class="form-control"
            rows="2"
            :placeholder="t('trainingSessions.form.commentsPlaceholder')"
          ></textarea>
        </div>

        <div v-if="!editMode" class="form-group">
          <label for="recurringPattern">{{ t('trainingSessions.form.recurringPattern') }}</label>
          <select id="recurringPattern" v-model="formData.recurringPattern" class="form-control">
            <option value="none">{{ t('trainingSessions.form.none') }}</option>
            <option value="weekly">{{ t('trainingSessions.form.weekly') }}</option>
            <option value="custom">{{ t('trainingSessions.form.custom') }}</option>
          </select>
        </div>

        <div v-if="!editMode && formData.recurringPattern === 'custom'" class="form-group">
          <label>{{ t('trainingSessions.form.recurringDays') }}</label>
          <div class="days-buttons">
            <button
              v-for="day in daysOfWeek"
              :key="day.value"
              type="button"
              class="day-button"
              :class="{ 'day-button-active': formData.recurringDays?.includes(day.value) }"
              @click="toggleDay(day.value)"
              :title="day.full"
            >
              {{ day.abbr }}
            </button>
          </div>
        </div>

        <div
          v-if="!editMode && formData.recurringPattern && formData.recurringPattern !== 'none'"
          class="form-group"
        >
          <label for="recurringEndDate">{{ t('trainingSessions.form.endDate') }} *</label>
          <input
            id="recurringEndDate"
            v-model="formData.recurringEndDate"
            type="date"
            class="form-control"
            :min="formData.date"
            required
          />
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            {{ t('common.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editMode ? t('common.save') : t('common.add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TrainingSession } from '../types';
import { SessionObjective, SessionComponent } from '../types';

interface Props {
  isOpen: boolean;
  session?: TrainingSession | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', data: Partial<TrainingSession>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const editMode = computed(() => !!props.session);

const daysOfWeek = computed(() => [
  { full: t('trainingSessions.form.sunday'), abbr: t('trainingSessions.form.dayAbbr.sunday'), value: 0 },
  { full: t('trainingSessions.form.monday'), abbr: t('trainingSessions.form.dayAbbr.monday'), value: 1 },
  { full: t('trainingSessions.form.tuesday'), abbr: t('trainingSessions.form.dayAbbr.tuesday'), value: 2 },
  { full: t('trainingSessions.form.wednesday'), abbr: t('trainingSessions.form.dayAbbr.wednesday'), value: 3 },
  { full: t('trainingSessions.form.thursday'), abbr: t('trainingSessions.form.dayAbbr.thursday'), value: 4 },
  { full: t('trainingSessions.form.friday'), abbr: t('trainingSessions.form.dayAbbr.friday'), value: 5 },
  { full: t('trainingSessions.form.saturday'), abbr: t('trainingSessions.form.dayAbbr.saturday'), value: 6 },
]);

const objectiveOptions = computed(() => [
  { value: SessionObjective.ATTACK, label: t('trainingSessions.objectives.ATTACK') },
  { value: SessionObjective.DEFENSE, label: t('trainingSessions.objectives.DEFENSE') },
  { value: SessionObjective.TRANSITIONS, label: t('trainingSessions.objectives.TRANSITIONS') },
]);

const componentOptions = computed(() => [
  { value: SessionComponent.INDIVIDUAL_TACTIC, label: t('trainingSessions.components.INDIVIDUAL_TACTIC') },
  { value: SessionComponent.INDIVIDUAL_TECHNIC, label: t('trainingSessions.components.INDIVIDUAL_TECHNIC') },
  { value: SessionComponent.GROUP_TACTIC, label: t('trainingSessions.components.GROUP_TACTIC') },
  { value: SessionComponent.COLLECTIVE_TACTIC, label: t('trainingSessions.components.COLLECTIVE_TACTIC') },
]);

const formData = ref<Partial<TrainingSession>>({
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  objectives: [],
  components: [],
  comments: '',
  recurringPattern: 'none',
  recurringDays: [],
  recurringEndDate: '',
});

const toggleObjective = (objective: SessionObjective) => {
  if (!formData.value.objectives) {
    formData.value.objectives = [];
  }
  const index = formData.value.objectives.indexOf(objective);
  if (index > -1) {
    formData.value.objectives.splice(index, 1);
  } else {
    formData.value.objectives.push(objective);
  }
};

const toggleComponent = (component: SessionComponent) => {
  if (!formData.value.components) {
    formData.value.components = [];
  }
  const index = formData.value.components.indexOf(component);
  if (index > -1) {
    formData.value.components.splice(index, 1);
  } else {
    formData.value.components.push(component);
  }
};

const toggleDay = (dayValue: number) => {
  if (!formData.value.recurringDays) {
    formData.value.recurringDays = [];
  }
  const index = formData.value.recurringDays.indexOf(dayValue);
  if (index > -1) {
    formData.value.recurringDays.splice(index, 1);
  } else {
    formData.value.recurringDays.push(dayValue);
  }
};

// Watch for session changes to populate form
watch(
  () => props.session,
  (newSession) => {
    if (newSession) {
      formData.value = {
        date: newSession.date,
        startTime: newSession.startTime,
        endTime: newSession.endTime || '',
        location: newSession.location || '',
        objectives: newSession.objectives || [],
        components: newSession.components || [],
        comments: newSession.comments || '',
        recurringPattern: newSession.recurringPattern || 'none',
        recurringDays: newSession.recurringDays || [],
        recurringEndDate: newSession.recurringEndDate || '',
      };
    }
  },
  { immediate: true }
);

// Watch for modal open to reset form
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && !props.session) {
      // Reset form for new session
      const today = new Date().toISOString().split('T')[0];
      formData.value = {
        date: today,
        startTime: '',
        endTime: '',
        location: '',
        objectives: [],
        components: [],
        comments: '',
        recurringPattern: 'none',
        recurringDays: [],
        recurringEndDate: '',
      };
    }
  }
);

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  const submitData = { ...formData.value };

  // Clean up data based on recurring pattern
  if (submitData.recurringPattern === 'none') {
    delete submitData.recurringDays;
    delete submitData.recurringEndDate;
  } else if (submitData.recurringPattern === 'weekly') {
    delete submitData.recurringDays;
  }

  emit('submit', submitData);
  closeModal();
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
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--gray-100);
  color: var(--gray-600);
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--gray-700);
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.checkbox-label:hover {
  background-color: var(--gray-50);
}

.checkbox-input {
  cursor: pointer;
}

.days-buttons {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.day-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--gray-300);
  background: white;
  color: var(--gray-700);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-button:hover {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
}

.day-button-active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.day-button-active:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--spacing-md);
}

.btn {
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
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background-color: var(--gray-50);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
