<template>
  <div class="drills">
    <div class="page-header">
      <div>
        <p class="text-muted text-sm mb-2">{{ t('drills.subtitle') }}</p>
      </div>
      <router-link to="/drills/new" class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        {{ t('drills.createDrill') }}
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <p>{{ t('common.loading') }}...</p>
    </div>

    <div v-else-if="drills.length === 0" class="card">
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" class="empty-icon">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
        </svg>
        <h3>{{ t('drills.noDrills') }}</h3>
        <p class="empty-text">{{ t('drills.noDrillsText') }}</p>
        <router-link to="/drills/new" class="btn btn-primary mt-4">{{ t('drills.createFirstDrill') }}</router-link>
      </div>
    </div>

    <div v-else class="drills-container">
      <!-- Templates -->
      <div v-if="templates.length > 0" class="drills-section">
        <h3 class="section-title">{{ t('drills.templates') }}</h3>
        <div class="drills-grid">
          <DrillCard
            v-for="drill in templates"
            :key="drill.id"
            :drill="drill"
            @edit="navigateToEdit(drill.id)"
            @delete="handleDeleteDrill(drill)"
          />
        </div>
      </div>

      <!-- My Drills -->
      <div v-if="myDrills.length > 0" class="drills-section">
        <h3 class="section-title">{{ t('drills.myDrills') }}</h3>
        <div class="drills-grid">
          <DrillCard
            v-for="drill in myDrills"
            :key="drill.id"
            :drill="drill"
            @edit="navigateToEdit(drill.id)"
            @delete="handleDeleteDrill(drill)"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="closeDeleteConfirm">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3>{{ t('drills.deleteDrill') }}</h3>
          <button class="close-btn" @click="closeDeleteConfirm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ t('drills.confirmDelete') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDeleteConfirm">{{ t('common.cancel') }}</button>
          <button class="btn btn-danger" @click="confirmDelete">{{ t('common.delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apolloClient } from '../graphql/client';
import { GET_DRILLS } from '../graphql/queries';
import { DELETE_DRILL } from '../graphql/mutations';
import DrillCard from '../components/DrillCard.vue';
import type { Drill } from '../types';

const router = useRouter();
const { t } = useI18n();

const drills = ref<Drill[]>([]);
const loading = ref(false);
const showDeleteConfirm = ref(false);
const drillToDelete = ref<Drill | null>(null);

const templates = computed(() => drills.value.filter(d => d.isTemplate));
const myDrills = computed(() => drills.value.filter(d => !d.isTemplate));

const fetchDrills = async () => {
  loading.value = true;
  try {
    const { data } = await apolloClient.query({
      query: GET_DRILLS,
      fetchPolicy: 'network-only',
    });
    drills.value = data.drills || [];
  } catch (error) {
    console.error('Error fetching drills:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToEdit = (id: string) => {
  router.push(`/drills/${id}/edit`);
};

const handleDeleteDrill = (drill: Drill) => {
  drillToDelete.value = drill;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  drillToDelete.value = null;
};

const confirmDelete = async () => {
  if (!drillToDelete.value) return;

  try {
    await apolloClient.mutate({
      mutation: DELETE_DRILL,
      variables: {
        id: drillToDelete.value.id,
      },
    });
    await fetchDrills();
    closeDeleteConfirm();
  } catch (error) {
    console.error('Error deleting drill:', error);
  }
};

onMounted(() => {
  fetchDrills();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--gray-600);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.empty-icon {
  color: var(--gray-300);
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
}

.empty-text {
  max-width: 400px;
  margin-bottom: 0;
}

.drills-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.drills-section {
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.section-title {
  padding: var(--spacing-lg);
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-800);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.drills-grid {
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

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

.modal-content.delete-modal {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 400px;
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  text-decoration: none;
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

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .drills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
