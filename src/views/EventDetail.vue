<script setup>
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/ui/AppButton.vue';
import AppCard from '@/components/ui/AppCard.vue';

const route = useRoute();
const router = useRouter();

const goBack = () => {
  router.push('/browse/events');
};

const handleRegister = () => {
  alert('Registration successful!');
};
</script>

<template>
  <div class="event-detail-page">
    <!-- BACK BUTTON -->
    <button @click="goBack" class="btn-back">
      &larr; Back to Events
    </button>

    <!-- EVENT HEADER -->
    <div class="detail-header">
      <span class="event-tag">Workshop & Training</span>
      <h1>Vue.js Mastery Workshop {{ route.params.id }}</h1>

      <div class="meta-info">
        <span class="meta-item">📅 October 12, 2026</span>
        <span class="meta-item">📍 Tech Hub, Jakarta Pusat</span>
        <span class="meta-item">👥 Quota: 150 Attendees</span>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="detail-content grid-asymmetric">
      <!-- LEFT CONTENT -->
      <div class="main-desc">
        <h2>About This Event</h2>
        <p>
          Welcome to the biggest web interface development training event of the year!
          Gatherly is collaborating with the local developer community to host a comprehensive workshop
          designed specifically to bring together professionals, enthusiasts, and students.
        </p>
        <p>
          In this session, we will discuss various current industry challenges, dissect the implementation
          of Single Page Applications (SPA), and practice hands-on Layout System design prioritizing visual hierarchy.
          You will gain practical insights that can be directly applied to your future projects or career.
        </p>

        <h2>Event Agenda</h2>
        <ul class="agenda-list">
          <li>
            <strong>09:00 AM</strong>
            <span>Registration & QR Check-in Scanning</span>
          </li>
          <li>
            <strong>10:00 AM</strong>
            <span>Session 1: Vue Router & Navigation Fundamentals</span>
          </li>
          <li>
            <strong>11:30 AM</strong>
            <span>Coffee Break & Networking Session</span>
          </li>
          <li>
            <strong>01:00 PM</strong>
            <span>Session 2: Layout System & Grid Implementation</span>
          </li>
          <li>
            <strong>03:00 PM</strong>
            <span>Q&A & Closing Remarks</span>
          </li>
        </ul>
      </div>

      <!-- RIGHT CARD (SIDEBAR / FOCAL POINT & STICKY PANE) -->
      <div class="sidebar">
        <AppCard class="ticket-card sticky-pane">
          <h3>Attendee Registration</h3>
          <p class="price">Free</p>
          <p class="ticket-desc">Secure your seat now before the quota is full.</p>

          <AppButton variant="primary" class="btn-register" @click="handleRegister">
            Register Now
          </AppButton>

          <p class="spots">Only 12 seats left!</p>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-detail-page {
  padding: 40px 80px;
  color: var(--text-main);
  margin-top: 70px;
  background-color: #fafafa;
  min-height: 100vh;
}

/* BACK BUTTON */
.btn-back {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
}

.btn-back:hover {
  color: var(--text-main);
}

/* HEADER */
.detail-header {
  background: var(--bg-light);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  padding: var(--space-12) var(--space-8);
  margin-bottom: var(--space-8);
}

.event-tag {
  display: inline-block;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-4);
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.detail-header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0 0 var(--space-4) 0;
  line-height: 1.2;
}

.meta-info {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 1.05rem;
}

/* ASYMMETRICAL GRID */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

/* LEFT CONTENT */
.main-desc h2 {
  margin-bottom: var(--space-4);
  font-size: 1.8rem;
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
}

.main-desc p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-6);
  font-size: 1.05rem;
}

/* AGENDA */
.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-list li {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
  display: flex;
  gap: var(--space-3);
}

.agenda-list strong {
  color: var(--text-main);
  min-width: 90px;
}

/* FOCAL POINT CARD & STICKY BEHAVIOR */
.ticket-card {
  padding: var(--space-8);
  text-align: center;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.price {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: var(--space-2);
}

.ticket-desc {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
  font-size: 0.95rem;
}

.btn-register {
  width: 100%;
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-weight: 600;
  font-size: 0.95rem;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }

  .event-detail-page {
    padding: 30px 20px;
  }
}
</style>