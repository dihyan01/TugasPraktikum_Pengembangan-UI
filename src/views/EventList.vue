<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import EventCard from '@/components/event/EventCard.vue';
import SearchBar from '@/components/event/SearchBar.vue';
import CategoryFilter from '@/components/event/CategoryFilter.vue';

const router = useRouter();

const events = [
  {
    id: 1,
    title: 'Vue.js Mastery Workshop',
    date: 'Oct 12, 2026',
    loc: 'Tech Hub, Jakarta',
    cat: 'Workshop',
    desc: 'Learn advanced Vue 3 concepts, Composition API, and state management to build high-performance web applications interactively.'
  },
  {
    id: 2,
    title: 'National Tech Meetup',
    date: 'Oct 15, 2026',
    loc: 'Main Auditorium, City Center',
    cat: 'Meetup',
    desc: 'A gathering of hundreds of developers and tech enthusiasts to share the latest industry trends and expand professional networks.'
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: 'Nov 02, 2026',
    loc: 'Innovation Center',
    cat: 'Competition',
    desc: 'Watch the best local startup founders pitch their innovative ideas live in front of a panel of renowned investors.'
  },
  {
    id: 4,
    title: 'UI/UX Design Sprint',
    date: 'Nov 10, 2026',
    loc: 'Creative Studio',
    cat: 'Workshop',
    desc: 'A hands-on session on designing user interfaces by implementing layout systems and visual hierarchy principles.'
  },
  {
    id: 5,
    title: 'Digital Marketing Seminar',
    date: 'Nov 20, 2026',
    loc: 'Grand Hotel Hall',
    cat: 'Seminar',
    desc: 'An in-depth seminar dissecting modern digital marketing strategies, from SEO optimization to user conversion tactics.'
  },
  {
    id: 6,
    title: "Community Leaders Summit",
    date: 'Dec 05, 2026',
    loc: 'Gatherly HQ',
    cat: 'Conference',
    desc: 'An exclusive year-end conference for community leaders to formulate sustainable ecosystem development strategies.'
  }
];

const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ['All', 'Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference'];

const filteredEvents = computed(() => {
  return events.filter(event => {
    const matchSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        event.loc.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = selectedCategory.value === 'All' || event.cat === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`);
};
</script>

<template>
  <div class="event-list-page">
    <div class="content-container">
      <div class="header-section">
        <h2 class="section-title">Upcoming Events</h2>
        <p class="section-desc">Discover workshops, seminars, tech meetups, and competitions near you.</p>
      </div>

      <div class="filters-section">
        <SearchBar v-model="searchQuery" />
        <CategoryFilter :categories="categories" v-model="selectedCategory" />
      </div>

      <div class="event-grid" v-if="filteredEvents.length > 0">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          @view-detail="handleViewDetail"
        />
      </div>

      <div v-else class="empty-state">
        <p>No events found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  padding: 40px 60px;
  margin-top: 70px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.content-container {
  width: 100%;
  max-width: 1200px;
}

.header-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: 8px;
  color: #1a1a1a;
  font-weight: 700;
}

.section-desc {
  color: #666666;
  font-size: 1.1rem;
}

.filters-section {
  margin-bottom: 30px;
  width: 100%;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666666;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

@media (max-width: 1024px) {
  .event-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .event-grid {
    grid-template-columns: 1fr;
  }
  .event-list-page {
    padding: 20px;
  }
}
</style>