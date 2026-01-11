<template>
  <div class="drill-edit-page">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-nav">
      <router-link to="/drills" class="breadcrumb-link">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
        </svg>
        {{ t('nav.drills') }}
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ isEditMode ? t('drills.editDrill') : t('drills.createDrill') }}</span>
    </div>

    <!-- Page Title -->
    <div class="page-header">
      <h1>{{ isEditMode ? t('drills.editDrill') : t('drills.createDrill') }}</h1>
    </div>

    <!-- Drill Form -->
    <div class="drill-form-container">
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

        <!-- Form Actions -->
        <div class="form-actions">
          <button class="btn btn-secondary" @click="handleCancel" type="button">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ saving ? t('common.saving') : t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apolloClient } from '../apollo';
import { GET_DRILL } from '../graphql/queries';
import { CREATE_DRILL, UPDATE_DRILL } from '../graphql/mutations';
import DiagramCanvas from '../components/DiagramCanvas.vue';
import type { Drill } from '../types';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const saving = ref(false);
const isEditMode = ref(false);
const drillId = ref<string | null>(null);

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

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    isEditMode.value = true;
    drillId.value = id;
    await loadDrill(id);
  }
});

const loadDrill = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_DRILL,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    if (data.drill) {
      const drill = data.drill as Drill;
      formData.value = {
        name: drill.name,
        description: drill.description || '',
        objectives: drill.objectives && drill.objectives.length > 0 ? [...drill.objectives] : [''],
        feedback: drill.feedback || '',
        duration: drill.duration,
        category: drill.category || '',
        isTemplate: drill.isTemplate,
        imageUrl: drill.imageUrl || '',
        videoUrl: drill.videoUrl || '',
        diagramData: drill.diagramData || '',
      };
    }
  } catch (error) {
    console.error('Error loading drill:', error);
    alert('Failed to load drill');
  }
};

const addObjective = () => {
  formData.value.objectives.push('');
};

const removeObjective = (index: number) => {
  formData.value.objectives.splice(index, 1);
};

const handleSubmit = async () => {
  saving.value = true;

  try {
    const objectives = formData.value.objectives.filter(o => o.trim() !== '');

    const input: any = {
      name: formData.value.name,
      isTemplate: formData.value.isTemplate,
    };

    if (formData.value.description) input.description = formData.value.description;
    if (objectives.length > 0) input.objectives = objectives;
    if (formData.value.feedback) input.feedback = formData.value.feedback;
    if (formData.value.duration) input.duration = formData.value.duration;
    if (formData.value.category) input.category = formData.value.category;
    if (formData.value.imageUrl) input.imageUrl = formData.value.imageUrl;
    if (formData.value.videoUrl) input.videoUrl = formData.value.videoUrl;
    if (formData.value.diagramData) input.diagramData = formData.value.diagramData;

    if (isEditMode.value && drillId.value) {
      await apolloClient.mutate({
        mutation: UPDATE_DRILL,
        variables: { id: drillId.value, input },
        refetchQueries: ['GetDrills', 'GetDrillTemplates'],
      });
    } else {
      await apolloClient.mutate({
        mutation: CREATE_DRILL,
        variables: { input },
        refetchQueries: ['GetDrills', 'GetDrillTemplates'],
      });
    }

    router.push('/drills');
  } catch (error) {
    console.error('Error saving drill:', error);
    alert('Failed to save drill');
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  router.push('/drills');
};
</script>

<style scoped>
.drill-edit-page {
  max-width: 900px;
  margin: 0 auto;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  font-size: 0.875rem;
  color: var(--gray-600);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s;
}

.breadcrumb-link:hover {
  color: var(--primary-hover);
}

.breadcrumb-separator {
  color: var(--gray-400);
}

.breadcrumb-current {
  color: var(--gray-700);
  font-weight: 500;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.drill-form-container {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
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
  flex-shrink: 0;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
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
  .drill-form-container {
    padding: var(--spacing-md);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
