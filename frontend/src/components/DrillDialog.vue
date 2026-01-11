<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content large">
      <div class="modal-header">
        <h3>{{ isEditMode ? t('drills.editDrill') : t('drills.createDrill') }}</h3>
        <button class="close-btn" @click="handleCancel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group full-width">
              <label class="form-label">{{ t('drills.form.name') }} *</label>
              <input v-model="formData.name" type="text" class="form-input" :placeholder="t('drills.form.namePlaceholder')" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('drills.form.duration') }}</label>
              <input v-model.number="formData.duration" type="number" class="form-input" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('drills.form.category') }}</label>
              <input v-model="formData.category" type="text" class="form-input" :placeholder="t('drills.form.categoryPlaceholder')" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('drills.form.description') }}</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3" :placeholder="t('drills.form.descriptionPlaceholder')"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('drills.form.objectives') }}</label>
            <div class="objectives-list">
              <div v-for="(objective, index) in formData.objectives" :key="index" class="objective-item">
                <input v-model="formData.objectives[index]" type="text" class="form-input" :placeholder="t('drills.form.objectivesPlaceholder')" />
                <button type="button" class="remove-btn" @click="removeObjective(index)">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
              <button type="button" class="add-btn" @click="addObjective">+ {{ t('drills.form.objectivesPlaceholder') }}</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('drills.form.feedback') }}</label>
            <textarea v-model="formData.feedback" class="form-textarea" rows="3" :placeholder="t('drills.form.feedbackPlaceholder')"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('drills.form.diagram') }}</label>
            <DiagramCanvas v-model="formData.diagramData" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('drills.form.imageUrl') }}</label>
              <input v-model="formData.imageUrl" type="url" class="form-input" :placeholder="t('drills.form.imageUrlPlaceholder')" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('drills.form.videoUrl') }}</label>
              <input v-model="formData.videoUrl" type="url" class="form-input" :placeholder="t('drills.form.videoUrlPlaceholder')" />
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.isTemplate" type="checkbox" />
              <span>{{ t('drills.form.isTemplate') }}</span>
            </label>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleCancel" type="button">{{ t('common.cancel') }}</button>
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
import DiagramCanvas from './DiagramCanvas.vue';
import type { Drill } from '../types';

interface Props {
  isOpen: boolean;
  drill?: Drill | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const saving = ref(false);
const isEditMode = ref(false);

const formData = ref({
  name: '',
  description: '',
  objectives: [''] as string[],
  feedback: '',
  duration: undefined as number | undefined,
  category: '',
  isTemplate: true,
  imageUrl: '',
  videoUrl: '',
  diagramData: '',
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.drill) {
      isEditMode.value = true;
      formData.value = {
        name: props.drill.name,
        description: props.drill.description || '',
        objectives: props.drill.objectives && props.drill.objectives.length > 0 ? [...props.drill.objectives] : [''],
        feedback: props.drill.feedback || '',
        duration: props.drill.duration,
        category: props.drill.category || '',
        isTemplate: props.drill.isTemplate,
        imageUrl: props.drill.imageUrl || '',
        videoUrl: props.drill.videoUrl || '',
        diagramData: props.drill.diagramData || '',
      };
    } else {
      isEditMode.value = false;
      formData.value = {
        name: '',
        description: '',
        objectives: [''],
        feedback: '',
        duration: undefined,
        category: '',
        isTemplate: true,
        imageUrl: '',
        videoUrl: '',
        diagramData: '',
      };
    }
  }
});

const addObjective = () => {
  formData.value.objectives.push('');
};

const removeObjective = (index: number) => {
  formData.value.objectives.splice(index, 1);
};

const handleSubmit = () => {
  const objectives = formData.value.objectives.filter(o => o.trim() !== '');

  const data: any = {
    name: formData.value.name,
    isTemplate: formData.value.isTemplate,
  };

  if (formData.value.description) data.description = formData.value.description;
  if (objectives.length > 0) data.objectives = objectives;
  if (formData.value.feedback) data.feedback = formData.value.feedback;
  if (formData.value.duration) data.duration = formData.value.duration;
  if (formData.value.category) data.category = formData.value.category;
  if (formData.value.imageUrl) data.imageUrl = formData.value.imageUrl;
  if (formData.value.videoUrl) data.videoUrl = formData.value.videoUrl;
  if (formData.value.diagramData) data.diagramData = formData.value.diagramData;

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
}

.modal-content.large {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
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
  overflow-y: auto;
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group.full-width {
  grid-column: 1 / -1;
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
  transition: all 0.2s;
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
}

.objectives-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.objective-item {
  display: flex;
  gap: var(--spacing-xs);
}

.objective-item .form-input {
  flex: 1;
  margin-bottom: 0;
}

.remove-btn {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
}

.add-btn {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px dashed var(--gray-300);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--gray-200);
  border-color: var(--gray-400);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
  transition: all 0.2s;
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

@media (max-width: 768px) {
  .modal-content.large {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
