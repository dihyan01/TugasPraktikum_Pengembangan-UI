
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :type="type"
    :class="['app-button', `btn-${variant}`]"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  transition: transform 0.2s, background-color 0.25s;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.app-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background-color: var(--primary, #6644ff);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 68, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover, #5533ee);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: var(--text-main);
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary, #6644ff);
  border: 1px solid var(--primary, #6644ff);
}

.btn-outline:hover:not(:disabled) {
  background-color: rgba(102, 68, 255, 0.1);
}

/* MODUL 6 - LOADING SPINNER */
.btn-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>