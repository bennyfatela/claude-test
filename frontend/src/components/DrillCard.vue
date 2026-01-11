<template>
  <div class="drill-card">
    <div class="card-header">
      <div class="drill-info">
        <h4 class="drill-name">{{ drill.name }}</h4>
        <div class="drill-meta">
          <span v-if="drill.duration" class="meta-item">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            {{ drill.duration }} min
          </span>
          <span v-if="drill.category" class="meta-item category">{{ drill.category }}</span>
          <span v-if="drill.isTemplate" class="meta-item template-badge">Template</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="action-btn" @click="$emit('edit')" :title="t('common.edit')">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete')" :title="t('common.delete')">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-body">
      <p v-if="drill.description" class="drill-description">{{ drill.description }}</p>

      <div v-if="drill.objectives && drill.objectives.length > 0" class="objectives">
        <h5>{{ t('drills.form.objectives') }}:</h5>
        <ul>
          <li v-for="(obj, index) in drill.objectives" :key="index">{{ obj }}</li>
        </ul>
      </div>

      <div v-if="drill.feedback" class="feedback">
        <h5>{{ t('drills.form.feedback') }}:</h5>
        <p>{{ drill.feedback }}</p>
      </div>

      <div v-if="drill.imageUrl || drill.videoUrl" class="media-links">
        <a v-if="drill.imageUrl" :href="drill.imageUrl" target="_blank" class="media-link">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
          </svg>
          {{ t('drills.form.imageUrl') }}
        </a>
        <a v-if="drill.videoUrl" :href="drill.videoUrl" target="_blank" class="media-link">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
          </svg>
          {{ t('drills.form.videoUrl') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Drill } from '../types';

interface Props {
  drill: Drill;
}

defineProps<Props>();
defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const { t } = useI18n();
</script>

<style scoped>
.drill-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all 0.2s;
  border-left: 4px solid var(--secondary-color);
}

.drill-card:hover {
  box-shadow: var(--shadow-md);
  border-left-color: #10b981;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50);
}

.drill-info {
  flex: 1;
}

.drill-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
}

.drill-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: var(--gray-600);
}

.meta-item svg {
  color: var(--gray-400);
}

.meta-item.category {
  background: var(--primary-light);
  color: var(--primary-color);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.meta-item.template-badge {
  background: var(--secondary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
}

.card-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  background: white;
  border: 1px solid var(--gray-300);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--primary-light);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.delete-btn:hover {
  background: #fee2e2;
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.card-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.drill-description {
  margin: 0;
  color: var(--gray-700);
  line-height: 1.5;
  font-size: 0.9375rem;
}

.objectives,
.feedback {
  padding: var(--spacing-md);
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--secondary-color);
}

.objectives h5,
.feedback h5 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-800);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.objectives ul {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--gray-700);
  font-size: 0.875rem;
}

.objectives li {
  margin-bottom: 0.25rem;
}

.feedback p {
  margin: 0;
  color: var(--gray-700);
  font-size: 0.875rem;
  line-height: 1.5;
}

.media-links {
  display: flex;
  gap: var(--spacing-md);
}

.media-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.media-link:hover {
  background: var(--primary-light);
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
