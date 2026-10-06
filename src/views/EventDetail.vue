<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goBack = () => {
  router.push('/browse/events')
}

const handleRegister = () => {
  alert('Registration successful!')
}
</script>

<template>
  <div class="event-detail-page">
    <!-- BACK BUTTON -->
    <button @click="goBack" class="btn-back">
      ← Back to Events
    </button>

    <!-- EVENT HEADER -->
    <div class="event-header">
      <span class="event-tag">Workshop & Training</span>
      <h1>Vue.js Mastery Workshop {{ route.params.id }}</h1>

      <div class="event-meta">
        <span>📅 October 12, 2026</span>
        <span>📍 Tech Hub, Jakarta Pusat</span>
        <span>👥 Quota: 150 Attendees</span>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="event-layout">
      <!-- LEFT CONTENT -->
      <div class="event-content">
        <section class="content-section">
          <h2>About This Event</h2>
          <p>
            Welcome to the biggest web interface development training event
            of the year. Gatherly is collaborating with the local developer
            community to host a comprehensive workshop designed specifically
            to bring together professionals, enthusiasts, and students.
          </p>
          <p>
            In this session, we will discuss various current industry
            challenges, dissect the implementation of Single Page Applications
            (SPA), and practice hands-on Layout System design prioritizing
            visual hierarchy.
          </p>
        </section>

        <section class="content-section">
          <h2>Event Agenda</h2>
          <ul class="agenda-list">
            <li>
              <strong>09:00 AM</strong>
              <span>- Registration & QR Check-in Scanning</span>
            </li>
            <li>
              <strong>10:00 AM</strong>
              <span>- Session 1: Vue Router & Navigation Fundamentals</span>
            </li>
            <li>
              <strong>11:30 AM</strong>
              <span>- Coffee Break & Networking Session</span>
            </li>
            <li>
              <strong>01:00 PM</strong>
              <span>- Session 2: Layout System & Grid Implementation</span>
            </li>
            <li>
              <strong>03:00 PM</strong>
              <span>- Q&A & Closing Remarks</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- RIGHT CARD (SIDEBAR) -->
      <aside class="registration-card">
        <h3>Attendee Registration</h3>
        <div class="price">Free</div>
        <p class="subtitle">Secure your seat now before the quota is full.</p>

        <button class="btn-register" @click="handleRegister">
          Register Now
        </button>

        <span class="seat">Only 12 seats left!</span>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.event-detail-page {
  padding: 40px 80px;
  color: #1c1948;
  margin-top: 70px;
  background-color: #fafafa;
  min-height: 100vh;
}

/* BACK BUTTON */
.btn-back {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #eaeaea;
  color: #1c1948;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 25px;
  transition: background-color 0.2s ease;
}

.btn-back:hover {
  background: #e0e0e0;
}

/* HEADER */
.event-header {
  margin-bottom: 35px;
}

.event-tag {
  display: inline-block;
  background: #eeeaff;
  color: #6644ff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.event-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 16px 0;
  line-height: 1.2;
}

.event-meta {
  display: flex;
  gap: 25px;
  color: #666;
  font-size: 15px;
  flex-wrap: wrap;
}

/* TWO COLUMN LAYOUT */
.event-layout {
  display: grid;
  grid-template-columns: 1fr 340px; /* Alokasi lebar pasti untuk sidebar */
  gap: 40px;
  align-items: start;
}

/* LEFT CONTENT */
.content-section {
  margin-bottom: 40px;
}

.event-content h2 {
  font-size: 24px;
  font-weight: 700;
  border-left: 5px solid #6644ff;
  padding-left: 12px;
  margin-bottom: 18px;
}

.event-content p {
  color: #555;
  line-height: 1.7;
  font-size: 16px;
  margin-bottom: 16px;
}

/* AGENDA */
.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agenda-list li {
  padding: 14px 0;
  border-bottom: 1px solid #eeeeee;
  color: #555;
  display: flex;
  gap: 12px;
  font-size: 15px;
}

.agenda-list strong {
  color: #1c1948;
  min-width: 80px;
}

/* RIGHT CARD */
.registration-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 30px 16px;
  text-align: center;
  position: sticky;
  top: 100px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
}

.registration-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.price {
  font-size: 42px;
  font-weight: 800;
  color: #6644ff;
  margin: 15px 0;
  line-height: 1;
}

.subtitle {
  color: #777;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 20px;
  white-space: nowrap; /* MENJAGA TEKS TETAP 1 BARIS KESAMPING */
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: #6644ff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn-register:hover {
  background: #5233ea;
}

.btn-register:active {
  transform: scale(0.98);
}

.seat {
  display: block;
  margin-top: 16px;
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .event-layout {
    grid-template-columns: 1fr;
  }

  .event-detail-page {
    padding: 30px 20px;
  }

  .registration-card {
    position: static;
    margin-top: 20px;
  }
}
</style>