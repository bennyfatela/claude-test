<template>
  <div class="position-filter">
    <label for="position-select" class="filter-label">{{ t('common.filter') }}:</label>
    <select
      id="position-select"
      v-model="selectedValue"
      @change="handleChange"
      class="filter-select"
    >
      <option value="">{{ t('players.positions.all') }}</option>

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
</script>

<style scoped>
.position-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--bg-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-select {
  flex: 1;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
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
