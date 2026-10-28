
import { ref, computed, watch } from 'vue'

// ==========================================
// MODUL 5 - CENTRALIZED STATE MANAGEMENT
// Gatherly Event & Registration System
// ==========================================

// ==========================================
// 1. LOCAL STORAGE KEYS
// ==========================================

const EVENTS_STORAGE_KEY = 'gatherly_events'
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations'

// ==========================================
// 2. INITIAL STATE
// ==========================================

// Data event awal sengaja kosong
const defaultEvents = []

// Membaca data yang sebelumnya tersimpan
const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
const savedRegistrations = localStorage.getItem(
  REGISTRATIONS_STORAGE_KEY
)

// SINGLE SOURCE OF TRUTH
// Diletakkan di luar fungsi agar digunakan bersama

const events = ref(
  savedEvents ? JSON.parse(savedEvents) : defaultEvents
)

const userRegistrations = ref(
  savedRegistrations ? JSON.parse(savedRegistrations) : []
)

// ==========================================
// 3. LOCAL STORAGE WATCHERS
// ==========================================

// Menyimpan perubahan event
watch(
  events,
  (newEvents) => {
    localStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(newEvents)
    )
  },
  { deep: true }
)

// Menyimpan perubahan registrasi peserta
watch(
  userRegistrations,
  (newRegistrations) => {
    localStorage.setItem(
      REGISTRATIONS_STORAGE_KEY,
      JSON.stringify(newRegistrations)
    )
  },
  { deep: true }
)

// ==========================================
// 4. COMPOSABLE
// ==========================================

export function useEvents() {

  // ========================================
  // DERIVED STATE
  // ========================================

  const totalEvents = computed(() => {
    return events.value.length
  })

  const activeEvents = computed(() => {
    return events.value.filter(event => !event.done)
  })

  const completedEvents = computed(() => {
    return events.value.filter(event => event.done)
  })

  const totalRegistrations = computed(() => {
    return userRegistrations.value.length
  })

  // ========================================
  // CREATE EVENT
  // ========================================

  const createEvent = (eventData) => {

    const newEvent = {
      id: Date.now(),

      title: eventData.title,

      date: eventData.date,

      loc: eventData.loc.startsWith('📍 ')
        ? eventData.loc
        : `📍 ${eventData.loc}`,

      cat: eventData.cat,

      quota: Number(eventData.quota) || 100,

      price: eventData.price || 'Free',

      desc: eventData.desc,

      done: false
    }

    events.value.unshift(newEvent)

    return newEvent
  }

  // ========================================
  // COMPLETE EVENT
  // ========================================

  const completeEvent = (id) => {

    const target = events.value.find(
      event => event.id === Number(id)
    )

    if (target) {
      target.done = true
    }
  }

  // ========================================
  // DELETE EVENT
  // ========================================

  const deleteEvent = (id) => {

    const eventId = Number(id)

    const index = events.value.findIndex(
      event => event.id === eventId
    )

    if (index !== -1) {

      // Hapus event utama
      events.value.splice(index, 1)

      // Hapus semua tiket terkait event
      userRegistrations.value =
        userRegistrations.value.filter(
          registration =>
            registration.eventId !== eventId
        )
    }
  }

  // ========================================
  // GET EVENT BY ID
  // ========================================

  const getEventById = (id) => {

    return events.value.find(
      event => event.id === Number(id)
    )
  }

  // ========================================
  // REGISTER ATTENDEE
  // ========================================

  const registerAttendee = (eventId, participantData) => {

    // Cari event berdasarkan ID
    const event = events.value.find(
      event => event.id === Number(eventId)
    )

    // Validasi event
    if (!event || event.done) {
      return null
    }

    // Validasi kuota
    if (event.quota <= 0) {
      return null
    }

    // Cegah pendaftaran ganda pada browser ini
    const alreadyRegistered =
      userRegistrations.value.some(
        registration =>
          registration.eventId === Number(eventId)
      )

    if (alreadyRegistered) {
      return null
    }

    // Membuat booking code unik
    const bookingCode =
      'GTH-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random().toString(36).slice(2, 7).toUpperCase()

    // Membuat data registrasi
    const registrationRecord = {

      id: Date.now(),

      eventId: Number(eventId),

      bookingCode: bookingCode,

      registeredAt: new Date().toISOString(),

      fullName: participantData.fullName.trim(),

      email: participantData.email.trim(),

      phone: participantData.phone.trim(),

      dob: participantData.dob,

      reason: participantData.reason.trim()
    }

    // Mengurangi kuota event
    event.quota = Math.max(0, event.quota - 1)

    // Menyimpan registrasi terbaru
    userRegistrations.value.unshift(registrationRecord)

    return registrationRecord
  }

  // ========================================
  // CHECK USER REGISTRATION
  // ========================================

  const isUserRegistered = (eventId) => {

    return userRegistrations.value.some(
      registration =>
        registration.eventId === Number(eventId)
    )
  }

  // ========================================
  // GET REGISTRATION BY EVENT ID
  // ========================================

  const getRegistrationByEventId = (eventId) => {

    return userRegistrations.value.find(
      registration =>
        registration.eventId === Number(eventId)
    )
  }

  // ========================================
  // CHECK EVENT STATUS
  // ========================================

  const isEventDone = (eventId) => {

    const event = getEventById(eventId)

    return event ? event.done : false
  }

  // ========================================
  // CANCEL REGISTRATION
  // ========================================

  const cancelRegistration = (eventId) => {

    const numericId = Number(eventId)

    // Cari registrasi peserta
    const index = userRegistrations.value.findIndex(
      registration =>
        registration.eventId === numericId
    )

    if (index === -1) {
      return false
    }

    // Cari event terkait
    const event = events.value.find(
      event => event.id === numericId
    )

    // Kembalikan kuota jika event masih aktif
    if (event && !event.done) {
      event.quota += 1
    }

    // Hapus data pendaftaran
    userRegistrations.value.splice(index, 1)

    return true
  }

  // ========================================
  // CLEAR ALL EVENTS
  // ========================================

  const clearAllEvents = () => {

    events.value = []

    // Registrasi juga dihapus supaya
    // tidak ada tiket tanpa event
    userRegistrations.value = []

    localStorage.removeItem(EVENTS_STORAGE_KEY)
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY)
  }

  // ========================================
  // CLEAR ALL REGISTRATIONS
  // ========================================

  const clearAllRegistrations = () => {

    // Mengembalikan kuota untuk tiket aktif
    userRegistrations.value.forEach(registration => {

      const event = events.value.find(
        event => event.id === registration.eventId
      )

      if (event && !event.done) {
        event.quota += 1
      }
    })

    userRegistrations.value = []

    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY)
  }

  // ========================================
  // RETURN SHARED STATE & ACTIONS
  // ========================================

  return {

    // EVENT STATE
    events,
    totalEvents,
    activeEvents,
    completedEvents,

    // REGISTRATION STATE
    userRegistrations,
    totalRegistrations,

    // EVENT ACTIONS
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,

    // REGISTRATION ACTIONS
    registerAttendee,
    cancelRegistration,
    isUserRegistered,
    getRegistrationByEventId,
    isEventDone,

    // RESET ACTIONS
    clearAllEvents,
    clearAllRegistrations
  }
}