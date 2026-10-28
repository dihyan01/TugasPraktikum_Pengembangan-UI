
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useEvents } from '@/composables/useEvents'
import OrganizerEventCard from '@/components/event/OrganizerEventCard.vue'
import EventCreateForm from '@/components/event/EventCreateForm.vue'
import AppModal from '@/components/ui/AppModal.vue'

// ==========================================
// MODUL 5 - EVENT MANAGEMENT INTEGRATION
// ==========================================

const router = useRouter()

// ==========================================
// CENTRALIZED EVENT STATE
// ==========================================

const {
  activeEvents,
  completedEvents,
  createEvent,
  completeEvent,
  deleteEvent
} = useEvents()

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
// CREATE EVENT HANDLER
// ==========================================

const handleCreateEvent = (eventData) => {
  try {
    // Simpan event menggunakan shared state
    const newEvent = createEvent(eventData)

    if (!newEvent) {
      eventCreateFormRef.value?.showError(
        'Unable to publish the event. Please try again.'
      )
      return
    }

    // Tampilkan feedback sukses di form
    eventCreateFormRef.value?.showSuccess()

    // Tetap di tab Create agar feedback terbaca
    currentTab.value = 'create'

  } catch (error) {
    console.error('Create event failed:', error)

    eventCreateFormRef.value?.showError(
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

// ==========================================
// OPEN COMPLETE MODAL
// ==========================================

const handleOpenCompleteModal = (event) => {
  if (!event || event.done) return

  selectedEvent.value = event
  modalAction.value = 'complete'
  isModalOpen.value = true
}

// ==========================================
// OPEN DELETE MODAL
// ==========================================

const handleOpenDeleteModal = (event) => {
  if (!event) return

  selectedEvent.value = event
  modalAction.value = 'delete'
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

  if (modalAction.value === 'complete') {
    return (
      `Are you sure you want to mark "${title}" ` +
      'as completed? Once completed, the event ' +
      'will be removed from public listings and ' +
      'moved to the archive.'
    )
  }

  return (
    `Are you sure you want to permanently delete ` +
    `"${title}"? This action cannot be undone ` +
    'and will permanently remove the event ' +
    'and its associated registrations.'
  )
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
  isModalOpen.value = false
  selectedEvent.value = null
  modalAction.value = ''
}

// ==========================================
// CONFIRM COMPLETE / DELETE
// ==========================================

const handleConfirmModal = () => {
  if (!selectedEvent.value) {
    handleCloseModal()
    return
  }

  const eventId = selectedEvent.value.id

  try {
    if (modalAction.value === 'complete') {
      // Memindahkan event ke Completed
      completeEvent(eventId)

      // Kembali ke tab Completed Events
      currentTab.value = 'completed'

    } else if (modalAction.value === 'delete') {
      // Menghapus event dan registrasi terkait
      deleteEvent(eventId)

      // Tetap pada tab yang dipilih
    }

    handleCloseModal()

  } catch (error) {
    console.error('Event action failed:', error)
    handleCloseModal()
    window.alert(
      'Unable to process the event action. Please try again.'
    )
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

      <!-- ACTIVE EVENTS -->
      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'active' }"
        :aria-current="currentTab === 'active' ? 'page' : undefined"
        @click="switchTab('active')"
      >
        ⚡ Active Events ({{ activeEvents.length }})
      </button>

      <!-- CREATE EVENT -->
      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'create' }"
        :aria-current="currentTab === 'create' ? 'page' : undefined"
        @click="switchTab('create')"
      >
        ＋ Create Event
      </button>

      <!-- COMPLETED EVENTS -->
      <button
        type="button"
        class="tab-btn"
        :class="{ active: currentTab === 'completed' }"
        :aria-current="currentTab === 'completed' ? 'page' : undefined"
        @click="switchTab('completed')"
      >
        ✅ Completed Events ({{ completedEvents.length }})
      </button>

    </nav>

    <!-- =====================================
         TAB 1 - ACTIVE EVENTS
    ====================================== -->

    <section
      v-if="currentTab === 'active'"
      class="tab-content"
    >

      <!-- ACTIVE EVENT CARDS -->
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

        <div class="empty-icon">
          📂
        </div>

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

      <!-- COMPLETED EVENT CARDS -->
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

        <div class="empty-icon">
          📁
        </div>

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

  box-shadow:
    0 5px 15px rgba(102, 68, 255, 0.2);

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

  box-shadow:
    0 4px 12px rgba(102, 68, 255, 0.18);
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

  box-shadow:
    0 5px 20px rgba(25, 23, 67, 0.03);
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