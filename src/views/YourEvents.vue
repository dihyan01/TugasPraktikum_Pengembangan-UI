
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

// ==========================================
// MODUL 5 - YOUR EVENTS / TICKET WALLET
// ==========================================

const router = useRouter()

const {
  events,
  userRegistrations,
  cancelRegistration
} = useEvents()

// ==========================================
// REGISTERED EVENTS
// ==========================================

// Menghubungkan tiket dengan data event asli
const registeredEvents = computed(() => {
  return userRegistrations.value
    .map(registration => {
      const event = events.value.find(
        item => item.id === registration.eventId
      )

      if (!event) return null

      return {
        ...registration,
        eventData: event
      }
    })
    .filter(Boolean)
})

// Jumlah tiket aktif
const upcomingCount = computed(() => {
  return registeredEvents.value.filter(
    item => !item.eventData.done
  ).length
})

// Jumlah tiket event selesai
const concludedCount = computed(() => {
  return registeredEvents.value.filter(
    item => item.eventData.done
  ).length
})

// ==========================================
// MODAL STATE
// ==========================================

const isCancelModalOpen = ref(false)
const selectedRegistration = ref(null)

// ==========================================
// OPEN CANCEL MODAL
// ==========================================

const handleOpenCancelModal = (registration) => {

  if (registration.eventData.done) return

  selectedRegistration.value = registration
  isCancelModalOpen.value = true
}

// ==========================================
// CLOSE CANCEL MODAL
// ==========================================

const handleCloseCancelModal = () => {
  isCancelModalOpen.value = false
  selectedRegistration.value = null
}

// ==========================================
// CONFIRM CANCELLATION
// ==========================================

const handleConfirmCancel = () => {

  if (!selectedRegistration.value) return

  const eventId = selectedRegistration.value.eventId

  cancelRegistration(eventId)

  handleCloseCancelModal()
}

// ==========================================
// NAVIGATION
// ==========================================

// Menuju halaman tiket digital
const viewTicket = (eventId) => {
  router.push(`/browse/your-events/${eventId}`)
}

// Menuju katalog event
const goToCatalog = () => {
  router.push('/browse/events')
}

// ==========================================
// DATE FORMAT
// ==========================================

const formatRegistrationDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="your-events-page">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->

    <div class="page-header">

      <div class="header-content">
        <span class="page-eyebrow">
          MY REGISTRATIONS
        </span>

        <h1>Your Events</h1>

        <p>
          Review your confirmed event registrations
          and view official digital passes.
        </p>
      </div>

      <button
        class="browse-btn"
        @click="goToCatalog"
      >
        Browse More Events →
      </button>

    </div>

    <!-- =====================================
         SUMMARY STATISTICS
    ====================================== -->

    <div
      v-if="registeredEvents.length > 0"
      class="summary-grid"
    >

      <div class="summary-card">
        <span class="summary-label">
          TOTAL REGISTRATIONS
        </span>

        <strong class="summary-value total">
          {{ registeredEvents.length }}
        </strong>

        <span class="summary-description">
          Confirmed event tickets
        </span>
      </div>

      <div class="summary-card">
        <span class="summary-label">
          UPCOMING EVENTS
        </span>

        <strong class="summary-value upcoming">
          {{ upcomingCount }}
        </strong>

        <span class="summary-description">
          Active event registrations
        </span>
      </div>

      <div class="summary-card">
        <span class="summary-label">
          CONCLUDED EVENTS
        </span>

        <strong class="summary-value concluded">
          {{ concludedCount }}
        </strong>

        <span class="summary-description">
          Archived event tickets
        </span>
      </div>

    </div>

    <!-- =====================================
         EMPTY STATE
    ====================================== -->

    <div
      v-if="registeredEvents.length === 0"
      class="empty-state"
    >

      <div class="empty-icon">
        🎟️
      </div>

      <h2>No Registered Events Yet</h2>

      <p>
        You have not signed up for any active events.
        Explore our catalog to find workshops,
        meetups, and conferences that match your interests.
      </p>

      <button
        class="primary-btn"
        @click="goToCatalog"
      >
        Explore Events →
      </button>

    </div>

    <!-- =====================================
         TICKET LIST
    ====================================== -->

    <section v-else class="tickets-section">

      <div class="section-heading">
        <h2>My Event Tickets</h2>

        <span class="ticket-count">
          {{ registeredEvents.length }} Tickets
        </span>
      </div>

      <div class="tickets-grid">

        <article
          v-for="item in registeredEvents"
          :key="item.id"
          class="ticket-card"
        >

          <!-- TICKET HEADER -->
          <div class="ticket-header">

            <div class="ticket-badges">

              <span class="category-badge">
                {{ item.eventData.cat }}
              </span>

              <span
                :class="[
                  'lifecycle-tag',
                  item.eventData.done
                    ? 'tag-concluded'
                    : 'tag-upcoming'
                ]"
              >
                {{ item.eventData.done
                  ? 'Concluded'
                  : 'Upcoming' }}
              </span>

            </div>

            <span class="ticket-symbol">
              🎫
            </span>

          </div>

          <!-- EVENT TITLE -->
          <h3 class="event-title">
            {{ item.eventData.title }}
          </h3>

          <!-- EVENT INFORMATION -->
          <div class="event-information">

            <div class="info-row">
              <span class="info-icon">📅</span>
              <span>
                {{ item.eventData.date }}
              </span>
            </div>

            <div class="info-row">
              <span class="info-icon">📍</span>
              <span>
                {{ item.eventData.loc }}
              </span>
            </div>

          </div>

          <!-- BOOKING REFERENCE -->
          <div class="booking-section">

            <span class="booking-label">
              BOOKING REFERENCE
            </span>

            <strong class="booking-code">
              {{ item.bookingCode }}
            </strong>

            <span class="registration-date">
              Registered on
              {{ formatRegistrationDate(item.registeredAt) }}
            </span>

          </div>

          <!-- CARD FOOTER -->
          <div class="ticket-footer">

            <button
              class="view-ticket-btn"
              @click="viewTicket(item.eventId)"
            >
              View Ticket Details →
            </button>

            <button
              v-if="!item.eventData.done"
              class="cancel-registration-btn"
              @click="handleOpenCancelModal(item)"
            >
              Cancel Registration
            </button>

            <span
              v-else
              class="archived-label"
            >
              Archived Event
            </span>

          </div>

        </article>

      </div>

    </section>

    <!-- =====================================
         CANCELLATION MODAL
    ====================================== -->

    <Teleport to="body">

      <div
        v-if="isCancelModalOpen && selectedRegistration"
        class="modal-overlay"
        @click.self="handleCloseCancelModal"
      >

        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
        >

          <div class="modal-icon">
            ⚠️
          </div>

          <h2 id="cancel-title">
            Cancel Registration?
          </h2>

          <p>
            Are you sure you want to cancel your
            registration for
            <strong>
              {{ selectedRegistration.eventData.title }}
            </strong>?
          </p>

          <p class="modal-warning">
            Your booking reference will be removed,
            and your reserved seat will be released.
            This action cannot be undone.
          </p>

          <div class="modal-actions">

            <button
              class="modal-back-btn"
              @click="handleCloseCancelModal"
            >
              Keep My Ticket
            </button>

            <button
              class="modal-confirm-btn"
              @click="handleConfirmCancel"
            >
              Yes, Cancel Registration
            </button>

          </div>

        </div>

      </div>

    </Teleport>

  </div>
</template>

<style scoped>

/* ==========================================
   YOUR EVENTS PAGE
========================================== */

.your-events-page {
  width: 100%;
  max-width: 1200px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 36px 32px 70px;
  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
  box-sizing: border-box;
}

/* ==========================================
   PAGE HEADER
========================================== */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-eyebrow {
  color: #6644ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.header-content h1 {
  color: #1c1948;
  font-size: 29px;
  font-weight: 800;
  margin: 0;
  line-height: 1.3;
}

.header-content p {
  font-size: 13px;
  color: #858592;
  line-height: 1.7;
  margin: 0;
}

/* ==========================================
   BUTTONS
========================================== */

.browse-btn,
.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #6644ff;
  color: #ffffff;
  border: 1px solid #6644ff;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 5px 15px rgba(102,68,255,0.2);
  white-space: nowrap;
}

.browse-btn:hover,
.primary-btn:hover {
  background: #5533ee;
  border-color: #5533ee;
  transform: translateY(-1px);
}

/* ==========================================
   SUMMARY STATISTICS
========================================== */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 18px;
  margin-bottom: 32px;
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(25,23,67,0.035);
}

.summary-label {
  color: #777789;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.summary-value {
  font-size: 33px;
  font-weight: 800;
  line-height: 1;
}

.summary-value.total {
  color: #6644ff;
}

.summary-value.upcoming {
  color: #22c55e;
}

.summary-value.concluded {
  color: #9292a0;
}

.summary-description {
  color: #858592;
  font-size: 11px;
}

/* ==========================================
   SECTION HEADER
========================================== */

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.section-heading h2 {
  font-size: 20px;
  font-weight: 800;
  color: #1c1948;
  margin: 0;
}

.ticket-count {
  background: #f0edff;
  color: #6644ff;
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

/* ==========================================
   TICKETS GRID
========================================== */

.tickets-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

.ticket-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 13px;
  box-shadow: 0 5px 20px rgba(25,23,67,0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(25,23,67,0.08);
}

/* ==========================================
   TICKET HEADER
========================================== */

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 17px;
}

.ticket-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.category-badge {
  background: #f0edff;
  color: #6644ff;
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.lifecycle-tag {
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.tag-upcoming {
  background: #dcfce7;
  color: #15803d;
}

.tag-concluded {
  background: #f1f5f9;
  color: #64748b;
}

.ticket-symbol {
  font-size: 24px;
}

/* ==========================================
   EVENT DETAILS
========================================== */

.event-title {
  font-size: 17px;
  font-weight: 800;
  color: #1c1948;
  line-height: 1.5;
  margin: 0 0 16px;
  overflow-wrap: anywhere;
}

.event-information {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 12px;
  color: #777789;
  line-height: 1.6;
}

.info-row span:last-child {
  overflow-wrap: anywhere;
}

.info-icon {
  flex-shrink: 0;
}

/* ==========================================
   BOOKING REFERENCE
========================================== */

.booking-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  background: #f8f8fc;
  border: 1px dashed #dedbea;
  border-radius: 9px;
  padding: 16px;
  margin-top: auto;
  margin-bottom: 18px;
}

.booking-label {
  color: #9292a0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.booking-code {
  color: #6644ff;
  font-family: monospace;
  font-size: 15px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.registration-date {
  font-size: 11px;
  color: #9292a0;
}

/* ==========================================
   CARD FOOTER
========================================== */

.ticket-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-top: 1px solid #eeeeF3;
  padding-top: 17px;
}

.view-ticket-btn {
  border: none;
  background: transparent;
  color: #6644ff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
}

.view-ticket-btn:hover {
  color: #5533ee;
  text-decoration: underline;
}

.cancel-registration-btn {
  border: none;
  background: transparent;
  color: #e11d48;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.cancel-registration-btn:hover {
  color: #be123c;
  text-decoration: underline;
}

.archived-label {
  color: #9292a0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

/* ==========================================
   EMPTY STATE
========================================== */

.empty-state {
  background: #ffffff;
  border: 1px dashed #e4e4e7;
  border-radius: 14px;
  padding: 60px 25px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(25,23,67,0.03);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 18px;
}

.empty-state h2 {
  color: #1c1948;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 13px;
}

.empty-state p {
  max-width: 480px;
  margin: 0 auto 25px;
  color: #858592;
  font-size: 13px;
  line-height: 1.8;
}

/* ==========================================
   MODAL OVERLAY
========================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 25px 65px rgba(0,0,0,0.2);
  font-family: Inter, Arial, sans-serif;
}

.modal-icon {
  font-size: 38px;
  margin-bottom: 15px;
}

.modal-card h2 {
  color: #1c1948;
  font-size: 21px;
  font-weight: 800;
  margin: 0 0 13px;
}

.modal-card p {
  color: #777789;
  font-size: 13px;
  line-height: 1.8;
  margin: 0 0 15px;
}

.modal-card p strong {
  color: #1c1948;
}

.modal-warning {
  background: #fff1f2;
  color: #be123c !important;
  border: 1px solid #fecdd3;
  padding: 13px;
  border-radius: 8px;
  font-size: 11px !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.modal-back-btn,
.modal-confirm-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 11px 17px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.modal-back-btn {
  background: white;
  border: 1px solid #e4e4e7;
  color: #555566;
}

.modal-back-btn:hover {
  background: #f4f4f5;
}

.modal-confirm-btn {
  background: #e11d48;
  border: 1px solid #e11d48;
  color: white;
}

.modal-confirm-btn:hover {
  background: #be123c;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 900px) {
  .your-events-page {
    padding: 28px 20px 55px;
  }

  .summary-grid {
    gap: 12px;
  }
}

@media (max-width: 650px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .browse-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .your-events-page {
    padding: 22px 15px 40px;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    padding: 23px 18px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>