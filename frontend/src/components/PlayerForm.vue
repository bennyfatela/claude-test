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
            <label for="position">{{ $t('players.form.position') }} *</label>
            <select id="position" v-model="formData.position" required>
              <option value="">{{ $t('players.form.selectPosition') }}</option>
              <option value="GOALKEEPER">{{ $t('players.positions.GOALKEEPER') }}</option>
              <option value="LEFT_WING">{{ $t('players.positions.LEFT_WING') }}</option>
              <option value="LEFT_BACK">{{ $t('players.positions.LEFT_BACK') }}</option>
              <option value="CENTER_BACK">{{ $t('players.positions.CENTER_BACK') }}</option>
              <option value="PIVOT">{{ $t('players.positions.PIVOT') }}</option>
              <option value="RIGHT_BACK">{{ $t('players.positions.RIGHT_BACK') }}</option>
              <option value="RIGHT_WING">{{ $t('players.positions.RIGHT_WING') }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="dateOfBirth">{{ $t('players.form.dateOfBirth') }}</label>
          <input
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            type="date"
          />
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
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? $t('players.form.save') : $t('players.form.add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Player, Position } from '../types';

interface Props {
  player?: Player | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  jerseyNumber: number | null;
  position: Position | '';
  dateOfBirth: string;
  photo: string;
  comments: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

const isEdit = !!props.player;

const formData = reactive<FormData>({
  firstName: props.player?.firstName || '',
  lastName: props.player?.lastName || '',
  jerseyNumber: props.player?.jerseyNumber || null,
  position: props.player?.position || '',
  dateOfBirth: props.player?.dateOfBirth || '',
  photo: props.player?.photo || '',
  comments: props.player?.comments || '',
});

const photoPreview = ref(formData.photo);

function handlePhotoChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

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
  emit('submit', formData);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
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
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
}

.close-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--bg-tertiary);
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
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-tertiary);
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
  color: var(--text-light);
}

.photo-actions {
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .photo-upload-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
