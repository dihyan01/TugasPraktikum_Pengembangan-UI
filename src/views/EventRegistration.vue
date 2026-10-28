
<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import RegistrationSummary from '@/components/event/RegistrationSummary.vue'
import RegistrationForm from '@/components/event/RegistrationForm.vue'
import RegistrationReceipt from '@/components/event/RegistrationReceipt.vue'

import { useEvents } from '@/composables/useEvents'

// ==========================================
// MODUL 5 - EVENT REGISTRATION
// ==========================================

// VUE ROUTER
const router = useRouter()
const route = useRoute()

// CENTRALIZED STATE
const {
  events,
  userRegistrations,
  getEventById,
  registerAttendee
} = useEvents()

// ==========================================
// CURRENT EVENT DATA
// ==========================================

// Mengambil ID event dari URL
const eventId = computed(() => {
  return Number(route.params.id)
})

// Mengambil event dari useEvents.js
const event = computed(() => {
  // Membaca events agar tetap reaktif
  return events.value.find(
    item => item.id === eventId.value
  ) || getEventById(eventId.value)
})

// ==========================================
// REGISTRATION STATUS
// ==========================================

// Memeriksa apakah sudah terdaftar
const isRegistered = computed(() => {
  return userRegistrations.value.some(
    registration =>
      registration.eventId === eventId.value
  )
})

// Memeriksa kuota
const isSoldOut = computed(() => {
  return event.value
    ? Number(event.value.quota) <= 0
    : false
})

// Memeriksa apakah event selesai
const isEventCompleted = computed(() => {
  return event.value
    ? event.value.done === true
    : false
})

// Memastikan pendaftaran diperbolehkan
const canRegister = computed(() => {
  return Boolean(
    event.value &&
    !isEventCompleted.value &&
    !isSoldOut.value &&
    !isRegistered.value
  )
})

// ==========================================
// REGISTRATION CONFIRMATION STATE
// ==========================================

const confirmedData = ref(null)
const isSuccessModalOpen = ref(false)
const registrationError = ref('')
const isSubmitting = ref(false)

// ==========================================
// HANDLE REGISTRATION SUCCESS
// ==========================================

const handleRegistrationSuccess = (formData) => {

  registrationError.value = ''

  // Mencegah submit berulang
  if (isSubmitting.value) {
    return
  }

  // Memastikan event tersedia
  if (!canRegister.value) {
    registrationError.value =
      'Registration is not available for this event.'
    return
  }

  isSubmitting.value = true

  try {
    // Simpan data pendaftaran
    const record = registerAttendee(
      eventId.value,
      formData
    )

    if (record) {
      // Simpan hasil registrasi
      confirmedData.value = record

      // Tampilkan modal sukses
      isSuccessModalOpen.value = true
    } else {
      registrationError.value =
        'Unable to complete registration. Please check event availability.'
    }
  } catch (error) {
    console.error('Registration error:', error)

    registrationError.value =
      'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// ==========================================
// NAVIGATION HANDLERS
// ==========================================

// Kembali ke detail event
const handleBackToDetail = () => {
  router.push(`/browse/events/${eventId.value}`)
}

// Kembali ke katalog event
const handleBackToCatalog = () => {
  isSuccessModalOpen.value = false
  router.push('/browse/events')
}

// Menuju halaman Your Events
const handleGoToYourEvents = () => {
  isSuccessModalOpen.value = false
  router.push('/browse/your-events')
}

// Menuju tiket peserta
const handleViewTicket = () => {
  isSuccessModalOpen.value = false
  router.push(`/browse/your-events/${eventId.value}`)
}
</script>

<template>
  <div class="registration-page">

    <!-- =====================================
         EVENT NOT FOUND
    ====================================== -->

    <div
      v-if="!event"
      class="notice-container"
    >
      <div class="notice-card">
        <div class="notice-icon">🔎</div>

        <h2>Event Not Found</h2>

        <p>
          The event you are looking for is
          unavailable or has been removed.
        </p>

        <button
          class="btn-primary"
          @click="handleBackToCatalog"
        >
          Back to Event Catalog
        </button>
      </div>
    </div>

    <!-- =====================================
         ALREADY REGISTERED
    ====================================== -->

    <div
      v-else-if="isRegistered && !isSuccessModalOpen"
      class="notice-container"
    >
      <div class="notice-card">
        <div class="notice-icon">🎟️</div>

        <span class="notice-badge badge-success">
          REGISTERED
        </span>

        <h2>You're Already Registered!</h2>

        <p>
          You have already secured a ticket for
          <strong>{{ event.title }}</strong>.
          You can view your registration details
          from Your Events.
        </p>

        <div class="notice-actions">
          <button
            class="btn-secondary"
            @click="handleBackToDetail"
          >
            Back to Event Details
          </button>

          <button
            class="btn-primary"
            @click="handleViewTicket"
          >
            View My Ticket →
          </button>
        </div>
      </div>
    </div>

    <!-- =====================================
         EVENT COMPLETED / SOLD OUT
    ====================================== -->

    <div
      v-else-if="isEventCompleted || isSoldOut"
      class="notice-container"
    >
      <div class="notice-card">
        <div class="notice-icon">
          {{ isEventCompleted ? '🔒' : '🎫' }}
        </div>

        <h2>
          {{ isEventCompleted
            ? 'Registration Closed'
            : 'Event Sold Out' }}
        </h2>

        <p>
          {{ isEventCompleted
            ? 'Registration for this event has been closed.'
            : 'Sorry, all available seats for this event have been booked.' }}
        </p>

        <button
          class="btn-primary"
          @click="handleBackToCatalog"
        >
          Browse Other Events
        </button>
      </div>
    </div>

    <!-- =====================================
         REGISTRATION PAGE
    ====================================== -->

    <template v-else>

      <!-- PAGE HEADER -->
      <div class="registration-page-header">

        <button
          type="button"
          class="back-link"
          @click="handleBackToDetail"
        >
          ← Back to Event Detail
        </button>

        <div class="header-text">
          <span class="eyebrow">
            EVENT REGISTRATION
          </span>

          <h1>Complete Your Registration</h1>

          <p>
            You're one step away from joining this event.
            Please complete your information below.
          </p>
        </div>
      </div>

      <!-- REGISTRATION ERROR -->
      <div
        v-if="registrationError"
        class="registration-alert"
        role="alert"
      >
        ⚠️ {{ registrationError }}
      </div>

      <!-- TWO COLUMN LAYOUT -->
      <div class="registration-grid">

        <!-- LEFT: EVENT SUMMARY -->
        <div class="summary-column">
          <RegistrationSummary
            :event="event"
          />
        </div>

        <!-- RIGHT: REGISTRATION FORM -->
        <div class="form-column">
          <RegistrationForm
            @submit="handleRegistrationSuccess"
            @cancel="handleBackToDetail"
          />
        </div>

      </div>

    </template>

    <!-- =====================================
         SUCCESS CONFIRMATION MODAL
    ====================================== -->

    <Teleport to="body">

      <Transition name="modal-fade">

        <div
          v-if="isSuccessModalOpen && confirmedData && event"
          class="success-modal-overlay"
        >

          <div
            class="success-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
          >

            <!-- MODAL HEADER -->
            <div class="success-modal-header">

              <div class="success-icon">
                ✓
              </div>

              <div class="success-header-text">
                <span class="success-label">
                  SUCCESS
                </span>

                <h2 id="success-modal-title">
                  Registration Confirmed
                </h2>
              </div>

            </div>

            <!-- MODAL BODY -->
            <div class="success-modal-body">

              <RegistrationReceipt
                :confirmed-data="confirmedData"
                :event="event"
              />

            </div>

            <!-- MODAL FOOTER -->
            <div class="success-modal-footer">

              <button
                type="button"
                class="btn-secondary"
                @click="handleBackToCatalog"
              >
                Back to Event Catalog
              </button>

              <button
                type="button"
                class="btn-primary"
                @click="handleGoToYourEvents"
              >
                Go to Your Events →
              </button>

            </div>

          </div>

        </div>

      </Transition>

    </Teleport>

  </div>
</template>

<style scoped>

/* ==========================================
   EVENT REGISTRATION PAGE
========================================== */

.registration-page {
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

.registration-page-header {
  margin-bottom: 30px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0;
  margin-bottom: 24px;
  color: #777789;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #6644ff;
}

.header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.eyebrow {
  color: #6644ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.header-text h1 {
  color: #1c1948;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 800;
  margin: 0;
}

.header-text p {
  color: #858592;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
}

/* ==========================================
   TWO COLUMN LAYOUT
========================================== */

.registration-grid {
  display: grid;
  grid-template-columns:
    minmax(280px, 350px)
    minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.summary-column,
.form-column {
  min-width: 0;
}

/* ==========================================
   ERROR ALERT
========================================== */

.registration-alert {
  padding: 14px 18px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 22px;
}

/* ==========================================
   NOTICE STATES
========================================== */

.notice-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 0;
}

.notice-card {
  width: 100%;
  max-width: 530px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 45px 30px;
  box-shadow: 0 8px 30px rgba(25, 23, 67, 0.05);
  text-align: center;
}

.notice-icon {
  font-size: 45px;
  margin-bottom: 18px;
}

.notice-card h2 {
  color: #1c1948;
  font-size: 23px;
  font-weight: 800;
  margin: 0 0 12px;
}

.notice-card p {
  color: #858592;
  font-size: 13px;
  line-height: 1.8;
  margin: 0 0 25px;
}

.notice-card p strong {
  color: #1c1948;
}

.notice-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  margin-bottom: 15px;
}

.badge-success {
  background: #dcfce7;
  color: #15803d;
}

.notice-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ==========================================
   BUTTONS
========================================== */

.btn-primary,
.btn-secondary {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: #6644ff;
  border: 1px solid #6644ff;
  color: #ffffff;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.2);
}

.btn-primary:hover {
  background: #5533ee;
  border-color: #5533ee;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #555566;
}

.btn-secondary:hover {
  background: #f4f4f5;
}

/* ==========================================
   SUCCESS MODAL OVERLAY
========================================== */

.success-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* ==========================================
   SUCCESS MODAL CARD
========================================== */

.success-modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   SUCCESS MODAL HEADER
========================================== */

.success-modal-header {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 10px;
}

.success-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 24px;
  font-weight: 800;
}

.success-header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.success-label {
  color: #15803d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.success-header-text h2 {
  color: #1c1948;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.3;
  margin: 0;
}

/* ==========================================
   SUCCESS MODAL BODY
========================================== */

.success-modal-body {
  padding: 8px 0 22px;
}

/* ==========================================
   SUCCESS MODAL FOOTER
========================================== */

.success-modal-footer {
  border-top: 1px solid #eeeeF3;
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

/* ==========================================
   MODAL TRANSITION
========================================== */

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.25s ease;
}

.modal-fade-enter-active .success-modal-card,
.modal-fade-leave-active .success-modal-card {
  transition:
    transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .success-modal-card,
.modal-fade-leave-to .success-modal-card {
  transform: translateY(12px) scale(0.97);
}

/* ==========================================
   RESPONSIVE TABLET
========================================== */

@media (max-width: 900px) {
  .registration-page {
    padding: 28px 20px 55px;
  }

  .registration-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .summary-column,
  .form-column {
    width: 100%;
  }
}

/* ==========================================
   RESPONSIVE MOBILE
========================================== */

@media (max-width: 550px) {
  .registration-page {
    padding: 22px 15px 40px;
  }

  .header-text h1 {
    font-size: 23px;
  }

  .header-text p {
    font-size: 12px;
  }

  .notice-card {
    padding: 30px 20px;
  }

  .notice-card h2 {
    font-size: 20px;
  }

  .success-modal-card {
    padding: 22px 18px;
  }

  .success-header-text h2 {
    font-size: 18px;
  }

  .success-modal-footer {
    flex-direction: column;
  }

  .success-modal-footer button {
    width: 100%;
  }

  .notice-actions {
    flex-direction: column;
  }

  .notice-actions button {
    width: 100%;
  }
}
</style>