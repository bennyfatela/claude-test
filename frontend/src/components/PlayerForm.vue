<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? 'Editar Jogador' : 'Adicionar Jogador' }}</h3>
        <button class="close-btn" @click="emit('close')" type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Nome *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="João"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">Apelido *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="Silva"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="jerseyNumber">Número da Camisola</label>
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
            <label for="position">Posição *</label>
            <select id="position" v-model="formData.position" required>
              <option value="">Selecione...</option>
              <option value="GOALKEEPER">Guarda-Redes</option>
              <option value="LEFT_WING">Ponta Esquerda</option>
              <option value="LEFT_BACK">Lateral Esquerdo</option>
              <option value="CENTER_BACK">Central</option>
              <option value="PIVOT">Pivot</option>
              <option value="RIGHT_BACK">Lateral Direito</option>
              <option value="RIGHT_WING">Ponta Direita</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="dateOfBirth">Data de Nascimento</label>
          <input
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            type="date"
          />
        </div>

        <div class="form-group">
          <label for="comments">Comentários</label>
          <textarea
            id="comments"
            v-model="formData.comments"
            placeholder="Notas sobre o jogador..."
            rows="3"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? 'Guardar' : 'Adicionar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
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
  comments: props.player?.comments || '',
});

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
}
</style>
