<template>
  <div class="search-bar">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search events by title or location..."
      class="search-input"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-bar {
  width: 100%;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #5c33f6;
}
</style>