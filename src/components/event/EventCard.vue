
<script setup>
import { computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'

// ==========================================
// MODUL 5 - EVENT CARD
// ==========================================

// PROPS
const props = defineProps({
  event: {
    type: Object,
    required: true
  },

  // Status registrasi dikirim oleh EventList
  isRegistered: {
    type: Boolean,
    default: false
  }
})

// EMITS
const emit = defineEmits(['view-detail'])

// ==========================================
// FORMAT LOCATION
// ==========================================

const formattedLocation = computed(() => {
  const location = String(props.event.loc || '').trim()

  if (!location) {
    return 'Location TBA'
  }

  // Menghindari emoji pin ganda
  return location.startsWith('📍')
    ? location
    : `📍 ${location}`
})

// ==========================================
// EVENT DETAIL NAVIGATION
// ==========================================

const handleViewDetail = () => {
  emit('view-detail', props.event.id)
}
</script>

<template>
  <AppCard class="event-card-wrapper">

    <div class="event-body">

      <!-- ==================================
           EVENT META
      =================================== -->

      <div class="event-meta">

        <span class="event-date">
          {{ event.date }}
        </span>

        <span class="event-category">
          {{ event.cat }}
        </span>

      </div>

      <!-- ==================================
           REGISTRATION STATUS
      =================================== -->

      <div
        v-if="isRegistered"
        class="registration-status"
      >

        <span class="registered-badge">
          <span class="registered-icon">✓</span>
          Registered
        </span>

      </div>

      <!-- ==================================
           EVENT INFORMATION
      =================================== -->

      <h3 class="event-title">
        {{ event.title }}
      </h3>

      <p class="event-loc">
        {{ formattedLocation }}
      </p>

      <p class="event-desc">
        {{ event.desc }}
      </p>

      <!-- ==================================
           CARD FOOTER
      =================================== -->

      <div class="card-footer">

        <button
          type="button"
          class="btn-link"
          @click="handleViewDetail"
        >
          View Event Details
          <span class="arrow-icon">→</span>
        </button>

      </div>

    </div>

  </AppCard>
</template>

<style scoped>

/* ==========================================
   EVENT CARD CONTAINER
========================================== */

.event-card-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;

  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.event-card-wrapper:hover {
  transform: translateY(-3px);
  border-color: #ded8ff;
  box-shadow: 0 10px 25px rgba(25, 23, 67, 0.07);
}

/* ==========================================
   CARD BODY
========================================== */

.event-body {
  display: flex;
  flex-direction: column;

  height: 100%;
  min-width: 0;
  padding: 24px;

  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   EVENT META
========================================== */

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  gap: 10px;
  margin-bottom: 16px;
}

.event-date {
  color: #6644ff;
  background: rgba(102, 68, 255, 0.1);

  padding: 6px 10px;
  border-radius: 6px;

  font-size: 12px;
  font-weight: 700;
}

.event-category {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

/* ==========================================
   REGISTERED BADGE
========================================== */

.registration-status {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.registered-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  background: #dcfce7;
  color: #15803d;

  border: 1px solid #bbf7d0;
  border-radius: 20px;

  padding: 6px 11px;

  font-size: 11px;
  font-weight: 800;
}

.registered-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;
  border-radius: 50%;

  background: #16a34a;
  color: #ffffff;

  font-size: 10px;
  font-weight: 800;
}

/* ==========================================
   EVENT TITLE
========================================== */

.event-title {
  margin: 0 0 10px;

  color: #1c1948;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.4;

  overflow-wrap: anywhere;
}

/* ==========================================
   EVENT LOCATION
========================================== */

.event-loc {
  margin: 0 0 15px;

  color: #64748b;
  font-size: 13px;
  line-height: 1.6;

  overflow-wrap: anywhere;
}

/* ==========================================
   EVENT DESCRIPTION
========================================== */

.event-desc {
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;

  margin: 0 0 24px;
  flex-grow: 1;

  overflow-wrap: anywhere;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

/* ==========================================
   CARD FOOTER
========================================== */

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 17px;
  margin-top: auto;
}

/* ==========================================
   VIEW DETAILS BUTTON
========================================== */

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: transparent;
  border: none;
  padding: 0;

  color: #1c1948;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;

  text-decoration: none;
  cursor: pointer;

  transition: color 0.2s ease;
}

.btn-link:hover {
  color: #6644ff;
}

.arrow-icon {
  font-size: 17px;
  transition: transform 0.2s ease;
}

.btn-link:hover .arrow-icon {
  transform: translateX(4px);
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 600px) {

  .event-body {
    padding: 20px;
  }

  .event-title {
    font-size: 17px;
  }

  .event-date {
    font-size: 11px;
  }

  .event-category {
    font-size: 10px;
  }

}
</style>