
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '@/composables/useEvents'

// ==========================================
// GATHERLY NAVBAR - MODUL 5
// ==========================================

const route = useRoute()

const { userRegistrations } = useEvents()

// ==========================================
// NAVBAR STATE
// ==========================================

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isBrowseOpen = ref(false)

// Jumlah tiket yang tersimpan
const ticketCount = computed(() => {
  return userRegistrations.value.length
})

// ==========================================
// NAVIGATION MENU
// ==========================================

const menus = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'About',
    path: '/about'
  },
  {
    name: 'Browse',
    path: '/browse/events',
    children: [
      {
        name: 'Event List',
        path: '/browse/events'
      },
      {
        name: 'Category',
        path: '/browse/category'
      }
    ]
  },
  {
    name: 'Your Events',
    path: '/browse/your-events'
  },
  {
    name: 'Contact',
    path: '/contact'
  }
]

// ==========================================
// ACTIVE MENU CHECK
// ==========================================

const isMenuActive = (menu) => {

  if (menu.name === 'Home') {
    return route.path === '/'
  }

  if (menu.name === 'Browse') {
    return (
      route.path === '/browse' ||
      route.path.startsWith('/browse/events') ||
      route.path.startsWith('/browse/category')
    )
  }

  if (menu.name === 'Your Events') {
    return route.path.startsWith('/browse/your-events')
  }

  return route.path === menu.path
}

// ==========================================
// SCROLL HANDLER
// ==========================================

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// ==========================================
// MOBILE MENU
// ==========================================

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isBrowseOpen.value = false
}

const toggleBrowseMenu = () => {
  isBrowseOpen.value = !isBrowseOpen.value
}

// Tutup menu setelah navigasi
const handleNavigation = () => {
  closeMobileMenu()
}

// ==========================================
// LIFECYCLE
// ==========================================

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="navbar"
    :class="{ scrolled: isScrolled }"
  >

    <div class="navbar-container">

      <!-- ==================================
           GATHERLY LOGO
      =================================== -->

      <router-link
        to="/"
        class="logo"
        @click="handleNavigation"
      >

        <svg
          width="28"
          height="32"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="logo-icon"
        >
          <path
            d="M12 0L22.3923 6V18L12 24L1.6077 18V6L12 0Z"
            fill="white"
          />

          <path
            d="M15 9.5 C15 9.5 14 8 12 8 C9.5 8 8 10 8 12.5 C8 15 9.5 17 12 17 C14 17 15 16 15.5 14.5 V 12.5 H 12.5"
            stroke="#1A1643"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="logo-text">
          Gatherly
        </span>

      </router-link>

      <!-- ==================================
           DESKTOP NAVIGATION
      =================================== -->

      <ul class="nav-menu">

        <li
          v-for="menu in menus"
          :key="menu.name"
          class="nav-item"
        >

          <router-link
            :to="menu.path"
            class="nav-link"
            :class="{ active: isMenuActive(menu) }"
          >

            {{ menu.name }}

            <!-- YOUR EVENTS COUNTER -->
            <span
              v-if="menu.name === 'Your Events' && ticketCount > 0"
              class="ticket-counter"
            >
              {{ ticketCount }}
            </span>

            <!-- DROPDOWN ICON -->
            <svg
              v-if="menu.children"
              class="dropdown-indicator"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

          </router-link>

          <!-- ==================================
               BROWSE DROPDOWN
          =================================== -->

          <ul
            v-if="menu.children"
            class="dropdown-menu"
          >

            <li
              v-for="child in menu.children"
              :key="child.name"
              class="dropdown-item"
            >

              <router-link
                :to="child.path"
                class="dropdown-link"
              >
                {{ child.name }}
              </router-link>

            </li>

          </ul>

        </li>

      </ul>

      <!-- ==================================
           RIGHT ACTIONS
      =================================== -->

      <div class="nav-right">

        <!-- LANGUAGE INDICATOR -->
        <div class="lang-selector">

          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z"
            />
          </svg>

          <span class="lang-text">EN</span>

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>

        </div>

        <!-- MOBILE HAMBURGER -->
        <button
          type="button"
          class="hamburger-btn"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >

          <svg
            v-if="!isMobileMenuOpen"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>

          <svg
            v-else
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>

        </button>

      </div>

    </div>

    <!-- ==================================
         MOBILE NAVIGATION PANEL
    =================================== -->

    <div
      v-if="isMobileMenuOpen"
      class="mobile-menu"
    >

      <template
        v-for="menu in menus"
        :key="menu.name"
      >

        <div
          v-if="menu.children"
          class="mobile-menu-group"
        >

          <button
            type="button"
            class="mobile-link"
            :class="{ active: isMenuActive(menu) }"
            @click="toggleBrowseMenu"
          >
            {{ menu.name }}

            <span>
              {{ isBrowseOpen ? '⌃' : '⌄' }}
            </span>
          </button>

          <div
            v-if="isBrowseOpen"
            class="mobile-submenu"
          >

            <router-link
              v-for="child in menu.children"
              :key="child.name"
              :to="child.path"
              class="mobile-submenu-link"
              @click="handleNavigation"
            >
              {{ child.name }}
            </router-link>

          </div>

        </div>

        <router-link
          v-else
          :to="menu.path"
          class="mobile-link"
          :class="{ active: isMenuActive(menu) }"
          @click="handleNavigation"
        >
          {{ menu.name }}

          <span
            v-if="menu.name === 'Your Events' && ticketCount > 0"
            class="ticket-counter"
          >
            {{ ticketCount }}
          </span>

        </router-link>

      </template>

    </div>

  </nav>
</template>

<style scoped>

/* ==========================================
   NAVBAR BASE
========================================== */

.navbar {
  width: 100%;
  background: #1c1948;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 999;
  font-family: Inter, Arial, sans-serif;
  transition: 0.3s ease;
}

.navbar.scrolled {
  background: rgba(28,25,72,0.96);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
}

.navbar-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 13px 28px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* ==========================================
   LOGO
========================================== */

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
  color: #ffffff;
}

.logo-icon {
  transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
  transform: rotate(12deg);
}

.logo-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

/* ==========================================
   DESKTOP NAVIGATION
========================================== */

.nav-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 13px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 13px 0;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  color: #ffffff;
  text-decoration: none;

  font-size: 12px;
  font-weight: 600;

  padding: 11px 15px;
  border-radius: 8px;

  white-space: nowrap;
  transition: 0.2s ease;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
}

.nav-link.active {
  color: #ffffff;
  background: #6644ff;
  box-shadow: 0 4px 15px rgba(102,68,255,0.3);
}

.nav-link.active:hover {
  background: #5533ee;
}

/* ==========================================
   YOUR EVENTS COUNTER
========================================== */

.ticket-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 19px;
  height: 19px;

  padding: 0 5px;
  border-radius: 20px;

  background: #ffffff;
  color: #6644ff;

  font-size: 10px;
  font-weight: 800;
}

/* ==========================================
   DROPDOWN ICON
========================================== */

.dropdown-indicator {
  transition: transform 0.2s ease;
}

.nav-item:hover .dropdown-indicator,
.nav-item:focus-within .dropdown-indicator {
  transform: rotate(180deg);
}

/* ==========================================
   BROWSE DROPDOWN
========================================== */

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;

  min-width: 185px;
  margin: 0;
  padding: 7px;

  list-style: none;

  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;

  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.nav-item:hover .dropdown-menu,
.nav-item:focus-within .dropdown-menu {
  display: block;
}

.dropdown-item {
  width: 100%;
}

.dropdown-link {
  display: block;
  padding: 11px 13px;
  border-radius: 7px;
  color: #1c1948;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: 0.2s ease;
}

.dropdown-link:hover,
.dropdown-link.router-link-active {
  background: #f0edff;
  color: #6644ff;
}

/* ==========================================
   RIGHT ACTIONS
========================================== */

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.lang-selector {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  color: #ffffff;

  font-size: 12px;
  font-weight: 700;

  padding: 8px;
  border-radius: 8px;
}

/* ==========================================
   HAMBURGER BUTTON
========================================== */

.hamburger-btn {
  display: none;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;

  color: #ffffff;
  cursor: pointer;
}

.hamburger-btn:hover {
  background: rgba(255,255,255,0.14);
}

/* ==========================================
   MOBILE NAVIGATION
========================================== */

.mobile-menu {
  display: none;
  flex-direction: column;

  padding: 10px 16px 18px;

  background: #1c1948;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.mobile-link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 13px 15px;

  background: transparent;
  border: none;
  border-radius: 8px;

  color: #ffffff;
  text-decoration: none;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.mobile-link:hover {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}

.mobile-link.active {
  background: #6644ff;
  color: #ffffff;
}

.mobile-submenu {
  display: flex;
  flex-direction: column;
  padding: 5px 0 8px 15px;
}

.mobile-submenu-link {
  padding: 11px 15px;
  color: #d5d1f1;
  text-decoration: none;
  font-size: 12px;
  border-radius: 7px;
}

.mobile-submenu-link:hover {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 1100px) {

  .nav-menu {
    gap: 3px;
  }

  .nav-link {
    padding: 10px 11px;
    font-size: 11px;
  }

  .navbar-container {
    padding: 12px 20px;
  }

}

@media (max-width: 800px) {

  .nav-menu {
    display: none;
  }

  .hamburger-btn {
    display: inline-flex;
  }

  .mobile-menu {
    display: flex;
  }

  .navbar-container {
    min-height: 65px;
  }

}

@media (max-width: 480px) {

  .navbar-container {
    padding: 11px 15px;
  }

  .logo-text {
    font-size: 15px;
  }

  .lang-selector {
    font-size: 11px;
    gap: 5px;
  }

}
</style>