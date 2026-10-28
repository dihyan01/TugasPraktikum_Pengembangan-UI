
<script setup>
import { computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'

// ==========================================
// MODUL 5 - ORGANIZER EVENT CARD
// ==========================================

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'view-detail',
  'complete',
  'delete'
])

// ==========================================
// DERIVED STATE
// ==========================================

const isCompleted = computed(() => {
  return props.event.done === true
})

const formattedLocation = computed(() => {
  const location = String(props.event.loc || '').trim()

  if (!location) return 'Location TBA'

  return location.startsWith('📍')
    ? location
    : `📍 ${location}`
})

// ==========================================
// EVENT HANDLERS
// ==========================================

const handleViewDetail = () => {
  emit('view-detail', props.event.id)
}

const handleComplete = () => {
  if (!isCompleted.value) {
    emit('complete', props.event)
  }
}

const handleDelete = () => {
  emit('delete', props.event)
}
</script>

<template>
  <AppCard
    class="organizer-event-card"
    :class="{ 'card-completed': isCompleted }"
  >

    <!-- CARD HEADER -->
    <div class="card-header">

      <span class="category-badge">
        {{ event.cat }}
      </span>

      <span
        class="status-badge"
        :class="isCompleted
          ? 'status-completed'
          : 'status-active'"
      >
        {{ isCompleted ? 'Completed' : 'Active' }}
      </span>

    </div>

    <!-- EVENT INFORMATION -->
    <h3
      class="event-title"
      :class="{ 'text-strike': isCompleted }"
    >
      {{ event.title }}
    </h3>

    <div class="event-meta">
      <p>📅 {{ event.date }}</p>
      <p>{{ formattedLocation }}</p>
      <p>👥 {{ event.quota }} seats remaining</p>
    </div>

    <p class="event-description">
      {{ event.desc }}
    </p>

    <!-- COMPLETED NOTICE -->
    <div
      v-if="isCompleted"
      class="completed-notice"
    >
      🔒 This event has ended and is archived
      from the public catalog.
    </div>

    <!-- CARD FOOTER -->
    <div class="card-actions">

      <button
        v-if="!isCompleted"
        type="button"
        class="action-btn detail-btn"
        @click="handleViewDetail"
      >
        👁️ View Details
      </button>

      <button
        v-if="!isCompleted"
        type="button"
        class="action-btn complete-btn"
        @click="handleComplete"
      >
        ✅ Complete Event
      </button>

      <button
        type="button"
        class="action-btn delete-btn"
        @click="handleDelete"
      >
        🗑️ {{ isCompleted ? 'Delete from Archive' : 'Delete' }}
      </button>

    </div>

  </AppCard>
</template>

<style scoped>
.organizer-event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.04);
  font-family: Inter, Arial, sans-serif;
  transition: 0.2s ease;
}

.organizer-event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 25px rgba(25, 23, 67, 0.08);
}

.card-completed {
  background: #fafbfc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.category-badge {
  background: #f0edff;
  color: #6644ff;
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge {
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.status-active {
  color: #15803d;
  background: #dcfce7;
}

.status-completed {
  color: #64748b;
  background: #e2e8f0;
}

.event-title {
  margin: 0 0 15px;
  color: #1c1948;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.text-strike {
  text-decoration: line-through;
  color: #9292a0;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 16px;
}

.event-meta p {
  margin: 0;
  color: #777789;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.event-description {
  color: #858592;
  font-size: 12px;
  line-height: 1.7;
  margin: 0 0 20px;
  flex-grow: 1;
  overflow-wrap: anywhere;
}

.completed-notice {
  background: #f1f5f9;
  color: #64748b;
  border-radius: 8px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding-top: 16px;
  border-top: 1px solid #eeeeF3;
  margin-top: auto;
}

.action-btn {
  padding: 9px 12px;
  border-radius: 7px;
  background: #ffffff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.detail-btn {
  color: #6644ff;
  border: 1px solid #ded8ff;
}

.detail-btn:hover {
  background: #f0edff;
}

.complete-btn {
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.complete-btn:hover {
  background: #dcfce7;
}

.delete-btn {
  color: #e11d48;
  border: 1px solid #fecdd3;
}

.delete-btn:hover {
  background: #fff1f2;
}

@media (max-width: 600px) {
  .organizer-event-card {
    padding: 18px;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>