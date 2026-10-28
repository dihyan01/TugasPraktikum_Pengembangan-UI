
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

// ==========================================
// EVENT DETAIL - MODUL 5
// ==========================================

const route = useRoute()
const router = useRouter()

const {
  events,
  userRegistrations,
  getEventById
} = useEvents()

// Mengambil event berdasarkan ID URL
const event = computed(() => {
  events.value
  return getEventById(route.params.id)
})

// Memeriksa status pendaftaran
const isRegistered = computed(() => {
  return userRegistrations.value.some(
    registration =>
      registration.eventId === Number(route.params.id)
  )
})

// Memeriksa kuota event
const isSoldOut = computed(() => {
  return event.value
    ? Number(event.value.quota) <= 0
    : false
})

// Navigasi ke halaman pendaftaran
const handleRegisterClick = () => {
  if (
    !event.value ||
    event.value.done ||
    isRegistered.value ||
    isSoldOut.value
  ) {
    return
  }

  router.push(
    `/browse/events/${event.value.id}/register`
  )
}

// Kembali ke katalog
const goBack = () => {
  router.push('/browse/events')
}

// Membuka tiket yang sudah terdaftar
const viewTicket = () => {
  router.push(
    `/browse/your-events/${route.params.id}`
  )
}
</script>

<template>
  <div class="event-detail-page">

    <!-- EVENT FOUND -->
    <template v-if="event">

      <!-- BACK BUTTON -->
      <button class="back-link" @click="goBack">
        ← Back to Events
      </button>

      <!-- EVENT HEADER -->
      <div class="event-header">

        <div class="event-tags">
          <span class="category-badge">
            {{ event.cat }}
          </span>

          <span
            :class="[
              'status-badge',
              event.done ? 'status-closed' : 'status-live'
            ]"
          >
            {{ event.done ? 'Event Finished' : 'Event Open' }}
          </span>
        </div>

        <h1>{{ event.title }}</h1>

        <div class="event-meta">
          <span>📅 {{ event.date }}</span>
          <span>{{ event.loc }}</span>
          <span>👥 {{ event.quota }} seats remaining</span>
        </div>

      </div>

      <!-- DETAIL CONTENT -->
      <div class="detail-grid">

        <!-- LEFT COLUMN -->
        <section class="event-description-card">

          <h2>About This Event</h2>

          <p class="description-text">
            {{ event.desc }}
          </p>

        </section>

        <!-- RIGHT COLUMN -->
        <aside class="registration-card">

          <h2>Event Registration</h2>

          <!-- EVENT COMPLETED -->
          <template v-if="event.done">
            <p class="registration-info">
              Registration is closed as this event
              has concluded.
            </p>

            <button class="btn-disabled" disabled>
              Registration Closed
            </button>
          </template>

          <!-- ALREADY REGISTERED -->
          <template v-else-if="isRegistered">
            <p class="registration-info success-text">
              You are registered for this event.
              Your booking is confirmed.
            </p>

            <button class="btn-registered" disabled>
              Already Registered
            </button>

            <button
              class="view-ticket-link"
              @click="viewTicket"
            >
              View Ticket Receipt →
            </button>
          </template>

          <!-- SOLD OUT -->
          <template v-else-if="isSoldOut">
            <p class="registration-info">
              All available seats for this event
              have been booked.
            </p>

            <button class="btn-disabled" disabled>
              Sold Out
            </button>
          </template>

          <!-- AVAILABLE REGISTRATION -->
          <template v-else>
            <p class="registration-info">
              Secure your spot now before the
              remaining quota is filled.
            </p>

            <button
              class="btn-register"
              @click="handleRegisterClick"
            >
              Register Now
            </button>
          </template>

          <div class="registration-footer">
            {{ event.quota }} seats available
          </div>

        </aside>

      </div>

    </template>

    <!-- EVENT NOT FOUND -->
    <div v-else class="not-found-card">

      <div class="not-found-icon">🔎</div>

      <h2>404 - Event Not Found</h2>

      <p>
        The event you are looking for is unavailable
        or has been removed by the organizer.
      </p>

      <button class="btn-register" @click="goBack">
        Back to Event Catalog
      </button>

    </div>

  </div>
</template>

<style scoped>

/* =====================================
   EVENT DETAIL PAGE
===================================== */

.event-detail-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
}

/* =====================================
   BACK LINK
===================================== */

.back-link {
  background: none;
  border: none;
  color: #777789;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
}

.back-link:hover {
  color: #6644ff;
}

/* =====================================
   EVENT HEADER
===================================== */

.event-header {
  background: #f8f8fc;
  border: 1px solid #ededf2;
  border-radius: 14px;
  padding: 30px;
  margin-bottom: 28px;
}

.event-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.category-badge {
  background: #f0edff;
  color: #6644ff;
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge {
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-live {
  background: #dcfce7;
  color: #16a34a;
}

.status-closed {
  background: #f1f5f9;
  color: #64748b;
}

.event-header h1 {
  color: #1c1948;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 20px;
  overflow-wrap: anywhere;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  color: #777789;
  font-size: 12px;
  font-weight: 600;
}

/* =====================================
   CONTENT GRID
===================================== */

.detail-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr) 330px;
  gap: 26px;
  align-items: start;
}

/* =====================================
   EVENT DESCRIPTION
===================================== */

.event-description-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 27px;
  min-height: 260px;
}

.event-description-card h2 {
  color: #1c1948;
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 18px;
  padding-left: 12px;
  border-left: 4px solid #6644ff;
}

.description-text {
  color: #666677;
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

/* =====================================
   REGISTRATION CARD
===================================== */

.registration-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 24px;
  position: sticky;
  top: 24px;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.05);
}

.registration-card h2 {
  color: #1c1948;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  margin: 0 0 15px;
}

.registration-info {
  color: #858592;
  font-size: 12px;
  line-height: 1.7;
  text-align: center;
  margin-bottom: 18px;
}

.success-text {
  color: #16a34a;
}

/* =====================================
   REGISTRATION BUTTONS
===================================== */

.btn-register,
.btn-disabled,
.btn-registered {
  display: block;
  width: 100%;
  padding: 13px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.btn-register {
  background: #6644ff;
  border: 1px solid #6644ff;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.2);
  transition: 0.2s;
}

.btn-register:hover {
  background: #5533ee;
  transform: translateY(-1px);
}

.btn-disabled {
  background: #e4e4e7;
  border: 1px solid #e4e4e7;
  color: #858592;
  cursor: not-allowed;
}

.btn-registered {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #15803d;
  cursor: default;
}

.view-ticket-link {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  border: none;
  background: transparent;
  color: #6644ff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.registration-footer {
  color: #9292a0;
  font-size: 11px;
  text-align: center;
  margin-top: 18px;
}

/* =====================================
   EVENT NOT FOUND
===================================== */

.not-found-card {
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  max-width: 500px;
  padding: 40px;
  margin: 40px auto;
  text-align: center;
}

.not-found-icon {
  font-size: 42px;
  margin-bottom: 15px;
}

.not-found-card h2 {
  font-size: 22px;
  color: #1c1948;
  margin-bottom: 12px;
}

.not-found-card p {
  color: #858592;
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 20px;
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .registration-card {
    position: static;
  }
}

@media (max-width: 600px) {
  .event-detail-page {
    padding: 20px 15px;
  }

  .event-header {
    padding: 22px;
  }

  .event-header h1 {
    font-size: 23px;
  }

  .event-description-card {
    padding: 20px;
  }

  .event-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
