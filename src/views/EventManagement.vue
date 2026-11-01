
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useEvents } from '@/composables/useEvents'
import OrganizerEventCard from '@/components/event/OrganizerEventCard.vue'
import EventCreateForm from '@/components/event/EventCreateForm.vue'
import AppModal from '@/components/ui/AppModal.vue'

// ==========================================
// MODUL 6 - EVENT MANAGEMENT & REST API
// ==========================================

const router = useRouter()

// ==========================================
// CENTRALIZED EVENT STATE
// ==========================================

const {
  events,
  activeEvents,
  completedEvents,
  loading,
  error,
  fetchEvents,
  createEvent,
  completeEvent,
  deleteEvent
} = useEvents()

// ==========================================
// INITIAL DATA FETCH
// ==========================================

const initialLoading = ref(true)
const loadError = ref('')

const loadEventData = async () => {
  initialLoading.value = true
  loadError.value = ''

  const result = await fetchEvents()

  if (result === null) {
    loadError.value = error.value ||
      'Failed to load events from server.'
  }

  initialLoading.value = false
}

onMounted(() => {
  loadEventData()
})

// ==========================================
// TAB NAVIGATION
// ==========================================

const currentTab = ref('active')

const switchTab = (tab) => {
  currentTab.value = tab
}

// ==========================================
// CREATE EVENT FORM REFERENCE
// ==========================================

const eventCreateFormRef = ref(null)

// ==========================================
// CREATE EVENT HANDLER - POST
// ==========================================

const handleCreateEvent = async (eventData) => {
  try {
    const newEvent = await createEvent(eventData)

    if (!newEvent) {
      eventCreateFormRef.value?.showError(
        error.value ||
        'Unable to publish the event. Please try again.'
      )
      return
    }

    eventCreateFormRef.value?.showSuccess()

    // Tetap di tab Create agar feedback terlihat
    currentTab.value = 'create'

  } catch (err) {
    console.error('Create Event Failed:', err)

    eventCreateFormRef.value?.showError(
      err.message ||
      'Something went wrong while publishing the event.'
    )
  }
}

// ==========================================
// EVENT DETAIL NAVIGATION
// ==========================================

const handleViewDetail = (eventId) => {
  router.push(`/browse/events/${eventId}`)
}

// ==========================================
// MODAL STATE
// ==========================================

const isModalOpen = ref(false)
const modalAction = ref('')
const selectedEvent = ref(null)
const actionError = ref('')

// ==========================================
// OPEN COMPLETE MODAL
// ==========================================

const handleOpenCompleteModal = (event) => {
  if (!event || event.done) return

  selectedEvent.value = event
  modalAction.value = 'complete'
  actionError.value = ''
  isModalOpen.value = true
}

// ==========================================
// OPEN DELETE MODAL
// ==========================================

const handleOpenDeleteModal = (event) => {
  if (!event) return

  selectedEvent.value = event
  modalAction.value = 'delete'
  actionError.value = ''
  isModalOpen.value = true
}

// ==========================================
// MODAL CONTENT
// ==========================================

const modalTitle = computed(() => {
  return modalAction.value === 'complete'
    ? 'Complete Event?'
    : 'Delete Event Permanently?'
})

const modalMessage = computed(() => {
  const title = selectedEvent.value?.title || ''

  const message = modalAction.value === 'complete'
    ? `Are you sure you want to mark "${title}" as completed? Once completed, the event will be removed from public listings and moved to the archive.`
    : `Are you sure you want to permanently delete "${title}"? This action cannot be undone and will permanently remove the event and its associated registrations.`

  return actionError.value
    ? `${message}\n\nError: ${actionError.value}`
    : message
})

const modalConfirmText = computed(() => {
  return modalAction.value === 'complete'
    ? 'Yes, Complete'
    : 'Yes, Delete Permanently'
})

// ==========================================
// CLOSE CONFIRMATION MODAL
// ==========================================

const handleCloseModal = () => {
  if (loading.value) return

  isModalOpen.value = false
  selectedEvent.value = null
  modalAction.value = ''
  actionError.value = ''
}

// ==========================================
// CONFIRM COMPLETE / DELETE - API
// ==========================================

const handleConfirmModal = async () => {
  if (!selectedEvent.value || loading.value) return

  const eventId = selectedEvent.value.id

  actionError.value = ''

  try {

    // ======================================
    // PUT: COMPLETE EVENT
    // ======================================

    if (modalAction.value === 'complete') {

      const result = await completeEvent(eventId)

      if (!result) {
        actionError.value =
          error.value ||
          'Failed to complete event on server.'

        return
      }

      // Berhasil dipindahkan ke Completed
      currentTab.value = 'completed'

    }

    // ======================================
    // DELETE: REMOVE EVENT
    // ======================================

    else if (modalAction.value === 'delete') {

      const result = await deleteEvent(eventId)

      if (!result) {
        actionError.value =
          error.value ||
          'Failed to delete event from server.'

        return
      }

      // Event otomatis dihapus dari shared state
      // Registrasi terkait juga dibersihkan oleh composable
    }

    handleCloseModal()

  } catch (err) {

    console.error('Event Action Failed:', err)

    actionError.value =
      err.message ||
      'Unable to process the event action. Please try again.'
  }
}
</script>

<template>
  <div class="event-management-page">

    <!-- =====================================
         PAGE HEADER
    ====================================== -->

    <header class="page-header">

      <div class="header-content">

        <h1>Event Management Control</h1>

        <p>
          Manage event lifecycle, publish new events,
          and archive completed ones.
        </p>

      </div>

      <button
        type="button"
        class="primary-btn create-header-btn"
        @click="switchTab('create')"
      >
        ＋ Create New Event
      </button>

    </header>

    <!-- =====================================
         TAB NAVIGATION
    ====================================== -->

    <nav
      class="tab-container"
      aria-label="Event management tabs"
    >

      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'active' }"
        @click="switchTab('active')"
      >
        ⚡ Active Events ({{ activeEvents.length }})
      </button>

      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'create' }"
        @click="switchTab('create')"
      >
        ＋ Create Event
      </button>

      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'completed' }"
        @click="switchTab('completed')"
      >
        ✅ Completed Events ({{ completedEvents.length }})
      </button>

    </nav>

    <!-- =====================================
         INITIAL LOADING
    ====================================== -->

    <div
      v-if="initialLoading"
      class="status-state"
    >
      <div class="loading-spinner"></div>
      <h3>Loading Events...</h3>
      <p>Please wait while we retrieve event data from the server.</p>
    </div>

    <!-- =====================================
         API ERROR
    ====================================== -->

    <div
      v-else-if="loadError"
      class="error-state"
    >

      <div class="error-icon">⚠️</div>

      <h3>Unable to Load Events</h3>

      <p>{{ loadError }}</p>

      <button
        type="button"
        class="primary-btn"
        @click="loadEventData"
      >
        ↻ Retry Loading Events
      </button>

    </div>

    <!-- =====================================
         TAB 1 - ACTIVE EVENTS
    ====================================== -->

    <section
      v-else-if="currentTab === 'active'"
      class="tab-content"
    >

      <div
        v-if="activeEvents.length > 0"
        class="events-grid"
      >

        <OrganizerEventCard
          v-for="event in activeEvents"
          :key="event.id"
          :event="event"
          @view-detail="handleViewDetail"
          @complete="handleOpenCompleteModal"
          @delete="handleOpenDeleteModal"
        />

      </div>

      <!-- ACTIVE EMPTY STATE -->

      <div
        v-else
        class="empty-state"
      >

        <div class="empty-icon">📂</div>

        <h2>No Active Events</h2>

        <p>
          All events have ended or none have been
          created yet. Please create a new event.
        </p>

        <button
          type="button"
          class="primary-btn"
          @click="switchTab('create')"
        >
          Create Event Now
        </button>

      </div>

    </section>

    <!-- =====================================
         TAB 2 - CREATE EVENT
    ====================================== -->

    <section
      v-else-if="currentTab === 'create'"
      class="tab-content"
    >

      <EventCreateForm
        ref="eventCreateFormRef"
        @submit="handleCreateEvent"
        @cancel="switchTab('active')"
      />

    </section>

    <!-- =====================================
         TAB 3 - COMPLETED EVENTS
    ====================================== -->

    <section
      v-else-if="currentTab === 'completed'"
      class="tab-content"
    >

      <div
        v-if="completedEvents.length > 0"
        class="events-grid"
      >

        <OrganizerEventCard
          v-for="event in completedEvents"
          :key="event.id"
          :event="event"
          @view-detail="handleViewDetail"
          @complete="handleOpenCompleteModal"
          @delete="handleOpenDeleteModal"
        />

      </div>

      <!-- COMPLETED EMPTY STATE -->

      <div
        v-else
        class="empty-state"
      >

        <div class="empty-icon">📁</div>

        <h2>No Completed Events</h2>

        <p>
          Events marked as completed will be
          archived here.
        </p>

        <button
          type="button"
          class="outline-btn"
          @click="switchTab('active')"
        >
          View Active Events
        </button>

      </div>

    </section>

    <!-- =====================================
         CONFIRMATION MODAL
    ====================================== -->

    <AppModal
      :is-open="isModalOpen"
      :title="modalTitle"
      :message="modalMessage"
      :confirm-text="modalConfirmText"
      cancel-text="Cancel"
      :variant="modalAction === 'delete' ? 'danger' : 'primary'"
      @confirm="handleConfirmModal"
      @close="handleCloseModal"
    />

  </div>
</template>

<style scoped>

/* ==========================================
   EVENT MANAGEMENT PAGE
========================================== */

.event-management-page {
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 32px;
  background: #f5f5f8;
  color: #1c1948;
  font-family: Inter, Arial, sans-serif;
  box-sizing: border-box;
}

/* ==========================================
   PAGE HEADER
========================================== */

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.header-content {
  min-width: 0;
}

.header-content h1 {
  margin: 0 0 9px;
  color: #1c1948;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.3;
}

.header-content p {
  color: #777789;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
}

/* ==========================================
   PRIMARY BUTTON
========================================== */

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border: 1px solid #6644ff;
  border-radius: 8px;
  background: #6644ff;
  color: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 5px 15px rgba(102, 68, 255, 0.2);
  transition: 0.2s ease;
}

.primary-btn:hover {
  background: #5533ee;
  border-color: #5533ee;
  transform: translateY(-1px);
}

/* ==========================================
   TAB NAVIGATION
========================================== */

.tab-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #777789;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition: 0.2s ease;
}

.tab-btn:hover {
  background: #ece9ff;
  color: #6644ff;
}

.tab-btn.active {
  background: #6644ff;
  color: #ffffff;
  border-color: #6644ff;
  box-shadow: 0 4px 12px rgba(102, 68, 255, 0.18);
}

/* ==========================================
   TAB CONTENT
========================================== */

.tab-content {
  width: 100%;
  min-width: 0;
}

/* ==========================================
   EVENTS GRID
========================================== */

.events-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(min(100%, 290px), 1fr));
  gap: 20px;
  align-items: stretch;
}

/* ==========================================
   EMPTY STATE
========================================== */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 55px 25px;
  background: #ffffff;
  border: 1px dashed #e4e4e7;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.03);
}

.empty-icon {
  font-size: 44px;
  margin-bottom: 15px;
}

.empty-state h2 {
  color: #1c1948;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 10px;
}

.empty-state p {
  color: #858592;
  max-width: 450px;
  font-size: 13px;
  line-height: 1.7;
  margin: 0 0 23px;
}

/* ==========================================
   OUTLINE BUTTON
========================================== */

.outline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  color: #555566;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.outline-btn:hover {
  background: #f0edff;
  border-color: #ded8ff;
  color: #6644ff;
}

/* ==========================================
   LOADING STATE
========================================== */

.status-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 20px;
  text-align: center;
  background: #ffffff;
  border-radius: 12px;
}

.loading-spinner {
  width: 38px;
  height: 38px;
  border: 4px solid #ece9ff;
  border-top-color: #6644ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-state h3 {
  color: #1c1948;
  margin: 18px 0 8px;
}

.status-state p {
  color: #777789;
  font-size: 13px;
}

/* ==========================================
   ERROR STATE
========================================== */

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 45px 25px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 12px;
  text-align: center;
}

.error-icon {
  font-size: 38px;
  margin-bottom: 12px;
}

.error-state h3 {
  color: #dc2626;
  margin: 0 0 10px;
}

.error-state p {
  color: #777789;
  font-size: 13px;
  margin-bottom: 22px;
}

/* ==========================================
   RESPONSIVE TABLET
========================================== */

@media (max-width: 900px) {
  .event-management-page {
    padding: 26px 20px;
  }

  .header-content h1 {
    font-size: 23px;
  }

  .events-grid {
    grid-template-columns:
      repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  }
}

/* ==========================================
   RESPONSIVE MOBILE
========================================== */

@media (max-width: 600px) {
  .event-management-page {
    padding: 22px 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .header-content h1 {
    font-size: 21px;
  }

  .create-header-btn {
    width: 100%;
  }

  .tab-container {
    gap: 6px;
  }

  .tab-btn {
    padding: 9px 11px;
    font-size: 11px;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 40px 18px;
  }
}

</style>