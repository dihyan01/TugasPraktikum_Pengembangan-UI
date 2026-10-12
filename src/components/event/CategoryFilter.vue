<template>
  <div class="category-filter">
    <button
      v-for="cat in categories"
      :key="cat"
      :class="['filter-btn', { active: modelValue === cat }]"
      @click="$emit('update:modelValue', cat)"
    >
      {{ cat }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: 'All'
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-btn {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #555555;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #5c33f6;
  color: #5c33f6;
}

.filter-btn.active {
  background-color: #5c33f6;
  color: #ffffff;
  border-color: #5c33f6;
}
</style>