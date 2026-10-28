
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import AppButton from '@/components/ui/AppButton.vue'

// ==========================================
// MODUL 5 - EVENT LIST
// ==========================================

const router = useRouter()

// ==========================================
// CENTRALIZED STATE
// ==========================================

// Mengambil event aktif dan status registrasi
const {
  activeEvents,
  userRegistrations
} = useEvents()

// ==========================================
// SEARCH & CATEGORY FILTER
// ==========================================

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = [
  'All',
  'Workshop',
  'Meetup',
  'Competition',
  'Seminar',
  'Conference'
]

// ==========================================
// REACTIVE EVENT FILTERING
// ==========================================

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return activeEvents.value.filter(event => {

    const title = String(event.title || '').toLowerCase()
    const location = String(event.loc || '').toLowerCase()

    const matchSearch =
      title.includes(query) ||
      location.includes(query)

    const matchCategory =
      selectedCategory.value === 'All' ||
      event.cat === selectedCategory.value

    return matchSearch && matchCategory
  })
})

// ==========================================
// REGISTRATION STATUS
// ==========================================

// Memeriksa apakah event sudah didaftarkan
const isUserRegistered = (eventId) => {
  return userRegistrations.value.some(
    registration =>
      Number(registration.eventId) === Number(eventId)
  )
}

// ==========================================
// EVENT DETAIL NAVIGATION
// ==========================================

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`)
}
</script>

<template>
  <div class="event-list-page">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->

    <div class="header-section">

      <h2 class="section-title">
        Upcoming Events
      </h2>

      <p class="section-desc">
        Discover workshops, seminars, tech meetups,
        and competitions near you.
      </p>

    </div>

    <!-- =====================================
         SEARCH & CATEGORY FILTER
    ====================================== -->

    <div class="filters-section">

      <SearchBar
        v-model="searchQuery"
      />

      <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
      />

    </div>

    <!-- =====================================
         ACTIVE EVENT GRID
    ====================================== -->

    <div
      v-if="filteredEvents.length > 0"
      class="event-grid"
    >

      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :is-registered="isUserRegistered(event.id)"
        @view-detail="handleViewDetail"
      />

    </div>

    <!-- =====================================
         EMPTY STATE
    ====================================== -->

    <div v-else class="empty-state">

      <div class="empty-icon">
        📅
      </div>

      <h3>
        No Events Available Yet
      </h3>

      <p>
        There are currently no active events
        matching your selection.
        <br />
        Explore other categories or publish a new
        event through the Organizer Dashboard.
      </p>

      <div class="empty-action">

        <AppButton
          variant="primary"
          @click="router.push('/dashboard')"
        >
          Go to Organizer Dashboard →
        </AppButton>

      </div>

    </div>

  </div>
</template>

<style scoped>

/* ==========================================
   EVENT LIST PAGE
========================================== */

.event-list-page {
  width: 100%;
  color: #1c1948;
}

/* ==========================================
   PAGE HEADER
========================================== */

.header-section {
  margin-bottom: var(--space-8, 32px);
}

.section-title {
  color: var(--text-main, #1c1948);
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 var(--space-2, 8px);
}

.section-desc {
  color: var(--text-muted, #666666);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

/* ==========================================
   SEARCH & FILTERS
========================================== */

.filters-section {
  margin-bottom: var(--space-6, 24px);
}

/* ==========================================
   ADAPTIVE EVENT GRID
========================================== */

.event-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: var(--space-6, 24px);
}

/* ==========================================
   EMPTY STATE
========================================== */

.empty-state {
  text-align: center;

  padding:
    var(--space-12, 48px)
    var(--space-8, 32px);

  color: var(--text-muted, #666666);
  background: #ffffff;

  border-radius: 12px;
  border: 1px dashed var(--border-color, #e4e4e7);

  max-width: 600px;
  margin: var(--space-8, 32px) auto;

  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: var(--space-3, 12px);
}

.empty-state h3 {
  color: var(--text-main, #1c1948);
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 var(--space-2, 8px);
}

.empty-state p {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 var(--space-6, 24px);
}

.empty-action {
  display: flex;
  justify-content: center;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {

  .section-title {
    font-size: 1.7rem;
  }

  .section-desc {
    font-size: 0.95rem;
  }

}

@media (max-width: 480px) {

  .event-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 35px 20px;
  }

}
</style>