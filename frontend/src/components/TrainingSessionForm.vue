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
        <div class="form-group">
          <label for="title">{{ t('trainingSessions.form.title') }} *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="form-control"
            :placeholder="t('trainingSessions.form.titlePlaceholder')"
            required
          />
        </div>

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
          <label for="objective">{{ t('trainingSessions.form.objective') }}</label>
          <textarea
            id="objective"
            v-model="formData.objective"
            class="form-control"
            rows="3"
            :placeholder="t('trainingSessions.form.objectivePlaceholder')"
          ></textarea>
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
          <div class="days-checkboxes">
            <label v-for="(day, index) in daysOfWeek" :key="index" class="checkbox-label">
              <input
                type="checkbox"
                :value="index"
                v-model="formData.recurringDays"
                class="checkbox-input"
              />
              <span>{{ day }}</span>
            </label>
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
  t('trainingSessions.form.sunday'),
  t('trainingSessions.form.monday'),
  t('trainingSessions.form.tuesday'),
  t('trainingSessions.form.wednesday'),
  t('trainingSessions.form.thursday'),
  t('trainingSessions.form.friday'),
  t('trainingSessions.form.saturday'),
]);

const formData = ref<Partial<TrainingSession>>({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  objective: '',
  comments: '',
  recurringPattern: 'none',
  recurringDays: [],
  recurringEndDate: '',
});

// Watch for session changes to populate form
watch(
  () => props.session,
  (newSession) => {
    if (newSession) {
      formData.value = {
        title: newSession.title,
        date: newSession.date,
        startTime: newSession.startTime,
        endTime: newSession.endTime || '',
        location: newSession.location || '',
        objective: newSession.objective || '',
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
        title: '',
        date: today,
        startTime: '',
        endTime: '',
        location: '',
        objective: '',
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

.days-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
