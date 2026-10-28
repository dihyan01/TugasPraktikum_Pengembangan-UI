
<script setup>
import { reactive, ref } from 'vue'

// ==========================================
// MODUL 5 - EVENT CREATE FORM
// ==========================================

const emit = defineEmits(['submit', 'cancel'])

// ==========================================
// FORM STATE
// ==========================================

const initialForm = () => ({
  title: '',
  cat: 'Workshop',
  date: '',
  loc: '',
  quota: 100,
  price: 'Free',
  desc: ''
})

const form = reactive(initialForm())

// ==========================================
// FEEDBACK STATE
// ==========================================

const errorMessage = ref('')
const successMessage = ref('')

// ==========================================
// RESET FORM
// ==========================================

const resetForm = () => {
  Object.assign(form, initialForm())
  errorMessage.value = ''
  successMessage.value = ''
}

// ==========================================
// VALIDATION
// ==========================================

const validateForm = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !form.title.trim() ||
    !form.cat ||
    !form.date ||
    !form.loc.trim() ||
    !form.desc.trim()
  ) {
    errorMessage.value =
      'Please fill in all required fields before publishing the event!'

    return false
  }

  if (
    !Number.isInteger(Number(form.quota)) ||
    Number(form.quota) < 1
  ) {
    errorMessage.value =
      'Attendee quota must be a positive whole number.'

    return false
  }

  const selectedDate = new Date(form.date)

  if (Number.isNaN(selectedDate.getTime())) {
    errorMessage.value =
      'Please enter a valid event date and time.'

    return false
  }

  return true
}

// ==========================================
// FORMAT DATE
// ==========================================

const formatEventDate = (dateValue) => {
  const date = new Date(dateValue)

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// ==========================================
// SUBMIT EVENT
// ==========================================

const handleSubmit = () => {
  if (!validateForm()) return

  const eventData = {
    title: form.title.trim(),
    cat: form.cat,
    date: formatEventDate(form.date),
    loc: form.loc.trim(),
    quota: Number(form.quota),
    price: form.price,
    desc: form.desc.trim()
  }

  // Kirim data ke EventManagement.vue
  emit('submit', eventData)

  // Jangan reset otomatis di sini.
  // Parent menentukan apakah penyimpanan berhasil.
}

// ==========================================
// FEEDBACK METHODS
// ==========================================

// Dipanggil parent setelah event tersimpan
const showSuccess = () => {
  resetForm()
  successMessage.value =
    '🎉 Event published successfully and is now live!'
}

// Dipanggil parent jika penyimpanan gagal
const showError = (message) => {
  successMessage.value = ''
  errorMessage.value =
    message || 'Unable to publish the event.'
}

// ==========================================
// CANCEL
// ==========================================

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

// Parent boleh memanggil fungsi ini melalui ref
defineExpose({
  resetForm,
  showSuccess,
  showError
})
</script>

<template>
  <section class="event-create-card">

    <!-- =====================================
         FORM HEADER
    ====================================== -->

    <div class="form-header">
      <h2>Create New Event Form</h2>

      <p>
        Information entered here will be instantly
        published to the Gatherly public catalog.
      </p>
    </div>

    <!-- =====================================
         ERROR MESSAGE
    ====================================== -->

    <div
      v-if="errorMessage"
      class="alert alert-error"
      role="alert"
    >
      ⚠️ {{ errorMessage }}
    </div>

    <!-- =====================================
         SUCCESS MESSAGE
    ====================================== -->

    <div
      v-if="successMessage"
      class="alert alert-success"
      role="status"
    >
      {{ successMessage }}
    </div>

    <!-- =====================================
         EVENT CREATE FORM
    ====================================== -->

    <form
      class="event-form"
      @submit.prevent="handleSubmit"
      novalidate
    >

      <!-- EVENT TITLE -->
      <div class="form-group">

        <label for="create-event-title">
          Event Title <span class="required">*</span>
        </label>

        <input
          id="create-event-title"
          v-model="form.title"
          type="text"
          placeholder="e.g. Modern UI/UX Masterclass"
        />

      </div>

      <!-- CATEGORY & DATE -->
      <div class="form-row">

        <div class="form-group">

          <label for="create-event-category">
            Event Category <span class="required">*</span>
          </label>

          <select
            id="create-event-category"
            v-model="form.cat"
          >
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Competition">Competition</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
          </select>

        </div>

        <div class="form-group">

          <label for="create-event-date">
            Date & Time <span class="required">*</span>
          </label>

          <input
            id="create-event-date"
            v-model="form.date"
            type="datetime-local"
          />

        </div>

      </div>

      <!-- LOCATION & QUOTA -->
      <div class="form-row">

        <div class="form-group">

          <label for="create-event-location">
            Event Location <span class="required">*</span>
          </label>

          <input
            id="create-event-location"
            v-model="form.loc"
            type="text"
            placeholder="e.g. Innovation Center, Jakarta"
          />

        </div>

        <div class="form-group">

          <label for="create-event-quota">
            Attendee Quota <span class="required">*</span>
          </label>

          <input
            id="create-event-quota"
            v-model.number="form.quota"
            type="number"
            min="1"
            step="1"
          />

        </div>

      </div>

      <!-- EVENT DESCRIPTION -->
      <div class="form-group">

        <label for="create-event-description">
          Event Description <span class="required">*</span>
        </label>

        <textarea
          id="create-event-description"
          v-model="form.desc"
          rows="5"
          placeholder="Describe the agenda, speakers, and key takeaways..."
        ></textarea>

      </div>

      <!-- =====================================
           FORM BUTTONS
      ====================================== -->

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
          class="publish-btn"
        >
          🚀 Publish Event Now
        </button>

      </div>

    </form>

  </section>
</template>

<style scoped>

/* ==========================================
   EVENT CREATE CARD
========================================== */

.event-create-card {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;

  padding: 28px;

  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;

  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.04);

  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
  box-sizing: border-box;
}

/* ==========================================
   FORM HEADER
========================================== */

.form-header {
  margin-bottom: 24px;
}

.form-header h2 {
  margin: 0 0 9px;

  font-size: 19px;
  font-weight: 800;
  color: #1c1948;
}

.form-header p {
  margin: 0;

  color: #858592;
  font-size: 12px;
  line-height: 1.7;
}

/* ==========================================
   FORM GROUPS
========================================== */

.event-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-group label {
  color: #1c1948;
  font-size: 12px;
  font-weight: 700;
}

.required {
  color: #ef4444;
}

/* ==========================================
   FORM GRID
========================================== */

.form-row {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
}

/* ==========================================
   INPUT & TEXTAREA
========================================== */

.form-group input,
.form-group select,
.form-group textarea {
  display: block;
  width: 100%;
  min-width: 0;

  padding: 11px 13px;

  color: #333344;
  background: #ffffff;

  border: 1px solid #e4e4e7;
  border-radius: 7px;

  font-family: inherit;
  font-size: 12px;
  line-height: 1.5;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input,
.form-group select {
  min-height: 43px;
}

.form-group textarea {
  min-height: 115px;
  resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a0a0af;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6644ff;
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.1);
}

/* ==========================================
   VALIDATION ALERT
========================================== */

.alert {
  padding: 13px 15px;
  margin-bottom: 21px;

  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
}

.alert-error {
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.alert-success {
  color: #15803d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

/* ==========================================
   FORM ACTIONS
========================================== */

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 8px;
  padding-top: 18px;

  border-top: 1px solid #eeeeF3;
}

/* ==========================================
   BUTTONS
========================================== */

.cancel-btn,
.publish-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 12px 20px;
  border-radius: 8px;

  font-family: inherit;
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
  transition: 0.2s ease;
}

.cancel-btn {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  color: #555566;
}

.cancel-btn:hover {
  background: #f4f4f5;
}

.publish-btn {
  color: #ffffff;
  background: #6644ff;
  border: 1px solid #6644ff;

  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.2);
}

.publish-btn:hover {
  background: #5533ee;
  border-color: #5533ee;
  transform: translateY(-1px);
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {

  .event-create-card {
    padding: 22px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 18px;
  }

}

@media (max-width: 480px) {

  .event-create-card {
    padding: 18px;
  }

  .form-header h2 {
    font-size: 17px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }

}
</style>