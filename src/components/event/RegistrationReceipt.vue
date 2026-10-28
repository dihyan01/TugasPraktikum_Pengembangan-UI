
<script setup>
// ==========================================
// MODUL 5 - REGISTRATION RECEIPT
// Bukti Konfirmasi Pendaftaran Gatherly
// ==========================================

// Data diterima dari EventRegistration.vue
defineProps({
  confirmedData: {
    type: Object,
    default: null
  },

  event: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div
    v-if="confirmedData && event"
    class="receipt-preview"
  >

    <!-- SUCCESS MESSAGE -->
    <p class="receipt-greeting">
      Thank you,
      <strong>{{ confirmedData.fullName }}</strong>!

      Your registration for
      <strong>{{ event.title }}</strong>
      has been officially confirmed.
    </p>

    <!-- RECEIPT DETAILS -->
    <div class="receipt-box">

      <!-- BOOKING REFERENCE -->
      <div class="receipt-row">
        <span class="receipt-label">
          Booking Reference
        </span>

        <span class="receipt-value ref-code">
          {{ confirmedData.bookingCode }}
        </span>
      </div>

      <!-- ATTENDEE EMAIL -->
      <div class="receipt-row">
        <span class="receipt-label">
          Attendee Email
        </span>

        <span class="receipt-value">
          {{ confirmedData.email }}
        </span>
      </div>

      <!-- EVENT SCHEDULE -->
      <div class="receipt-row">
        <span class="receipt-label">
          Event Schedule
        </span>

        <span class="receipt-value">
          {{ event.date }}
        </span>
      </div>

      <!-- EVENT LOCATION -->
      <div class="receipt-row">
        <span class="receipt-label">
          Venue / Location
        </span>

        <span class="receipt-value">
          {{ event.loc }}
        </span>
      </div>

    </div>

  </div>
</template>

<style scoped>

/* ==========================================
   REGISTRATION RECEIPT
========================================== */

.receipt-preview {
  width: 100%;
  margin-top: 8px;
  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   SUCCESS GREETING
========================================== */

.receipt-greeting {
  font-size: 14px;
  color: #1c1948;
  line-height: 1.7;
  margin: 0 0 20px;
}

.receipt-greeting strong {
  color: #1c1948;
  font-weight: 700;
}

/* ==========================================
   RECEIPT CONTAINER
========================================== */

.receipt-box {
  width: 100%;
  background: #f8f8fc;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ==========================================
   RECEIPT ROW
========================================== */

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  font-size: 13px;
}

/* ==========================================
   RECEIPT LABEL
========================================== */

.receipt-label {
  color: #777789;
  font-size: 12px;
  font-weight: 500;
}

/* ==========================================
   RECEIPT VALUE
========================================== */

.receipt-value {
  color: #1c1948;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
  overflow-wrap: anywhere;
}

/* ==========================================
   BOOKING CODE
========================================== */

.ref-code {
  font-family: monospace;
  font-size: 14px;
  font-weight: 800;
  color: #6644ff;

  background: rgba(102, 68, 255, 0.08);
  border-radius: 5px;
  padding: 5px 10px;

  letter-spacing: 0.4px;
}

/* ==========================================
   RESPONSIVE DESIGN
========================================== */

@media (max-width: 480px) {

  .receipt-box {
    padding: 16px;
  }

  .receipt-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .receipt-value {
    text-align: left;
  }

  .receipt-greeting {
    font-size: 13px;
  }
}
</style>