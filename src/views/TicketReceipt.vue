
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

// ==========================================
// MODUL 5 - DIGITAL TICKET RECEIPT
// ==========================================

const route = useRoute()
const router = useRouter()

// ==========================================
// CENTRALIZED STATE
// ==========================================

const {
  events,
  userRegistrations,
  cancelRegistration,
  getEventById
} = useEvents()

// ==========================================
// GET EVENT ID FROM ROUTE
// ==========================================

const eventId = computed(() => {
  return Number(route.params.id)
})

// ==========================================
// FIND EVENT DATA
// ==========================================

const event = computed(() => {
  // Mengambil dari shared reactive state
  events.value

  return getEventById(eventId.value)
})

// ==========================================
// FIND USER REGISTRATION
// ==========================================

const registration = computed(() => {
  return userRegistrations.value.find(
    item => item.eventId === eventId.value
  )
})

// ==========================================
// CHECK EVENT STATUS
// ==========================================

const isEventDone = computed(() => {
  return event.value?.done === true
})

// Tiket harus memiliki event dan registrasi
const isTicketAvailable = computed(() => {
  return Boolean(event.value && registration.value)
})

// ==========================================
// REGISTRATION DATE FORMAT
// ==========================================

const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ==========================================
// CANCELLATION MODAL STATE
// ==========================================

const isCancelModalOpen = ref(false)

// ==========================================
// OPEN CANCEL MODAL
// ==========================================

const handleOpenCancelModal = () => {
  // Event yang selesai tidak dapat dibatalkan
  if (!isTicketAvailable.value || isEventDone.value) {
    return
  }

  isCancelModalOpen.value = true
}

// ==========================================
// CLOSE CANCEL MODAL
// ==========================================

const handleCloseCancelModal = () => {
  isCancelModalOpen.value = false
}

// ==========================================
// CONFIRM CANCEL REGISTRATION
// ==========================================

const handleConfirmCancel = () => {
  if (!isTicketAvailable.value || isEventDone.value) {
    handleCloseCancelModal()
    return
  }

  // Menghapus registrasi dan mengembalikan kuota
  const success = cancelRegistration(eventId.value)

  handleCloseCancelModal()

  if (success) {
    router.push('/browse/your-events')
  }
}

// ==========================================
// NAVIGATION
// ==========================================

const goToYourEvents = () => {
  router.push('/browse/your-events')
}

const goToCatalog = () => {
  router.push('/browse/events')
}
</script>

<template>
  <main class="ticket-receipt-page">

    <!-- =====================================
         BACK NAVIGATION
    ====================================== -->

    <button
      type="button"
      class="back-link"
      @click="goToYourEvents"
    >
      ← Back to Your Events
    </button>

    <!-- =====================================
         VALID TICKET
    ====================================== -->

    <article
      v-if="isTicketAvailable"
      class="ticket-receipt-card"
    >

      <!-- RECEIPT HEADER -->
      <div class="receipt-header">

        <div class="receipt-status">

          <span
            :class="[
              'status-badge',
              isEventDone
                ? 'badge-concluded'
                : 'badge-confirmed'
            ]"
          >
            {{ isEventDone
              ? 'CONCLUDED'
              : 'CONFIRMED PASS' }}
          </span>

          <p class="registration-date">
            Registered on
            {{ formatDate(registration.registeredAt) }}
          </p>

        </div>

        <div class="booking-reference">
          {{ registration.bookingCode }}
        </div>

      </div>

      <!-- =====================================
           EVENT DETAILS
      ====================================== -->

      <section class="receipt-section">

        <span class="section-label">
          EVENT DETAILS
        </span>

        <h1 class="event-title">
          {{ event.title }}
        </h1>

        <span class="category-badge">
          {{ event.cat }}
        </span>

        <div class="receipt-grid event-details-grid">

          <div class="detail-item">
            <span class="detail-label">
              Date & Time
            </span>

            <strong class="detail-value">
              {{ event.date }}
            </strong>
          </div>

          <div class="detail-item">
            <span class="detail-label">
              Location / Venue
            </span>

            <strong class="detail-value">
              {{ event.loc }}
            </strong>
          </div>

        </div>

      </section>

      <!-- =====================================
           ATTENDEE INFORMATION
      ====================================== -->

      <section class="receipt-section">

        <span class="section-label">
          ATTENDEE INFORMATION
        </span>

        <div class="receipt-grid attendee-grid">

          <!-- FULL NAME -->
          <div class="detail-item">
            <span class="detail-label">
              Full Name
            </span>

            <strong class="detail-value">
              {{ registration.fullName }}
            </strong>
          </div>

          <!-- EMAIL ADDRESS -->
          <div class="detail-item">
            <span class="detail-label">
              Email Address
            </span>

            <strong class="detail-value">
              {{ registration.email }}
            </strong>
          </div>

          <!-- PHONE NUMBER -->
          <div class="detail-item">
            <span class="detail-label">
              Phone Number
            </span>

            <strong class="detail-value">
              {{ registration.phone }}
            </strong>
          </div>

          <!-- DATE OF BIRTH -->
          <div class="detail-item">
            <span class="detail-label">
              Date of Birth
            </span>

            <strong class="detail-value">
              {{ formatDate(registration.dob) }}
            </strong>
          </div>

        </div>

      </section>

      <!-- =====================================
           REASON FOR ATTENDING
      ====================================== -->

      <section class="receipt-section reason-section">

        <span class="section-label">
          REASON FOR ATTENDING
        </span>

        <p class="reason-text">
          {{ registration.reason }}
        </p>

      </section>

      <!-- =====================================
           RECEIPT FOOTER
      ====================================== -->

      <div class="receipt-footer">

        <button
          type="button"
          class="btn-primary"
          @click="goToYourEvents"
        >
          Back to Your Events
        </button>

        <button
          v-if="!isEventDone"
          type="button"
          class="btn-cancel"
          @click="handleOpenCancelModal"
        >
          Cancel Registration
        </button>

        <span
          v-else
          class="concluded-notice"
        >
          This event is concluded. Attendance record is archived.
        </span>

      </div>

    </article>

    <!-- =====================================
         TICKET NOT FOUND
    ====================================== -->

    <div
      v-else
      class="ticket-not-found"
    >

      <div class="not-found-icon">
        🎟️
      </div>

      <h2>Ticket Not Found</h2>

      <p>
        We could not find an active registration
        for this event. It may have been cancelled,
        or the event may no longer be available.
      </p>

      <button
        type="button"
        class="btn-primary"
        @click="goToCatalog"
      >
        Browse Other Events
      </button>

    </div>

    <!-- =====================================
         CANCEL REGISTRATION MODAL
    ====================================== -->

    <Teleport to="body">

      <div
        v-if="isCancelModalOpen && isTicketAvailable"
        class="modal-overlay"
        @click.self="handleCloseCancelModal"
      >

        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >

          <div class="modal-icon">
            ⚠️
          </div>

          <h2 id="cancel-modal-title">
            Cancel Registration?
          </h2>

          <p>
            Are you sure you want to cancel your
            registration for
            <strong>{{ event.title }}</strong>?
          </p>

          <div class="modal-warning">
            Your ticket and booking reference will
            be permanently removed. Your reserved
            seat will be released back to the event.
          </div>

          <div class="modal-actions">

            <button
              type="button"
              class="btn-secondary"
              @click="handleCloseCancelModal"
            >
              Keep My Ticket
            </button>

            <button
              type="button"
              class="btn-danger"
              @click="handleConfirmCancel"
            >
              Yes, Cancel Registration
            </button>

          </div>

        </div>

      </div>

    </Teleport>

  </main>
</template>

<style scoped>

/* ==========================================
   DIGITAL TICKET PAGE
========================================== */

.ticket-receipt-page {
  width: 100%;
  max-width: 980px;
  min-height: 75vh;
  margin: 0 auto;
  padding: 35px 24px 75px;
  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
  box-sizing: border-box;
}

/* ==========================================
   BACK LINK
========================================== */

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #777789;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 25px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #6644ff;
}

/* ==========================================
   RECEIPT CARD
========================================== */

.ticket-receipt-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 15px;
  box-shadow: 0 10px 35px rgba(25, 23, 67, 0.06);
  overflow: hidden;
}

/* ==========================================
   RECEIPT HEADER
========================================== */

.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 28px 32px;
  border-bottom: 1px solid #e4e4e7;
  background: #ffffff;
}

.receipt-status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.badge-confirmed {
  background: #dcfce7;
  color: #15803d;
}

.badge-concluded {
  background: #f1f5f9;
  color: #64748b;
}

.registration-date {
  font-size: 11px;
  color: #9292a0;
  margin: 0;
}

.booking-reference {
  color: #6644ff;
  font-family: monospace;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-align: right;
  overflow-wrap: anywhere;
}

/* ==========================================
   RECEIPT SECTIONS
========================================== */

.receipt-section {
  padding: 28px 32px;
  border-bottom: 1px solid #eeeeF3;
}

.section-label {
  display: block;
  color: #9292a0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 17px;
}

/* ==========================================
   EVENT INFORMATION
========================================== */

.event-title {
  color: #1c1948;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 13px;
  overflow-wrap: anywhere;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #f0edff;
  color: #6644ff;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 24px;
}

/* ==========================================
   RECEIPT GRID
========================================== */

.receipt-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.detail-label {
  color: #9292a0;
  font-size: 11px;
  font-weight: 500;
}

.detail-value {
  color: #29264d;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

/* ==========================================
   REASON SECTION
========================================== */

.reason-section {
  border-bottom: none;
}

.reason-text {
  color: #666677;
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 0;
}

/* ==========================================
   RECEIPT FOOTER
========================================== */

.receipt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 25px 32px;
  border-top: 1px solid #eeeeF3;
  background: #fafaff;
}

/* ==========================================
   BUTTONS
========================================== */

.btn-primary,
.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: #6644ff;
  color: #ffffff;
  border: 1px solid #6644ff;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.18);
}

.btn-primary:hover {
  background: #5533ee;
  border-color: #5533ee;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #ffffff;
  color: #555566;
  border: 1px solid #e4e4e7;
}

.btn-secondary:hover {
  background: #f4f4f5;
}

.btn-cancel {
  background: transparent;
  color: #9292a0;
  border: none;
  padding: 10px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-cancel:hover {
  color: #e11d48;
}

.concluded-notice {
  color: #9292a0;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
  font-style: italic;
}

/* ==========================================
   TICKET NOT FOUND
========================================== */

.ticket-not-found {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 55px 25px;
  max-width: 550px;
  margin: 40px auto;
  text-align: center;
  box-shadow: 0 8px 25px rgba(25,23,67,0.04);
}

.not-found-icon {
  font-size: 45px;
  margin-bottom: 17px;
}

.ticket-not-found h2 {
  font-size: 22px;
  font-weight: 800;
  color: #1c1948;
  margin: 0 0 12px;
}

.ticket-not-found p {
  font-size: 13px;
  color: #858592;
  line-height: 1.8;
  margin: 0 0 25px;
}

/* ==========================================
   CANCEL MODAL
========================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.5);
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
  color: #be123c;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  padding: 13px;
  font-size: 11px;
  line-height: 1.7;
  text-align: left;
}

/* ==========================================
   MODAL ACTIONS
========================================== */

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-danger {
  background: #e11d48;
  color: #ffffff;
  border: 1px solid #e11d48;
}

.btn-danger:hover {
  background: #be123c;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {

  .ticket-receipt-page {
    padding: 25px 16px 50px;
  }

  .receipt-header,
  .receipt-section,
  .receipt-footer {
    padding: 22px;
  }

  .event-title {
    font-size: 22px;
  }

}

@media (max-width: 550px) {

  .receipt-header {
    flex-direction: column;
    gap: 15px;
  }

  .booking-reference {
    text-align: left;
  }

  .receipt-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .receipt-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .receipt-footer button {
    width: 100%;
  }

  .concluded-notice {
    text-align: center;
  }

  .modal-card {
    padding: 24px 18px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

}
</style>