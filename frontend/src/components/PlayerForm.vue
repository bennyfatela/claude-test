<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? $t('players.editPlayer') : $t('players.addPlayer') }}</h3>
        <button class="close-btn" @click="emit('close')" type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Photo Upload -->
        <div class="photo-upload-section">
          <div class="photo-preview">
            <img v-if="photoPreview" :src="photoPreview" alt="Player photo" />
            <div v-else class="photo-placeholder">
              <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
            </div>
          </div>
          <div class="photo-actions">
            <label for="photo-input" class="btn btn-outline">
              {{ photoPreview ? $t('players.form.changePhoto') : $t('players.form.uploadPhoto') }}
            </label>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              @change="handlePhotoChange"
              style="display: none"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">{{ $t('players.form.firstName') }} *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="John"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">{{ $t('players.form.lastName') }} *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="jerseyNumber">{{ $t('players.form.jerseyNumber') }}</label>
            <input
              id="jerseyNumber"
              v-model.number="formData.jerseyNumber"
              type="number"
              placeholder="7"
              min="1"
              max="99"
            />
          </div>

          <div class="form-group">
            <label for="dateOfBirth">{{ $t('players.form.dateOfBirth') }}</label>
            <input
              id="dateOfBirth"
              v-model="formData.dateOfBirth"
              type="date"
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('players.form.positions') }} *</label>
          <div class="chip-grid">
            <button
              v-for="pos in positionOptions"
              :key="pos.value"
              type="button"
              class="chip"
              :class="{ 'chip-active': formData.positions.includes(pos.value) }"
              @click="togglePosition(pos.value)"
            >
              {{ pos.label }}
            </button>
          </div>
          <p v-if="formData.positions.length === 0" class="error-text">{{ $t('players.form.selectAtLeastOnePosition') }}</p>
        </div>

        <div class="form-group">
          <label for="comments">{{ $t('players.form.comments') }}</label>
          <textarea
            id="comments"
            v-model="formData.comments"
            :placeholder="$t('players.form.commentsPlaceholder')"
            rows="3"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="emit('close')">
            {{ $t('players.form.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="formData.positions.length === 0">
            {{ isEdit ? $t('players.form.save') : $t('players.form.add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Player, Position } from '../types';

interface Props {
  player?: Player | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  jerseyNumber: number | null;
  positions: Position[];
  dateOfBirth: string;
  photo: string;
  comments: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

const { t } = useI18n();
const isEdit = !!props.player;

const formData = reactive<FormData>({
  firstName: props.player?.firstName || '',
  lastName: props.player?.lastName || '',
  jerseyNumber: props.player?.jerseyNumber || null,
  positions: props.player?.positions ? [...props.player.positions] : [], // Create a copy to avoid frozen array issues
  dateOfBirth: props.player?.dateOfBirth || '',
  photo: props.player?.photo || '',
  comments: props.player?.comments || '',
});

const photoPreview = ref<string>(formData.photo);

const positionNameMap: Record<Position, string> = {
  GOALKEEPER: 'goalkeeper',
  LEFT_WING: 'leftWing',
  LEFT_BACK: 'leftBack',
  CENTER_BACK: 'centerBack',
  PIVOT: 'pivot',
  RIGHT_BACK: 'rightBack',
  RIGHT_WING: 'rightWing',
};

const positionOptions = computed(() => {
  return Object.entries(positionNameMap).map(([value, key]) => ({
    value: value as Position,
    label: t(`players.positions.${key}`),
  }));
});

function togglePosition(position: Position) {
  const index = formData.positions.indexOf(position);
  if (index > -1) {
    formData.positions.splice(index, 1);
  } else {
    formData.positions.push(position);
  }
}

function handlePhotoChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      photoPreview.value = result;
      formData.photo = result;
    };
    reader.readAsDataURL(file);
  }
}

function handleSubmit() {
  if (formData.positions.length === 0) {
    return;
  }
  emit('submit', { ...formData });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.photo-upload-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  color: var(--text-muted);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.chip {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--gray-300);
  background: white;
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.chip:hover {
  background-color: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
}

.chip-active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.chip-active:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.error-text {
  color: var(--danger-color);
  font-size: 0.8125rem;
  margin: 0.25rem 0 0 0;
}

.modal-footer {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn {
  flex: 1;
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-outline {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-secondary);
  border-color: var(--gray-400);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
