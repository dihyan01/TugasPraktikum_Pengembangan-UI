import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/App.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      // =====================
      // HOME
      // =====================
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          breadcrumb: 'Home'
        }
      },

      // =====================
      // ABOUT
      // =====================
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/About.vue'),
        meta: {
          breadcrumb: 'About'
        }
      },

      // =====================
      // BROWSE
      // =====================
      {
        path: 'browse',
        name: 'browse',
        component: () => import('@/views/Browse.vue'),
        redirect: '/browse/events',
        meta: {
          breadcrumb: 'Browse'
        },
        children: [
          {
            path: 'events',
            name: 'events',
            component: () => import('@/views/EventList.vue'),
            meta: {
              breadcrumb: 'Event List'
            }
          },
          {
            path: 'events/:id',
            name: 'event-detail',
            component: () => import('@/views/EventDetail.vue'),
            meta: {
              breadcrumb: 'Event Detail'
            }
          },
          {
            path: 'category',
            name: 'category',
            component: () => import('@/views/Category.vue'),
            meta: {
              breadcrumb: 'Category'
            }
          }
        ]
      },

      // =====================
      // CONTACT
      // =====================
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: {
          breadcrumb: 'Contact'
        }
      },

      // =====================
      // DASHBOARD ORGANIZER
      // =====================
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          breadcrumb: 'Dashboard'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router