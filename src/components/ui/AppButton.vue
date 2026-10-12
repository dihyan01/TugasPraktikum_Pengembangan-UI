<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'button'
  }
})
</script>

<template>
  <button :type="type" :class="['app-button', `btn-${variant}`]">
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
  display: inline-block;
  text-align: center;
  transition: transform 0.2s, background-color 0.25s;
}

.app-button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: var(--primary, #6644ff);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 68, 255, 0.3);
}

.btn-primary:hover {
  background-color: var(--primary-hover, #5533ee);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: var(--text-main);
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary, #6644ff);
  border: 1px solid var(--primary, #6644ff);
}

.btn-outline:hover {
  background-color: rgba(102, 68, 255, 0.1);
}
</style>