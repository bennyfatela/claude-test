<template>
  <div class="position-filter">
    <label for="position-select" class="filter-label">{{ t('common.filter') }}:</label>
    <div class="filter-controls">
      <select
        id="position-select"
        v-model="selectedValue"
        @change="handleChange"
        class="filter-select"
      >
        <optgroup :label="t('players.positionGroups.goalkeeper')">
          <option value="GOALKEEPER">{{ t('players.positions.goalkeeper') }}</option>
        </optgroup>

        <optgroup :label="t('players.positionGroups.wings')">
          <option value="LEFT_WING">{{ t('players.positions.leftWing') }}</option>
          <option value="RIGHT_WING">{{ t('players.positions.rightWing') }}</option>
        </optgroup>

        <optgroup :label="t('players.positionGroups.backs')">
          <option value="LEFT_BACK">{{ t('players.positions.leftBack') }}</option>
          <option value="RIGHT_BACK">{{ t('players.positions.rightBack') }}</option>
        </optgroup>

        <optgroup :label="t('players.positionGroups.centerBack')">
          <option value="CENTER_BACK">{{ t('players.positions.centerBack') }}</option>
        </optgroup>

        <optgroup :label="t('players.positionGroups.pivot')">
          <option value="PIVOT">{{ t('players.positions.pivot') }}</option>
        </optgroup>
      </select>

      <button
        type="button"
        class="clear-filter-btn"
        :class="{ 'active': !selectedValue }"
        @click="clearFilter"
        :title="t('players.positions.all')"
      >
        {{ t('players.positions.all') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Position } from '../types';

interface Props {
  modelValue: Position | null;
}

interface Emits {
  (e: 'update:modelValue', value: Position | null): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const selectedValue = ref<string>(props.modelValue || '');

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value as Position | '';
  emit('update:modelValue', value || null);
}

function clearFilter() {
  selectedValue.value = '';
  emit('update:modelValue', null);
}
</script>

<style scoped>
.position-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-controls {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.filter-select {
  padding: 0.375rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  max-width: 200px;
}

.clear-filter-btn {
  padding: 0.375rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.clear-filter-btn:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.clear-filter-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-select:hover {
  border-color: var(--primary-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.filter-select option {
  padding: 0.5rem;
}

.filter-select optgroup {
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .position-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    min-width: 100%;
  }
}
</style>
