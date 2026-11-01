
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import RegistrationSummary from '@/components/event/RegistrationSummary.vue'
import RegistrationForm from '@/components/event/RegistrationForm.vue'
import RegistrationReceipt from '@/components/event/RegistrationReceipt.vue'

import { useEvents } from '@/composables/useEvents'

// ==========================================
// MODUL 6 - EVENT REGISTRATION
// ==========================================

const router = useRouter()
const route = useRoute()

const {
  events,
  userRegistrations,
  getEventById,
  fetchEventById,
  registerAttendee
} = useEvents()

// ==========================================
// EVENT DATA
// ==========================================

const eventId = computed(() => String(route.params.id || ''))

const event = computed(() => {
  return events.value.find(
    item => String(item.id) === eventId.value
  ) || getEventById(eventId.value)
})

onMounted(async () => {
  if (eventId.value && !event.value) {
    await fetchEventById(eventId.value)
  }
})

// ==========================================
// REGISTRATION STATUS
// ==========================================

const isRegistered = computed(() => {
  return userRegistrations.value.some(
    registration =>
      String(registration.eventId) === eventId.value
  )
})

const isSoldOut = computed(() => {
  return event.value
    ? Number(event.value.quota) <= 0
    : false
})

const isEventCompleted = computed(() => {
  return event.value?.done === true
})

const canRegister = computed(() => {
  return Boolean(
    event.value &&
    !isEventCompleted.value &&
    !isSoldOut.value &&
    !isRegistered.value
  )
})

// ==========================================
// REGISTRATION STATE
// ==========================================

const confirmedData = ref(null)
const registrationError = ref('')
const isSubmitting = ref(false)

// ==========================================
// HANDLE REGISTRATION
// ==========================================

const handleRegistrationSuccess = async (formData) => {

  if (isSubmitting.value) return

  registrationError.value = ''

  if (!canRegister.value) {
    registrationError.value =
      'Registration is not available for this event.'
    return
  }

  isSubmitting.value = true

  try {

    const record = await registerAttendee(
      eventId.value,
      formData
    )

    if (record) {

      // Simpan hasil registrasi untuk receipt
      confirmedData.value = record

    } else {

      registrationError.value =
        'Unable to complete registration. Please try again.'

    }

  } catch (error) {

    console.error('Registration Error:', error)

    registrationError.value =
      error.message || 'Something went wrong.'

  } finally {

    isSubmitting.value = false

  }
}

// ==========================================
// NAVIGATION
// ==========================================

const handleBackToDetail = () => {
  router.push(`/browse/events/${eventId.value}`)
}

const handleGoToYourEvents = () => {
  router.push('/browse/your-events')
}

const handleBackToCatalog = () => {
  router.push('/browse/events')
}
</script>

<template>
  <div class="registration-page">

    <div v-if="event" class="registration-container">

      <!-- PAGE HEADER -->

      <button
        type="button"
        class="back-button"
        @click="handleBackToDetail"
      >
        ← Back to Event Details
      </button>

      <div class="registration-header">

        <h1>
          {{ confirmedData
            ? 'Registration Confirmed'
            : 'Complete Your Registration' }}
        </h1>

        <p>
          {{ confirmedData
            ? 'Your event registration has been successfully completed.'
            : 'Fill in your information to secure your spot.' }}
        </p>

      </div>

      <div class="registration-content">

        <!-- EVENT SUMMARY -->

        <RegistrationSummary
          :event="event"
        />

        <div class="registration-form-wrapper">

          <!-- SUCCESS: SHOW RECEIPT -->

          <div v-if="confirmedData" class="success-section">

            <div class="success-icon">✓</div>

            <h2>Registration Confirmed!</h2>

            <p>
              Your registration has been successfully completed.
            </p>

            <RegistrationReceipt
              :confirmed-data="confirmedData"
              :event="event"
            />

            <div class="success-actions">

              <button
                type="button"
                class="primary-button"
                @click="handleGoToYourEvents"
              >
                View My Events →
              </button>

              <button
                type="button"
                class="secondary-button"
                @click="handleBackToCatalog"
              >
                Browse More Events
              </button>

            </div>

          </div>

          <!-- ALREADY REGISTERED BEFORE THIS SESSION -->

          <div
            v-else-if="isRegistered"
            class="notice-box"
          >
            <h3>You have already registered for this event.</h3>

            <p>
              You can view your booking details in Your Events.
            </p>

            <button
              type="button"
              class="primary-button"
              @click="handleGoToYourEvents"
            >
              View My Events →
            </button>
          </div>

          <!-- EVENT COMPLETED -->

          <div
            v-else-if="isEventCompleted"
            class="notice-box"
          >
            This event has already been completed.
          </div>

          <!-- SOLD OUT -->

          <div
            v-else-if="isSoldOut"
            class="notice-box"
          >
            Sorry, this event is fully booked.
          </div>

          <!-- REGISTRATION FORM -->

          <RegistrationForm
            v-else
            @submit="handleRegistrationSuccess"
            @cancel="handleBackToDetail"
          />

          <!-- ERROR MESSAGE -->

          <p
            v-if="registrationError"
            class="error-message"
          >
            {{ registrationError }}
          </p>

        </div>

      </div>

    </div>

    <div v-else class="loading-state">
      <p>Loading event information...</p>
    </div>

  </div>
</template>

<style scoped>
.registration-page {
  width: 100%;
  min-height: 70vh;
  color: #1c1948;
}

.registration-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 50px;
}

.back-button {
  background: transparent;
  border: none;
  color: #6644ff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 28px;
}

.back-button:hover {
  color: #5533ee;
}

.registration-header {
  margin-bottom: 30px;
}

.registration-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 10px;
  color: #1c1948;
}

.registration-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.registration-content {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 30px;
  align-items: start;
}

.registration-form-wrapper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.04);
}

.success-section {
  text-align: center;
}

.success-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 30px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.success-section h2 {
  color: #1c1948;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px;
}

.success-section > p {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 22px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.primary-button,
.secondary-button {
  padding: 13px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  background: #6644ff;
  color: #ffffff;
  border: 1px solid #6644ff;
}

.primary-button:hover {
  background: #5533ee;
}

.secondary-button {
  background: #ffffff;
  color: #6644ff;
  border: 1px solid #6644ff;
}

.notice-box {
  padding: 20px;
  border-radius: 10px;
  background: #f5f3ff;
  color: #1c1948;
  line-height: 1.7;
}

.notice-box h3 {
  font-size: 15px;
  margin: 0 0 8px;
}

.notice-box p {
  font-size: 13px;
  color: #64748b;
}

.notice-box button {
  margin-top: 12px;
}

.error-message {
  color: #dc2626;
  font-size: 13px;
  margin-top: 15px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

@media (max-width: 768px) {
  .registration-content {
    grid-template-columns: 1fr;
  }

  .registration-header h1 {
    font-size: 1.6rem;
  }

  .registration-container {
    padding: 20px 16px 40px;
  }
}
</style>