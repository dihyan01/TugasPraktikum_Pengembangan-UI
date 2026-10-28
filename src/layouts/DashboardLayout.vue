
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="dashboard-layout">

    <!-- SIDEBAR -->
    <aside class="dashboard-rail">

      <!-- BRAND -->
      <div class="rail-brand">
        Gatherly Organizer
      </div>

      <!-- NAVIGATION -->
      <nav class="rail-nav">

        <router-link
          to="/dashboard"
          class="rail-link"
          :class="{ active: route.path === '/dashboard' }"
        >
          <span class="rail-label">Dashboard</span>
        </router-link>

        <router-link
          to="/dashboard/events"
          class="rail-link"
          :class="{ active: route.path.startsWith('/dashboard/events') }"
        >
          <span class="rail-label">Event Management</span>
        </router-link>

      </nav>

      <!-- SIDEBAR FOOTER -->
      <div class="rail-footer">
        <router-link to="/" class="back-link">
          ← Back to Public
        </router-link>
      </div>

    </aside>

    <!-- MAIN CONTENT -->
    <main class="dashboard-main">
      <div class="page-content">
        <router-view />
      </div>
    </main>

  </div>
</template>

<style scoped>

/* ==========================================
   DASHBOARD LAYOUT
========================================== */

.dashboard-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f8;
  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   SIDEBAR
========================================== */

.dashboard-rail {
  width: 240px;
  min-width: 240px;
  min-height: 100vh;

  background: #1c1948;
  color: #ffffff;

  display: flex;
  flex-direction: column;

  position: sticky;
  top: 0;
  height: 100vh;

  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

/* ==========================================
   BRAND / LOGO
========================================== */

.rail-brand {
  display: flex;
  align-items: center;

  min-height: 72px;
  padding: 0 20px;

  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;

  color: #ffffff;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* ==========================================
   NAVIGATION
========================================== */

.rail-nav {
  display: flex;
  flex-direction: column;

  padding: 12px 0;

  flex: 1;
}

.rail-link {
  width: 100%;
  min-height: 43px;

  display: flex;
  align-items: center;

  padding: 12px 20px;

  color: #c7c5df;
  text-decoration: none;

  font-size: 13px;
  font-weight: 500;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.rail-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

/* ACTIVE MENU */

.rail-link.active {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
  font-weight: 700;
}

.rail-label {
  display: block;
}

/* ==========================================
   SIDEBAR FOOTER
========================================== */

.rail-footer {
  margin-top: auto;

  padding: 18px 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-link {
  color: #a9a7c5;
  text-decoration: none;

  font-size: 12px;
  font-weight: 500;

  transition: color 0.2s ease;
}

.back-link:hover {
  color: #ffffff;
}

/* ==========================================
   MAIN CONTENT
========================================== */

.dashboard-main {
  flex: 1;
  min-width: 0;
  min-height: 100vh;

  background: #f5f5f8;

  display: flex;
  flex-direction: column;
}

.page-content {
  width: 100%;
  flex: 1;

  padding: 0;
  margin: 0;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 768px) {
  .dashboard-rail {
    width: 190px;
    min-width: 190px;
  }

  .rail-brand {
    padding: 0 14px;
    font-size: 13px;
  }

  .rail-link {
    padding: 12px 14px;
    font-size: 12px;
  }

  .rail-footer {
    padding: 16px 14px;
  }
}

@media (max-width: 480px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-rail {
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: auto;
    height: auto;
  }

  .rail-brand {
    min-height: 55px;
  }

  .rail-nav {
    flex-direction: row;
    padding: 0;
  }

  .rail-link {
    width: auto;
    flex: 1;
    justify-content: center;
    text-align: center;
  }

  .rail-footer {
    display: none;
  }

  .dashboard-main {
    min-height: calc(100vh - 100px);
  }
}

</style>