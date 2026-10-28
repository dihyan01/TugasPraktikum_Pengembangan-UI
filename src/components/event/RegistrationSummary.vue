
<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <aside class="registration-summary">
    <div class="summary-card">

      <div class="summary-header">
        <span class="summary-icon">🎟️</span>
        <span class="summary-heading">EVENT SUMMARY</span>
      </div>

      <div class="summary-content">
        <span class="category-badge">
          {{ event.cat }}
        </span>

        <h2 class="event-title">
          {{ event.title }}
        </h2>

        <div class="summary-divider"></div>

        <div class="detail-item">
          <span class="detail-icon">📅</span>
          <div>
            <span class="detail-label">DATE & TIME</span>
            <p>{{ event.date }}</p>
          </div>
        </div>

        <div class="detail-item">
          <span class="detail-icon">📍</span>
          <div>
            <span class="detail-label">LOCATION</span>
            <p>{{ event.loc }}</p>
          </div>
        </div>

        <div class="detail-item">
          <span class="detail-icon">👥</span>
          <div>
            <span class="detail-label">AVAILABLE SEATS</span>
            <p>{{ event.quota }} seats remaining</p>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="price-row">
          <span>Registration Fee</span>
          <strong>{{ event.price || 'Free' }}</strong>
        </div>
      </div>

      <div class="summary-footer">
        <span>🔒</span>
        <p>
          Your registration details will be securely
          recorded for this event.
        </p>
      </div>

    </div>
  </aside>
</template>

<style scoped>
.registration-summary {
  width: 100%;
  min-width: 0;
}

.summary-card {
  position: sticky;
  top: 24px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 5px 22px rgba(25, 23, 67, 0.05);
  font-family: Inter, Arial, sans-serif;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
  background: #f5f3ff;
  border-bottom: 1px solid #e9e5ff;
}

.summary-icon {
  font-size: 20px;
}

.summary-heading {
  color: #6644ff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.7px;
}

.summary-content {
  padding: 24px;
}

.category-badge {
  display: inline-block;
  background: #f0edff;
  color: #6644ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 14px;
}

.event-title {
  color: #1c1948;
  font-size: 22px;
  line-height: 1.4;
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
}

.summary-divider {
  height: 1px;
  background: #ededf2;
  margin: 23px 0;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 22px;
}

.detail-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.detail-label {
  display: block;
  color: #9292a0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.detail-item p {
  margin: 0;
  color: #36334f;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.price-row span {
  color: #777789;
  font-size: 13px;
}

.price-row strong {
  color: #6644ff;
  font-size: 20px;
  font-weight: 800;
}

.summary-footer {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fafaff;
  padding: 16px 24px;
  border-top: 1px solid #eeeeF3;
}

.summary-footer p {
  margin: 0;
  font-size: 11px;
  color: #858592;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .summary-card {
    position: static;
  }

  .summary-content {
    padding: 20px;
  }

  .event-title {
    font-size: 19px;
  }
}
</style>