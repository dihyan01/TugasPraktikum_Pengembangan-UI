
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import AppButton from '@/components/ui/AppButton.vue'

// ==========================================
// MODUL 6 - EVENT LIST & REST API
// ==========================================

const router = useRouter()

// ==========================================
// CENTRALIZED STATE
// ==========================================

const {
  activeEvents,
  isUserRegistered,
  loading,
  error,
  fetchEvents
} = useEvents()

// ==========================================
// FETCH EVENTS WHEN COMPONENT MOUNTED
// ==========================================

onMounted(() => {
  fetchEvents()
})

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
  // DEBUG: CEK ID EVENT DARI MOCKAPI
  // ==========================================

  watch(
    activeEvents,
    (newEvents) => {
      console.log('DATA EVENT DARI MOCKAPI:', newEvents)
      console.log('ID EVENT:', newEvents.map(event => event.id))
    },
    { immediate: true }
  )

// ==========================================
// EVENT DETAIL NAVIGATION
// ==========================================

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`)
}

// ==========================================
// RELOAD EVENTS
// ==========================================

const handleReload = () => {
  fetchEvents()
}
</script>

<template>
  <div class="event-list-page">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->

    <div class="header-section">

      <div class="header-top">

        <div>
          <h2 class="section-title">
            Upcoming Events
          </h2>

          <p class="section-desc">
            Discover workshops, seminars, tech meetups,
            and competitions near you.
          </p>
        </div>

        <button
          class="btn-refresh"
          @click="handleReload"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : '↻ Refresh' }}
        </button>

      </div>

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
         CONDITION 1: LOADING STATE
    ====================================== -->

    <div
      v-if="loading"
      class="event-grid"
    >

      <div
        v-for="n in 3"
        :key="n"
        class="skeleton-card"
      >
        <div class="skeleton-line skeleton-category"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-info"></div>
        <div class="skeleton-line skeleton-desc"></div>
        <div class="skeleton-line skeleton-footer"></div>
      </div>

    </div>

    <!-- =====================================
         CONDITION 2: ERROR STATE
    ====================================== -->

    <div
      v-else-if="error"
      class="error-state"
    >

      <div class="error-icon">
        ⚠️
      </div>

      <h3>
        NETWORK ERROR
      </h3>

      <p>
        {{ error }}
      </p>

      <p class="error-hint">
        Please check your internet connection
        or try again later.
      </p>

      <AppButton
        variant="primary"
        @click="handleReload"
      >
        ↻ Reload Events
      </AppButton>

    </div>

    <!-- =====================================
         CONDITION 3: EMPTY STATE
    ====================================== -->

    <div
      v-else-if="filteredEvents.length === 0"
      class="empty-state"
    >

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

    <!-- =====================================
         CONDITION 4: SUCCESS STATE
    ====================================== -->

    <div
      v-else
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

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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
   REFRESH BUTTON
========================================== */

.btn-refresh {
  background: #6644ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-refresh:hover {
  background: #5533ee;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==========================================
   SEARCH & FILTERS
========================================== */

.filters-section {
  margin-bottom: var(--space-6, 24px);
}

/* ==========================================
   EVENT GRID
========================================== */

.event-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: var(--space-6, 24px);
}

/* ==========================================
   LOADING SKELETON
========================================== */

.skeleton-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  min-height: 210px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
}

.skeleton-line {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #eeeeee 25%,
    #f8f8f8 50%,
    #eeeeee 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-category {
  width: 25%;
  height: 22px;
}

.skeleton-title {
  width: 65%;
  height: 22px;
}

.skeleton-info {
  width: 85%;
  height: 14px;
}

.skeleton-desc {
  width: 100%;
  height: 35px;
}

.skeleton-footer {
  width: 45%;
  height: 32px;
  margin-top: auto;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* ==========================================
   ERROR STATE
========================================== */

.error-state {
  text-align: center;
  padding: 48px 24px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 12px;
  max-width: 600px;
  margin: 32px auto;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.error-state h3 {
  color: #dc2626;
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.error-state p {
  color: #7f1d1d;
  line-height: 1.6;
}

.error-hint {
  margin-bottom: 24px;
  font-size: 0.95rem;
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

  .header-top {
    align-items: flex-start;
    flex-direction: column;
  }

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

  .error-state {
    padding: 35px 20px;
  }

}

</style>