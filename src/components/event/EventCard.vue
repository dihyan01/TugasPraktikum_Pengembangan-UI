<template>
  <AppCard class="event-card-wrapper">
    <div class="event-body">
      <div class="event-meta">
        <span class="event-date">{{ event.date }}</span>
        <span class="event-category">{{ event.cat }}</span>
      </div>

      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-loc">📍 {{ event.loc }}</p>
      <p class="event-desc">{{ event.desc }}</p>

      <div class="card-footer">
        <button class="btn-link" @click="$emit('view-detail', event.id)">
          View Event Details &rarr;
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/ui/AppCard.vue';

defineProps({
  event: {
    type: Object,
    required: true
  }
});

defineEmits(['view-detail']);
</script>

<style scoped>
.event-card-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.event-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.event-date {
  color: #6644ff;
  background: rgba(102, 68, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.event-title {
  margin-bottom: 8px;
  font-size: 1.3rem;
  color: #1a1a1a;
  font-weight: 700;
}

.event-loc {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.event-desc {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  margin-top: auto;
}

.btn-link {
  background: none;
  border: none;
  padding: 0;
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-link:hover {
  color: #6644ff;
}
</style>