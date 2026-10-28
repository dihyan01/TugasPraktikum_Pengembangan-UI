
<script setup>
import { reactive, ref, computed } from 'vue'

// ==========================================
// MODUL 5 - REGISTRATION FORM
// ==========================================

// Event dari parent component
const emit = defineEmits(['submit', 'cancel'])

// ==========================================
// FORM STATE
// ==========================================

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  reason: ''
})

// Error state
const errors = reactive({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  reason: ''
})

// Modal cancel state
const showCancelModal = ref(false)

// ==========================================
// FORM DIRTY DETECTION
// ==========================================

const isFormDirty = computed(() => {
  return Object.values(form).some(value => {
    return String(value).trim() !== ''
  })
})

// ==========================================
// VALIDATION
// ==========================================

const validateField = (field) => {
  const value = String(form[field] || '').trim()

  errors[field] = ''

  switch (field) {

    case 'fullName':
      if (!value) {
        errors.fullName = 'Full name is required.'
      } else if (value.length < 3) {
        errors.fullName =
          'Full name must contain at least 3 characters.'
      }
      break

    case 'email':
      if (!value) {
        errors.email = 'Email address is required.'
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors.email =
          'Please enter a valid email address.'
      }
      break

    case 'phone':
      if (!value) {
        errors.phone = 'Phone number is required.'
      } else if (
        !/^\+?[0-9]{10,15}$/.test(value)
      ) {
        errors.phone =
          'Enter a valid phone number (10-15 digits).'
      }
      break

    case 'dob':
      if (!value) {
        errors.dob = 'Date of birth is required.'
      } else {
        const selected = new Date(value + 'T00:00:00')
        const today = new Date()

        today.setHours(0, 0, 0, 0)

        if (
          Number.isNaN(selected.getTime()) ||
          selected > today
        ) {
          errors.dob =
            'Date of birth cannot be in the future.'
        }
      }
      break

    case 'reason':
      if (!value) {
        errors.reason =
          'Please tell us why you want to join.'
      } else if (value.length < 10) {
        errors.reason =
          'Please write at least 10 characters.'
      }
      break
  }

  return !errors[field]
}

const validateForm = () => {
  const fields = [
    'fullName',
    'email',
    'phone',
    'dob',
    'reason'
  ]

  return fields.map(validateField).every(Boolean)
}

// ==========================================
// SUBMIT FORM
// ==========================================

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    dob: form.dob,
    reason: form.reason.trim()
  })
}

// ==========================================
// CANCEL FORM
// ==========================================

const handleCancel = () => {
  if (isFormDirty.value) {
    showCancelModal.value = true
  } else {
    emit('cancel')
  }
}

const confirmCancel = () => {
  showCancelModal.value = false
  emit('cancel')
}

const closeCancelModal = () => {
  showCancelModal.value = false
}
</script>

<template>
  <div class="registration-form-card">

    <!-- FORM HEADER -->
    <div class="form-header">
      <div class="form-header-icon">📝</div>

      <div>
        <h2>Attendee Registration</h2>
        <p>
          Please complete your details to secure
          your spot at this event.
        </p>
      </div>
    </div>

    <!-- REGISTRATION FORM -->
    <form
      class="registration-form"
      @submit.prevent="handleSubmit"
      novalidate
    >

      <!-- FULL NAME -->
      <div class="form-group">
        <label for="fullName">
          Full Name <span class="required">*</span>
        </label>

        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          autocomplete="name"
          placeholder="Enter your full name"
          :class="{ 'input-error': errors.fullName }"
          :aria-invalid="Boolean(errors.fullName)"
          @blur="validateField('fullName')"
          @input="errors.fullName = ''"
        />

        <small v-if="errors.fullName" class="error-text">
          ⚠ {{ errors.fullName }}
        </small>
      </div>

      <!-- EMAIL -->
      <div class="form-group">
        <label for="email">
          Email Address <span class="required">*</span>
        </label>

        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="example@email.com"
          :class="{ 'input-error': errors.email }"
          :aria-invalid="Boolean(errors.email)"
          @blur="validateField('email')"
          @input="errors.email = ''"
        />

        <small v-if="errors.email" class="error-text">
          ⚠ {{ errors.email }}
        </small>
      </div>

      <!-- PHONE & DATE OF BIRTH -->
      <div class="form-row">

        <div class="form-group">
          <label for="phone">
            Phone Number <span class="required">*</span>
          </label>

          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="081234567890"
            :class="{ 'input-error': errors.phone }"
            :aria-invalid="Boolean(errors.phone)"
            @blur="validateField('phone')"
            @input="errors.phone = ''"
          />

          <small v-if="errors.phone" class="error-text">
            ⚠ {{ errors.phone }}
          </small>
        </div>

        <div class="form-group">
          <label for="dob">
            Date of Birth <span class="required">*</span>
          </label>

          <input
            id="dob"
            v-model="form.dob"
            type="date"
            autocomplete="bday"
            :max="new Date().toLocaleDateString('en-CA')"
            :class="{ 'input-error': errors.dob }"
            :aria-invalid="Boolean(errors.dob)"
            @blur="validateField('dob')"
            @change="errors.dob = ''"
          />

          <small v-if="errors.dob" class="error-text">
            ⚠ {{ errors.dob }}
          </small>
        </div>

      </div>

      <!-- REASON -->
      <div class="form-group">
        <label for="reason">
          Why do you want to attend?
          <span class="required">*</span>
        </label>

        <textarea
          id="reason"
          v-model="form.reason"
          rows="5"
          placeholder="Tell us what motivates you to join this event..."
          :class="{ 'input-error': errors.reason }"
          :aria-invalid="Boolean(errors.reason)"
          @blur="validateField('reason')"
          @input="errors.reason = ''"
        ></textarea>

        <small v-if="errors.reason" class="error-text">
          ⚠ {{ errors.reason }}
        </small>

        <small class="helper-text">
          Minimum 10 characters.
        </small>
      </div>

      <!-- FORM FOOTER -->
      <div class="form-footer">

        <p class="footer-note">
          🔒 Your information will only be used
          for event registration.
        </p>

        <div class="form-actions">
          <button
            type="button"
            class="cancel-btn"
            @click="handleCancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="submit-btn"
          >
            Confirm Registration →
          </button>
        </div>

      </div>

    </form>

    <!-- CANCEL CONFIRMATION MODAL -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="modal-overlay"
        @click.self="closeCancelModal"
      >
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <div class="modal-icon">⚠️</div>

          <h3 id="cancel-modal-title">
            Discard Registration?
          </h3>

          <p>
            You have entered information in this
            form. If you leave now, your unsaved
            changes will be lost.
          </p>

          <div class="modal-actions">
            <button
              class="cancel-btn"
              @click="closeCancelModal"
            >
              Keep Editing
            </button>

            <button
              class="discard-btn"
              @click="confirmCancel"
            >
              Yes, Discard
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>

/* ==========================================
   REGISTRATION FORM CONTAINER
========================================== */

.registration-form-card {
  width: 100%;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 5px 22px rgba(25, 23, 67, 0.05);
  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   FORM HEADER
========================================== */

.form-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 22px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eeeeF3;
}

.form-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  background: #f0edff;
  border-radius: 10px;
  font-size: 20px;
}

.form-header h2 {
  margin: 0 0 7px;
  font-size: 21px;
  font-weight: 800;
  color: #1c1948;
}

.form-header p {
  margin: 0;
  font-size: 12px;
  color: #858592;
  line-height: 1.7;
}

/* ==========================================
   FORM GROUP
========================================== */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;
  min-width: 0;
}

.form-group label {
  color: #29264d;
  font-size: 12px;
  font-weight: 700;
}

.required {
  color: #ef4444;
}

/* ==========================================
   INPUT AND TEXTAREA
========================================== */

.form-group input,
.form-group textarea {
  width: 100%;
  min-width: 0;
  display: block;
  background: #ffffff;
  color: #333344;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input {
  min-height: 45px;
}

.form-group textarea {
  min-height: 125px;
  resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a0a0af;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6644ff;
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.10);
}

/* ==========================================
   TWO COLUMN INPUT
========================================== */

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 20px;
}

/* ==========================================
   ERROR STATE
========================================== */

.form-group input.input-error,
.form-group textarea.input-error {
  border-color: #ef4444;
  background: #fffafa;
}

.form-group input.input-error:focus,
.form-group textarea.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.10);
}

.error-text {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #dc2626;
  line-height: 1.5;
}

.helper-text {
  font-size: 11px;
  color: #9292a0;
}

/* ==========================================
   FORM FOOTER
========================================== */

.form-footer {
  border-top: 1px solid #eeeeF3;
  padding-top: 22px;
  margin-top: 10px;
}

.footer-note {
  color: #9292a0;
  font-size: 11px;
  margin: 0 0 20px;
  line-height: 1.7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

/* ==========================================
   BUTTONS
========================================== */

.cancel-btn,
.submit-btn,
.discard-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.cancel-btn {
  background: #ffffff;
  color: #555566;
  border: 1px solid #e4e4e7;
}

.cancel-btn:hover {
  background: #f4f4f5;
}

.submit-btn {
  background: #6644ff;
  color: #ffffff;
  border: 1px solid #6644ff;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.20);
}

.submit-btn:hover {
  background: #5533ee;
  transform: translateY(-1px);
}

/* ==========================================
   CANCEL MODAL
========================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 430px;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  text-align: center;
}

.modal-icon {
  font-size: 36px;
  margin-bottom: 13px;
}

.modal-card h3 {
  color: #1c1948;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 12px;
}

.modal-card p {
  color: #777789;
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.discard-btn {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: #ffffff;
}

.discard-btn:hover {
  background: #dc2626;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {
  .registration-form-card {
    padding: 22px;
  }

  .form-header h2 {
    font-size: 18px;
  }
}

@media (max-width: 550px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .form-actions button {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>