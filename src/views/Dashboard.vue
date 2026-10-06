<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('Overview')

const menuItems = [
  'Overview',
  'My Events',
  'Attendees',
  'QR Check-in'
]

const handleMenuClick = (menu) => {
  activeMenu.value = menu
}

const goBackToPublic = () => {
  router.push('/browse/events')
}
</script>

<template>
  <div class="dashboard-page">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h3>Gatherly Organizer</h3>

      <nav>
        <div
          v-for="item in menuItems"
          :key="item"
          class="menu"
          :class="{ active: activeMenu === item }"
          @click="handleMenuClick(item)"
        >
          {{ item }}
        </div>
      </nav>

      <div class="back-button" @click="goBackToPublic">
        ← Back to Public
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="dashboard-content">
      <!-- HEADER -->
      <div class="dashboard-header">
        <h2>Dashboard</h2>
        <span class="user-role">Admin</span>
      </div>

      <h2 class="welcome">Welcome back, Organizer</h2>

      <!-- STATISTIC CARDS -->
      <section class="stats-grid">
        <div class="stat-card">
          <p>Total Tickets Sold</p>
          <h1>1,245</h1>
        </div>

        <div class="stat-card">
          <p>Page Views</p>
          <h1>8,302</h1>
        </div>

        <div class="stat-card">
          <p>Revenue</p>
          <h1>$12,450</h1>
        </div>
      </section>

      <!-- REGISTRATION TABLE -->
      <section class="registration-card">
        <h3>Recent Registrations</h3>

        <table>
          <thead>
            <tr>
              <th>Attendee Name</th>
              <th>Event</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i">
              <td>John Doe {{ i }}</td>
              <td>Community Gathering {{ i }}</td>
              <td>Oct 1{{ i }}, 2026</td>
              <td>
                <span class="status">Confirmed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* MAIN LAYOUT */
.dashboard-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background-color: #211b54;
  color: #ffffff;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 32px 0;
  letter-spacing: -0.3px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu {
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #b0b0cb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
}

.menu.active {
  background-color: #342b72;
  border-left: 4px solid #6644ff;
  color: #ffffff;
  font-weight: 600;
  border-radius: 0 6px 6px 0;
}

.back-button {
  margin-top: auto;
  font-size: 13.5px;
  font-weight: 500;
  color: #a0a0ba;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #ffffff;
}

/* DASHBOARD CONTENT */
.dashboard-content {
  flex: 1;
  padding: 32px 40px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.dashboard-header h2 {
  color: #1c1948;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.user-role {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: #e2e8f0;
  padding: 4px 12px;
  border-radius: 12px;
}

.welcome {
  margin: 28px 0 20px 0;
  color: #1c1948;
  font-size: 20px;
  font-weight: 700;
}

/* STAT CARDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.stat-card p {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.stat-card h1 {
  color: #6644ff;
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  line-height: 1;
}

/* TABLE */
.registration-card {
  margin-top: 28px;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.registration-card h3 {
  margin: 0 0 20px 0;
  color: #1c1948;
  font-size: 18px;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

td {
  font-size: 14px;
  color: #334155;
}

tbody tr:hover {
  background-color: #f8fafc;
}

.status {
  background: #dcfce7;
  color: #16a34a;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .dashboard-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    box-sizing: border-box;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-content {
    padding: 20px;
  }
}
</style>