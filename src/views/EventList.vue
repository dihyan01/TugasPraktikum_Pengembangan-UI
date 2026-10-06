<template>
  <div class="event-list-page">
    <div class="event-grid">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event-card"
      >
        <div class="event-top">
          <span class="event-date">{{ event.date }}</span>
          <span class="event-category">{{ event.category }}</span>
        </div>

        <h3>{{ event.title }}</h3>

        <p class="event-location">
          <span class="pin-icon">📍</span> {{ event.location }}
        </p>

        <p class="event-description">{{ event.description }}</p>

        <div class="event-footer">
          <router-link :to="`/browse/events/${event.id}`">
            View Event Details →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Data disesuaikan persis dengan gambar referensi awal Anda
const events = [
  {
    id: 1,
    date: 'Oct 12, 2026',
    category: 'WORKSHOP',
    title: 'Vue.js Mastery Workshop',
    location: 'Tech Hub, Jakarta',
    description: 'Learn advanced Vue 3 concepts, Composition API, and state management to build high-performance web applications interactively.'
  },
  {
    id: 2,
    date: 'Oct 15, 2026',
    category: 'MEETUP',
    title: 'National Tech Meetup',
    location: 'Main Auditorium, City Center',
    description: 'A gathering of hundreds of developers and tech enthusiasts to share the latest industry trends and expand professional networks.'
  },
  {
    id: 3,
    date: 'Nov 02, 2026',
    category: 'COMPETITION',
    title: 'Startup Pitch Competition',
    location: 'Innovation Center',
    description: 'Watch the best local startup founders pitch their innovative ideas live in front of a panel of renowned investors.'
  },
  {
    id: 4,
    date: 'Nov 10, 2026',
    category: 'WORKSHOP',
    title: 'UI/UX Design Sprint',
    location: 'Creative Studio',
    description: 'A hands-on session on designing user interfaces by implementing layout systems and visual hierarchy principles.'
  },
  {
    id: 5,
    date: 'Nov 20, 2026',
    category: 'SEMINAR',
    title: 'Digital Marketing Seminar',
    location: 'Grand Hotel Hall',
    description: 'An in-depth seminar dissecting modern digital marketing strategies, from SEO optimization to user conversion tactics.'
  },
  {
    id: 6,
    date: 'Dec 05, 2026',
    category: 'CONFERENCE',
    title: 'Community Leaders Summit',
    location: 'Gatherly HQ',
    description: 'An exclusive year-end conference for community leaders to formulate sustainable ecosystem development strategies.'
  }
]
</script>

<style scoped>
.event-list-page {
  padding: 40px;
  /* Diberi margin-top agar konten turun dan tidak tertutup navbar */
  margin-top: 80px; 
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* GRID 3 COLUMN */
.event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* CARD */
.event-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

/* TOP */
.event-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.event-date {
  background: #eeebff;
  color: #5b46e0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.event-category {
  font-size: 12px;
  color: #6c757d;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* TITLE */
.event-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

/* LOCATION */
.event-location {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pin-icon {
  color: #e53935;
  font-style: normal;
}

/* DESCRIPTION */
.event-description {
  font-size: 13.5px;
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 24px 0;
  flex-grow: 1;
}

/* FOOTER */
.event-footer {
  border-top: 1px solid #f1f3f5;
  padding-top: 16px;
}

.event-footer a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  transition: color 0.2s ease;
}

.event-footer a:hover {
  color: #5b46e0;
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .event-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .event-grid {
    grid-template-columns: 1fr;
  }

  .event-list-page {
    padding: 20px;
    margin-top: 70px;
  }
}
</style>