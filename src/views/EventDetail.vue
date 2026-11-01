
<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

// ==========================================
// MODUL 6 - EVENT DETAIL
// REST API INTEGRATION
// ==========================================

const route = useRoute()
const router = useRouter()

const {
  events,
  userRegistrations,
  loading,
  error,
  fetchEventById
} = useEvents()

// ==========================================
// EVENT DATA
// ==========================================

const event = computed(() => {
  return events.value.find(
    item => String(item.id) === String(route.params.id)
  )
})

// ==========================================
// FETCH EVENT FROM API
// ==========================================

const loadEvent = async () => {
  await fetchEventById(route.params.id)
}

onMounted(() => {
  loadEvent()
})

// Fetch ulang apabila ID pada URL berubah
watch(
  () => route.params.id,
  () => {
    loadEvent()
  }
)

// ==========================================
// REGISTRATION STATUS
// ==========================================

const isRegistered = computed(() => {
  return userRegistrations.value.some(
    registration =>
      String(registration.eventId) === String(route.params.id)
  )
})

const isSoldOut = computed(() => {
  return event.value &&
    Number(event.value.quota) <= 0
})

const isNotFound = computed(() => {
  return error.value?.includes(
    'Event tidak ditemukan di server.'
  ) || false
})

// ==========================================
// NAVIGATION
// ==========================================

const handleRegister = () => {
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

const handleViewTicket = () => {
  router.push(
    `/browse/your-events/${route.params.id}`
  )
}

const goBack = () => {
  router.push('/browse/events')
}

// ==========================================
// RETRY API REQUEST
// ==========================================

const retryFetch = async () => {
  await fetchEventById(route.params.id)
}
</script>

<template>
  <div class="event-detail-page">

    <!-- ==================================
         LOADING STATE
    =================================== -->

    <div
      v-if="loading && !event"
      class="loading-container"
    >
      <div class="loading-spinner"></div>

      <h3>Loading Event Details...</h3>

      <p>
        Please wait while we retrieve event information.
      </p>
    </div>

    <!-- ==================================
         ERROR STATE - 404
    =================================== -->

    <div
      v-else-if="isNotFound"
      class="error-container"
    >
      <div class="error-icon">🔎</div>

      <h2>404 - Event Not Found</h2>

      <p>
        The event you are looking for is unavailable
        or has been removed by the organizer.
      </p>

      <button
        class="btn-register"
        @click="goBack"
      >
        Back to Event Catalog
      </button>
    </div>

    <!-- ==================================
         NETWORK ERROR
    =================================== -->

    <div
      v-else-if="error && !event"
      class="error-container"
    >
      <div class="error-icon">⚠️</div>

      <h2>Unable to Load Event</h2>

      <p>{{ error }}</p>

      <button
        class="btn-register"
        @click="retryFetch"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Retry Loading' }}
      </button>

      <button
        class="back-link"
        @click="goBack"
      >
        Back to Event Catalog
      </button>
    </div>

    <!-- ==================================
         EVENT DETAIL
    =================================== -->

    <template v-else-if="event">

      <!-- BACK BUTTON -->

      <button
        class="back-link"
        @click="goBack"
      >
        ← Back to Events
      </button>

      <!-- EVENT HEADER -->

      <div class="detail-header">

        <div class="event-tags">

          <span class="category-badge">
            {{ event.cat }}
          </span>

          <span
            v-if="event.done"
            class="status-ended"
          >
            Event Finished
          </span>

          <span
            v-else-if="isSoldOut"
            class="status-soldout"
          >
            Sold Out
          </span>

          <span
            v-else
            class="status-available"
          >
            Active
          </span>

        </div>

        <h1>{{ event.title }}</h1>

        <div class="event-meta">

          <span>
            📅 {{ event.date }}
          </span>

          <span>
            📍 {{ event.loc.replace(/^📍\s*/, '') }}
          </span>

          <span>
            👥 {{ event.quota }} seats remaining
          </span>

        </div>

      </div>

      <!-- MAIN CONTENT -->

      <div class="detail-content">

        <!-- EVENT DESCRIPTION -->

        <section class="description-card">

          <h2>About This Event</h2>

          <p class="description-text">
            {{ event.desc }}
          </p>

        </section>

        <!-- REGISTRATION CARD -->

        <aside class="registration-card">

          <h2>Event Registration</h2>

          <div class="registration-info">

            <div class="info-item">
              <span>Event Category</span>
              <strong>{{ event.cat }}</strong>
            </div>

            <div class="info-item">
              <span>Available Seats</span>
              <strong>{{ event.quota }}</strong>
            </div>

            <div class="info-item">
              <span>Ticket Price</span>
              <strong>{{ event.price || 'Free' }}</strong>
            </div>

          </div>

          <!-- EVENT COMPLETED -->

          <template v-if="event.done">

            <button
              class="btn-disabled"
              disabled
            >
              Registration Closed
            </button>

            <p class="notice-text">
              This event has already been completed.
            </p>

          </template>

          <!-- ALREADY REGISTERED -->

          <template v-else-if="isRegistered">

            <button
              class="btn-registered"
              disabled
            >
              ✓ Already Registered
            </button>

            <button
              class="btn-ticket"
              @click="handleViewTicket"
            >
              View Ticket Receipt →
            </button>

          </template>

          <!-- SOLD OUT -->

          <template v-else-if="isSoldOut">

            <button
              class="btn-disabled"
              disabled
            >
              Sold Out
            </button>

            <p class="notice-text">
              All available seats have been booked.
            </p>

          </template>

          <!-- AVAILABLE -->

          <template v-else>

            <button
              class="btn-register"
              @click="handleRegister"
            >
              Register Now →
            </button>

            <p class="notice-text">
              Secure your spot now before the
              remaining quota is filled.
            </p>

          </template>

        </aside>

      </div>

    </template>

    <!-- ==================================
         FALLBACK
    =================================== -->

    <div
      v-else
      class="loading-container"
    >
      <div class="loading-spinner"></div>
      <h3>Loading Event Details...</h3>
    </div>

  </div>
</template>

<style scoped>

/* ==========================================
   EVENT DETAIL PAGE
========================================== */

.event-detail-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0;
  color: var(--text-main, #1c1948);
}

/* ==========================================
   BACK BUTTON
========================================== */

.back-link {
  display: inline-block;
  border: none;
  background: transparent;
  color: var(--primary, #6644ff);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
}

.back-link:hover {
  text-decoration: underline;
}

/* ==========================================
   EVENT HEADER
========================================== */

.detail-header {
  margin-bottom: 35px;
}

.event-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.category-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary, #6644ff);
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-available,
.status-soldout,
.status-ended {
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-available {
  background: #dcfce7;
  color: #15803d;
}

.status-soldout {
  background: #fee2e2;
  color: #dc2626;
}

.status-ended {
  background: #f1f5f9;
  color: #64748b;
}

.detail-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text-main, #1c1948);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--text-muted, #64748b);
  font-size: 0.95rem;
}

/* ==========================================
   DETAIL CONTENT
========================================== */

.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 28px;
  align-items: start;
}

/* ==========================================
   DESCRIPTION CARD
========================================== */

.description-card,
.registration-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.description-card h2,
.registration-card h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 22px;
  color: var(--text-main, #1c1948);
}

.description-text {
  color: var(--text-muted, #64748b);
  line-height: 1.8;
  font-size: 1rem;
}

/* ==========================================
   REGISTRATION CARD
========================================== */

.registration-card {
  position: sticky;
  top: 25px;
}

.registration-info {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.info-item span {
  color: var(--text-muted, #64748b);
}

.info-item strong {
  color: var(--text-main, #1c1948);
  text-align: right;
}

/* ==========================================
   BUTTONS
========================================== */

.btn-register,
.btn-registered,
.btn-disabled,
.btn-ticket {
  display: block;
  width: 100%;
  padding: 13px 18px;
  border-radius: 9px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}

.btn-register {
  background: var(--primary, #6644ff);
  color: #ffffff;
  border: none;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.2);
}

.btn-register:hover {
  background: var(--primary-hover, #5533ee);
  transform: translateY(-2px);
}

.btn-registered {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
  cursor: default;
}

.btn-disabled {
  background: #f1f5f9;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
  cursor: not-allowed;
}

.btn-ticket {
  background: #ffffff;
  color: var(--primary, #6644ff);
  border: 1px solid var(--primary, #6644ff);
  margin-top: 12px;
}

.btn-ticket:hover {
  background: rgba(102, 68, 255, 0.08);
}

.notice-text {
  color: var(--text-muted, #64748b);
  font-size: 0.85rem;
  line-height: 1.6;
  margin-top: 15px;
  text-align: center;
}

/* ==========================================
   LOADING STATE
========================================== */

.loading-container {
  max-width: 550px;
  margin: 50px auto;
  padding: 45px 30px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.loading-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #e2e8f0;
  border-top-color: #6644ff;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container h3 {
  color: var(--text-main, #1c1948);
  margin-bottom: 10px;
}

.loading-container p {
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;
}

/* ==========================================
   ERROR STATE
========================================== */

.error-container {
  max-width: 550px;
  margin: 50px auto;
  padding: 40px 30px;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 14px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.error-container h2 {
  color: #dc2626;
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.error-container p {
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 22px;
}

.error-container .back-link {
  display: block;
  margin: 15px auto 0;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {

  .event-detail-page {
    padding: 20px 0;
  }

  .detail-header h1 {
    font-size: 1.8rem;
  }

  .detail-content {
    grid-template-columns: 1fr;
  }

  .registration-card {
    position: static;
  }

  .event-meta {
    flex-direction: column;
    gap: 10px;
  }

}

@media (max-width: 480px) {

  .detail-header h1 {
    font-size: 1.55rem;
  }

  .description-card,
  .registration-card {
    padding: 20px;
  }

}

</style>