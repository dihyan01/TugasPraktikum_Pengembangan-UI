
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/App.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      // =====================================
      // HOME
      // =====================================
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { breadcrumb: 'Home' }
      },

      // =====================================
      // ABOUT
      // =====================================
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/About.vue'),
        meta: { breadcrumb: 'About' }
      },

      // =====================================
      // BROWSE EVENTS
      // =====================================
      {
        path: 'browse',
        name: 'browse',
        component: () => import('@/views/Browse.vue'),
        meta: { breadcrumb: 'Browse' },
        redirect: '/browse/events',

        children: [
          // EVENT LIST
          {
            path: 'events',
            name: 'events',
            component: () => import('@/views/EventList.vue'),
            meta: { breadcrumb: 'Event List' }
          },

          // EVENT DETAIL
          {
            path: 'events/:id',
            name: 'event-detail',
            component: () => import('@/views/EventDetail.vue'),
            meta: { breadcrumb: 'Event Detail' }
          },

          // =================================
          // MODUL 5 - EVENT REGISTRATION
          // =================================
          {
            path: 'events/:id/register',
            name: 'event-registration',
            component: () =>
              import('@/views/EventRegistration.vue'),
            meta: {
              breadcrumb: 'Event Registration'
            }
          },

          // =================================
          // MODUL 5 - YOUR EVENTS
          // =================================
          {
            path: 'your-events',
            name: 'your-events',
            component: () =>
              import('@/views/YourEvents.vue'),
            meta: {
              breadcrumb: 'Your Events'
            }
          },

          // =================================
          // MODUL 5 - TICKET RECEIPT
          // =================================
          {
            path: 'your-events/:id',
            name: 'ticket-receipt',
            component: () =>
              import('@/views/TicketReceipt.vue'),
            meta: {
              breadcrumb: 'Ticket Receipt'
            }
          },

          // CATEGORY
          {
            path: 'category',
            name: 'category',
            component: () => import('@/views/Category.vue'),
            meta: { breadcrumb: 'Category' }
          }
        ]
      },

      // =====================================
      // CONTACT
      // =====================================
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: { breadcrumb: 'Contact' }
      }
    ]
  },

  // ========================================
  // AREA PENYELENGGARA ACARA (DASHBOARD)
  // MODUL 4 - TETAP DIPERTAHANKAN
  // ========================================
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard-overview',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'events',
        name: 'dashboard-events',
        component: () => import('@/views/EventManagement.vue')
      }
    ]
  },

  // ========================================
  // FALLBACK ROUTE
  // ========================================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// ==========================================
// VUE ROUTER CONFIGURATION
// ==========================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  // MODUL 5 - SCROLL BEHAVIOR
  // Kembali ke atas saat membuka halaman baru

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  }
})

export default router