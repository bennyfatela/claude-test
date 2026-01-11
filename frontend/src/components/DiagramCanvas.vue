<template>
  <div class="diagram-canvas-wrapper">
    <div class="canvas-toolbar">
      <div class="tool-group">
        <button
          v-for="tool in tools"
          :key="tool.id"
          class="tool-btn"
          :class="{ active: selectedTool === tool.id }"
          @click="selectedTool = tool.id"
          :title="tool.title"
        >
          <component :is="tool.icon" />
        </button>
      </div>
      <div class="tool-group">
        <button class="tool-btn" @click="undo" :disabled="history.length === 0" :title="t('drills.diagram.undo')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
        <button class="tool-btn" @click="clear" :title="t('drills.diagram.clear')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      ></canvas>
    </div>

    <div class="canvas-legend">
      <div class="legend-item"><div class="legend-color attacker"></div> {{ t('drills.diagram.attacker') }}</div>
      <div class="legend-item"><div class="legend-color defender"></div> {{ t('drills.diagram.defender') }}</div>
      <div class="legend-item"><div class="legend-color ball"></div> {{ t('drills.diagram.ball') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineComponent, h } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const selectedTool = ref('attacker');
const isDrawing = ref(false);
const startPoint = ref<{ x: number; y: number } | null>(null);
const elements = ref<any[]>([]);
const history = ref<any[]>([]);

const tools = [
  {
    id: 'attacker',
    title: t('drills.diagram.attacker'),
    icon: defineComponent({
      setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'currentColor' }, [
          h('circle', { cx: 10, cy: 10, r: 6, stroke: 'currentColor', fill: '#ef4444', 'stroke-width': 2 })
        ]);
      }
    })
  },
  {
    id: 'defender',
    title: t('drills.diagram.defender'),
    icon: defineComponent({
      setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'currentColor' }, [
          h('circle', { cx: 10, cy: 10, r: 6, stroke: 'currentColor', fill: '#3b82f6', 'stroke-width': 2 })
        ]);
      }
    })
  },
  {
    id: 'ball',
    title: t('drills.diagram.ball'),
    icon: defineComponent({
      setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'currentColor' }, [
          h('circle', { cx: 10, cy: 10, r: 6, fill: '#f59e0b' })
        ]);
      }
    })
  },
  {
    id: 'arrow',
    title: t('drills.diagram.arrow'),
    icon: defineComponent({
      setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'currentColor' }, [
          h('path', { d: 'M2 10 L14 10 M14 10 L10 6 M14 10 L10 14', stroke: 'currentColor', fill: 'none', 'stroke-width': 2 })
        ]);
      }
    })
  },
];

const getMousePos = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const handleMouseDown = (e: MouseEvent) => {
  const pos = getMousePos(e);

  if (selectedTool.value === 'arrow') {
    isDrawing.value = true;
    startPoint.value = pos;
  } else {
    // Add player or ball
    addElement({
      type: selectedTool.value,
      x: pos.x,
      y: pos.y
    });
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDrawing.value || !startPoint.value) return;

  const pos = getMousePos(e);
  redraw();

  // Draw temporary arrow
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) {
    drawArrow(ctx, startPoint.value.x, startPoint.value.y, pos.x, pos.y, '#000');
  }
};

const handleMouseUp = (e: MouseEvent) => {
  if (!isDrawing.value || !startPoint.value) return;

  const pos = getMousePos(e);
  addElement({
    type: 'arrow',
    x1: startPoint.value.x,
    y1: startPoint.value.y,
    x2: pos.x,
    y2: pos.y
  });

  isDrawing.value = false;
  startPoint.value = null;
};

const addElement = (element: any) => {
  history.value.push([...elements.value]);
  elements.value.push(element);
  redraw();
  saveToModel();
};

const redraw = () => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw court background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw court lines
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 10);
  ctx.lineTo(canvas.width / 2, canvas.height - 10);
  ctx.stroke();

  // Draw elements
  elements.value.forEach(element => {
    if (element.type === 'attacker') {
      ctx.beginPath();
      ctx.arc(element.x, element.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (element.type === 'defender') {
      ctx.beginPath();
      ctx.arc(element.x, element.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (element.type === 'ball') {
      // Draw ball (circle)
      ctx.beginPath();
      ctx.arc(element.x, element.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    } else if (element.type === 'arrow') {
      drawArrow(ctx, element.x1, element.y1, element.x2, element.y2, '#000');
    }
  });
};

const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
  const headLength = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
};

const undo = () => {
  if (history.value.length > 0) {
    elements.value = history.value.pop() || [];
    redraw();
    saveToModel();
  }
};

const clear = () => {
  if (confirm(t('drills.diagram.confirmClear'))) {
    history.value.push([...elements.value]);
    elements.value = [];
    redraw();
    saveToModel();
  }
};

const saveToModel = () => {
  emit('update:modelValue', JSON.stringify(elements.value));
};

const loadFromModel = () => {
  if (props.modelValue) {
    try {
      elements.value = JSON.parse(props.modelValue);
      redraw();
    } catch (e) {
      console.error('Failed to parse diagram data', e);
    }
  }
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.width = 600;
    canvas.height = 400;
    loadFromModel();
    redraw();
  }
});

watch(() => props.modelValue, loadFromModel);
</script>

<style scoped>
.diagram-canvas-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  background: white;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--gray-200);
}

.tool-group {
  display: flex;
  gap: var(--spacing-xs);
}

.tool-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-300);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  transition: all 0.2s;
}

.tool-btn:hover:not(:disabled) {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.tool-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.canvas-container {
  display: flex;
  justify-content: center;
  overflow: auto;
}

canvas {
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  cursor: crosshair;
  background: white;
}

.canvas-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--gray-200);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--gray-700);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--gray-800);
}

.legend-color.attacker {
  background: #ef4444;
}

.legend-color.defender {
  background: #3b82f6;
}

.legend-color.ball {
  background: #f59e0b;
}
</style>
