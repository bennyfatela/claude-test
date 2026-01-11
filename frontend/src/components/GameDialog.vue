<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditMode ? t('games.editGame') : t('games.scheduleGame') }}</h3>
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
        <form @submit.prevent="handleSubmit">
          <!-- Opponent -->
          <div class="form-group">
            <label for="opponent" class="form-label">{{ t('games.form.opponent') }} *</label>
            <input
              id="opponent"
              v-model="formData.opponent"
              type="text"
              class="form-input"
              :placeholder="t('games.form.opponentPlaceholder')"
              required
            />
          </div>

          <!-- Date and Time -->
          <div class="form-row">
            <div class="form-group">
              <label for="date" class="form-label">{{ t('games.form.date') }} *</label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label for="startTime" class="form-label">{{ t('games.form.startTime') }} *</label>
              <input
                id="startTime"
                v-model="formData.startTime"
                type="time"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Home/Away -->
          <div class="form-group">
            <label class="form-label">{{ t('games.form.gameType') }}</label>
            <div class="game-type-toggle">
              <button
                type="button"
                class="toggle-btn"
                :class="{ active: formData.homeGame }"
                @click="formData.homeGame = true"
              >
                {{ t('games.form.homeGame') }}
              </button>
              <button
                type="button"
                class="toggle-btn"
                :class="{ active: !formData.homeGame }"
                @click="formData.homeGame = false"
              >
                {{ t('games.form.awayGame') }}
              </button>
            </div>
          </div>

          <!-- Location -->
          <div class="form-group">
            <label for="location" class="form-label">{{ t('games.form.location') }}</label>
            <input
              id="location"
              v-model="formData.location"
              type="text"
              class="form-input"
              :placeholder="t('games.form.locationPlaceholder')"
            />
            <p class="form-help">{{ t('games.form.locationHelp') }}</p>
          </div>

          <!-- Final Score -->
          <div class="form-group">
            <label for="finalScore" class="form-label">{{ t('games.form.finalScore') }}</label>
            <input
              id="finalScore"
              v-model="formData.finalScore"
              type="text"
              class="form-input"
              :placeholder="t('games.form.finalScorePlaceholder')"
            />
          </div>

          <!-- Video URL -->
          <div class="form-group">
            <label for="videoUrl" class="form-label">{{ t('games.form.videoUrl') }}</label>
            <input
              id="videoUrl"
              v-model="formData.videoUrl"
              type="url"
              class="form-input"
              :placeholder="t('games.form.videoUrlPlaceholder')"
            />
          </div>

          <!-- Comments -->
          <div class="form-group">
            <label for="comments" class="form-label">{{ t('games.form.comments') }}</label>
            <textarea
              id="comments"
              v-model="formData.comments"
              class="form-textarea"
              rows="4"
              :placeholder="t('games.form.commentsPlaceholder')"
            ></textarea>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleCancel" type="button">
          {{ t('common.cancel') }}
        </button>
        <button class="btn btn-primary" @click="handleSubmit" :disabled="saving" type="button">
          {{ saving ? t('common.saving') : t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Game } from '../types';

interface Props {
  isOpen: boolean;
  game?: Game | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const saving = ref(false);

const formData = ref({
  opponent: '',
  date: '',
  startTime: '',
  location: '',
  homeGame: true,
  finalScore: '',
  videoUrl: '',
  comments: '',
});

const isEditMode = ref(false);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.game) {
        // Edit mode
        isEditMode.value = true;
        formData.value = {
          opponent: props.game.opponent,
          date: props.game.date,
          startTime: props.game.startTime,
          location: props.game.location || '',
          homeGame: props.game.homeGame,
          finalScore: props.game.finalScore || '',
          videoUrl: props.game.videoUrl || '',
          comments: props.game.comments || '',
        };
      } else {
        // Create mode
        isEditMode.value = false;
        formData.value = {
          opponent: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '19:00',
          location: '',
          homeGame: true,
          finalScore: '',
          videoUrl: '',
          comments: '',
        };
      }
    }
  }
);

const handleSubmit = () => {
  const data: any = {
    opponent: formData.value.opponent,
    date: formData.value.date,
    startTime: formData.value.startTime,
    homeGame: formData.value.homeGame,
  };

  // Add optional fields if they have values
  if (formData.value.location) data.location = formData.value.location;
  if (formData.value.finalScore) data.finalScore = formData.value.finalScore;
  if (formData.value.videoUrl) data.videoUrl = formData.value.videoUrl;
  if (formData.value.comments) data.comments = formData.value.comments;

  emit('save', data);
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

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-help {
  margin-top: var(--spacing-xs);
  font-size: 0.75rem;
  color: var(--gray-500);
}

.game-type-toggle {
  display: flex;
  gap: var(--spacing-xs);
  background: var(--gray-100);
  border-radius: var(--border-radius);
  padding: 4px;
}

.toggle-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.toggle-btn:hover:not(.active) {
  color: var(--gray-800);
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

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
