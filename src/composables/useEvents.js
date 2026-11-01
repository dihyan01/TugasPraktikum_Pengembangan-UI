
import { ref, computed, watch } from 'vue'

// ==========================================
// MODUL 6 - REST API & CENTRALIZED STATE
// Gatherly Event & Registration System
// ==========================================

// 1. STORAGE KEYS
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations'

// ==========================================
// 2. API CONFIGURATION
// ==========================================

const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    throw new Error('API URL belum dikonfigurasi di file .env')
  }

  return baseUrl.replace(/\/$/, '')
}

const getApiUrl = (endpoint = '') => {
  return `${getApiBaseUrl()}/events${endpoint}`
}

// ==========================================
// 3. INITIAL STATE
// ==========================================

const events = ref([])

const loadSavedRegistrations = () => {
  try {
    const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (err) {
    console.error('Gagal membaca data registrasi:', err)
    return []
  }
}

const userRegistrations = ref(loadSavedRegistrations())

// ==========================================
// 4. ASYNC STATUS
// ==========================================

const loading = ref(false)
const error = ref(null)

// ==========================================
// 5. REGISTRATION WATCHER
// ==========================================

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
// 6. NORMALIZE API DATA
// ==========================================

const normalizeEvent = (event) => ({
  ...event,

  id: String(event.id),

  title: event.title || '',
  date: event.date || '',

  loc: event.loc
    ? (
        String(event.loc).startsWith('📍 ')
          ? event.loc
          : `📍 ${event.loc}`
      )
    : '',

  cat: event.cat || '',
  quota: Number(event.quota) || 0,
  price: event.price || 'Free',
  desc: event.desc || '',
  done: Boolean(event.done)
})

// ==========================================
// 7. COMPOSABLE
// ==========================================

export function useEvents() {

  // ========================================
  // DERIVED STATE
  // ========================================

  const totalEvents = computed(() => events.value.length)

  const activeEvents = computed(() =>
    events.value.filter(event => !event.done)
  )

  const completedEvents = computed(() =>
    events.value.filter(event => event.done)
  )

  const totalRegistrations = computed(() =>
    userRegistrations.value.length
  )

  // ========================================
  // GET: FETCH ALL EVENTS
  // ========================================

  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(getApiUrl())

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data event (HTTP ${response.status})`
        )
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Format data event dari API tidak valid.')
      }

      events.value = data.map(normalizeEvent)

      return events.value

    } catch (err) {
      error.value = err.message || 'Gagal mengambil data event'
      console.error('Fetch Events Error:', err)

      return null

    } finally {
      loading.value = false
    }
  }

  // ========================================
  // GET: FETCH EVENT BY ID
  // ========================================

  const fetchEventById = async (id) => {
    const eventId = String(id)

    const existingEvent = getEventById(eventId)

    if (existingEvent) {
      return existingEvent
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        getApiUrl(`/${encodeURIComponent(eventId)}`)
      )

      if (response.status === 404) {
        throw new Error('Event tidak ditemukan di server.')
      }

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil detail event (HTTP ${response.status})`
        )
      }

      const data = normalizeEvent(await response.json())

      const index = events.value.findIndex(
        event => String(event.id) === eventId
      )

      if (index === -1) {
        events.value.push(data)
      } else {
        events.value[index] = data
      }

      return data

    } catch (err) {
      error.value = err.message || 'Gagal mengambil detail event'
      console.error('Fetch Event By ID Error:', err)

      return null

    } finally {
      loading.value = false
    }
  }

  // ========================================
  // POST: CREATE EVENT
  // ========================================

  const createEvent = async (eventData) => {
    loading.value = true
    error.value = null

    try {
      const newEventData = {
        title: eventData.title,
        date: eventData.date,

        loc: String(eventData.loc || '')
          .replace(/^📍\s*/, ''),

        cat: eventData.cat,
        quota: Number(eventData.quota) || 100,
        price: eventData.price || 'Free',
        desc: eventData.desc || '',
        done: false
      }

      const response = await fetch(getApiUrl(), {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(newEventData)
      })

      if (!response.ok) {
        throw new Error(
          `Gagal membuat event (HTTP ${response.status})`
        )
      }

      const savedEvent = normalizeEvent(
        await response.json()
      )

      events.value.unshift(savedEvent)

      return savedEvent

    } catch (err) {
      error.value = err.message || 'Gagal menyimpan event'
      console.error('Create Event Error:', err)

      return null

    } finally {
      loading.value = false
    }
  }

  // ========================================
  // DELETE: REMOVE EVENT
  // ========================================

  const deleteEvent = async (id) => {
    const eventId = String(id)

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        getApiUrl(`/${encodeURIComponent(eventId)}`),
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error(
          `Gagal menghapus event (HTTP ${response.status})`
        )
      }

      events.value = events.value.filter(
        event => String(event.id) !== eventId
      )

      userRegistrations.value =
        userRegistrations.value.filter(
          registration =>
            String(registration.eventId) !== eventId
        )

      return true

    } catch (err) {
      error.value = err.message || 'Gagal menghapus event'
      console.error('Delete Event Error:', err)

      return false

    } finally {
      loading.value = false
    }
  }

  // ========================================
  // PUT: UPDATE EVENT
  // ========================================

  const updateEvent = async (id, updates) => {
    const eventId = String(id)

    let target = getEventById(eventId)

    if (!target) {
      target = await fetchEventById(eventId)
    }

    if (!target) return false

    loading.value = true
    error.value = null

    try {
      const updatedData = {
        title: updates.title ?? target.title,
        date: updates.date ?? target.date,

        loc: String(
          updates.loc ?? target.loc ?? ''
        ).replace(/^📍\s*/, ''),

        cat: updates.cat ?? target.cat,

        quota: Number(
          updates.quota ?? target.quota
        ),

        price: updates.price ?? target.price,
        desc: updates.desc ?? target.desc,
        done: updates.done ?? target.done
      }

      const response = await fetch(
        getApiUrl(`/${encodeURIComponent(eventId)}`),
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(updatedData)
        }
      )

      if (!response.ok) {
        throw new Error(
          `Gagal memperbarui event (HTTP ${response.status})`
        )
      }

      const savedEvent = normalizeEvent(
        await response.json()
      )

      const index = events.value.findIndex(
        event => String(event.id) === eventId
      )

      if (index !== -1) {
        events.value[index] = savedEvent
      } else {
        events.value.push(savedEvent)
      }

      return savedEvent

    } catch (err) {
      error.value = err.message || 'Gagal memperbarui event'
      console.error('Update Event Error:', err)

      return false

    } finally {
      loading.value = false
    }
  }

  // ========================================
  // COMPLETE EVENT
  // ========================================

  const completeEvent = async (id) => {
    return await updateEvent(id, {
      done: true
    })
  }

  // ========================================
  // GET EVENT BY ID FROM LOCAL STATE
  // ========================================

  const getEventById = (id) => {
    return events.value.find(
      event => String(event.id) === String(id)
    )
  }

  // ========================================
  // REGISTER ATTENDEE
  // ========================================

  const registerAttendee = async (eventId, participantData) => {

    const id = String(eventId)

    let event = getEventById(id)

    if (!event) {
      event = await fetchEventById(id)
    }

    if (!event || event.done || Number(event.quota) <= 0) {
      return null
    }

    // Check duplicate registration
    const alreadyRegistered = userRegistrations.value.some(
      registration =>
        String(registration.eventId) === id
    )

    if (alreadyRegistered) {
      return null
    }

    // Validate participant data
    if (
      !participantData.fullName?.trim() ||
      !participantData.email?.trim() ||
      !participantData.phone?.trim()
    ) {
      throw new Error('Data peserta belum lengkap.')
    }

    // Generate booking reference
    const bookingCode =
      'GTH-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random().toString(36).slice(2, 7).toUpperCase()

    // Update event quota in MockAPI
    const updatedEvent = await updateEvent(id, {
      quota: Number(event.quota) - 1
    })

    if (!updatedEvent) {
      throw new Error('Gagal memperbarui kuota event.')
    }

    // Create registration record
    const registrationRecord = {
      id: bookingCode,
      eventId: id,
      bookingCode,

      registeredAt: new Date().toISOString(),

      fullName: participantData.fullName.trim(),
      email: participantData.email.trim(),
      phone: participantData.phone.trim(),
      dob: participantData.dob || '',
      reason: (participantData.reason || '').trim()
    }

    // Save registration locally
    userRegistrations.value.unshift(registrationRecord)

    return registrationRecord
  }

  // ========================================
  // CHECK USER REGISTRATION
  // ========================================

  const isUserRegistered = (eventId) => {
    return userRegistrations.value.some(
      registration =>
        String(registration.eventId) === String(eventId)
    )
  }

  // ========================================
  // GET REGISTRATION BY EVENT ID
  // ========================================

  const getRegistrationByEventId = (eventId) => {
    return userRegistrations.value.find(
      registration =>
        String(registration.eventId) === String(eventId)
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

  const cancelRegistration = async (eventId) => {

    const id = String(eventId)

    const registrationIndex = userRegistrations.value.findIndex(
      registration =>
        String(registration.eventId) === id
    )

    if (registrationIndex === -1) return false

    let event = getEventById(id)

    if (!event) {
      event = await fetchEventById(id)
    }

    if (event && !event.done) {

      const updatedEvent = await updateEvent(id, {
        quota: Number(event.quota) + 1
      })

      if (!updatedEvent) return false
    }

    userRegistrations.value.splice(registrationIndex, 1)

    return true
  }

  // ========================================
  // CLEAR ALL EVENTS
  // ========================================

  const clearAllEvents = async () => {

    const ids = events.value.map(event => event.id)

    let success = true

    for (const id of ids) {
      const deleted = await deleteEvent(id)

      if (!deleted) {
        success = false
      }
    }

    return success
  }

  // ========================================
  // CLEAR ALL REGISTRATIONS
  // ========================================

  const clearAllRegistrations = async () => {

    const registrations = [...userRegistrations.value]

    for (const registration of registrations) {
      await cancelRegistration(registration.eventId)
    }
  }

  // ========================================
  // RETURN STATE & ACTIONS
  // ========================================

  return {
    events,
    loading,
    error,

    totalEvents,
    activeEvents,
    completedEvents,

    userRegistrations,
    totalRegistrations,

    fetchEvents,
    fetchEventById,

    createEvent,
    updateEvent,
    completeEvent,
    deleteEvent,
    getEventById,

    registerAttendee,
    cancelRegistration,
    isUserRegistered,
    getRegistrationByEventId,
    isEventDone,

    clearAllEvents,
    clearAllRegistrations
  }
}