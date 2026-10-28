
<script setup>
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'

const router = useRouter()

const {
  events,
  totalEvents,
  activeEvents,
  completedEvents
} = useEvents()

const goToEvents = () => {
  router.push('/dashboard/events')
}
</script>

<template>
  <div class="dashboard-overview">

    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1>Organizer Analytics & Overview</h1>
        <p>
          Monitor real-time statistics and track status
          across all managed events.
        </p>
      </div>

      <button class="manage-btn" @click="goToEvents">
        🗂️ Manage Events →
      </button>
    </div>

    <!-- STATISTICS -->
    <div class="metrics-grid">

      <div class="metric-card">
        <span class="metric-label">TOTAL EVENTS</span>
        <h2 class="metric-value total">
          {{ totalEvents }}
        </h2>
        <p>All recorded events</p>
      </div>

      <div class="metric-card">
        <span class="metric-label">ACTIVE EVENTS</span>
        <h2 class="metric-value active">
          {{ activeEvents.length }}
        </h2>
        <p>Live in public catalog</p>
      </div>

      <div class="metric-card">
        <span class="metric-label">COMPLETED EVENTS</span>
        <h2 class="metric-value completed">
          {{ completedEvents.length }}
        </h2>
        <p>Archived completed events</p>
      </div>

    </div>

    <!-- RECENT EVENTS -->
    <section class="events-panel">

      <div class="events-panel-header">
        <div>
          <h2>Recent Events Status Overview</h2>
          <p>
            Master registry of all events managed
            across the Gatherly platform.
          </p>
        </div>

        <button class="events-link" @click="goToEvents">
          Open Event Management →
        </button>
      </div>

      <div class="table-wrapper">
        <table class="events-table">
          <thead>
            <tr>
              <th>EVENT TITLE</th>
              <th>CATEGORY</th>
              <th>DATE & LOCATION</th>
              <th>QUOTA</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            <!-- EMPTY STATE -->
            <tr v-if="events.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <div class="empty-icon">📊</div>
                  <p>No events recorded in the system yet.</p>
                  <button
                    class="create-btn"
                    @click="goToEvents"
                  >
                    Create First Event
                  </button>
                </div>
              </td>
            </tr>

            <!-- DATA EVENTS -->
            <tr
              v-for="item in events"
              :key="item.id"
              v-else
            >
              <td class="event-name">{{ item.title }}</td>
              <td>
                <span class="category-badge">
                  {{ item.cat }}
                </span>
              </td>
              <td>
                {{ item.date }} <br />
                <small>📍 {{ item.loc }}</small>
              </td>
              <td>{{ item.quota }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    item.done ? 'status-completed' : 'status-active'
                  ]"
                >
                  {{ item.done ? 'Completed' : 'Active' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  </div>
</template>

<style scoped>
.dashboard-overview {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  font-family: Inter, Arial, sans-serif;
  color: #191743;
  box-sizing: border-box;
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.dashboard-header h1 {
  font-size: 25px;
  font-weight: 800;
  margin: 0 0 10px;
  color: #191743;
  line-height: 1.3;
}

.dashboard-header p {
  color: #777789;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
}

/* BUTTONS */
.manage-btn,
.create-btn {
  background: #6546ff;
  color: white;
  border: none;
  border-radius: 9px;
  padding: 12px 22px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(101, 70, 255, 0.25);
  transition: 0.2s ease;
}

.manage-btn:hover,
.create-btn:hover {
  background: #5435ed;
  transform: translateY(-2px);
}

/* METRIC CARDS */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.metric-card {
  min-height: 150px;
  background: #ffffff;
  border: 1px solid #e5e5ed;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.035);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.metric-label {
  color: #676777;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.metric-value {
  margin: 15px 0 3px;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.metric-value.total {
  color: #6546ff;
}

.metric-value.active {
  color: #22c55e;
}

.metric-value.completed {
  color: #9399a5;
}

.metric-card p {
  color: #858592;
  font-size: 12px;
  margin: 0;
}

/* EVENTS PANEL */
.events-panel {
  background: white;
  padding: 22px;
  border: 1px solid #e8e8ef;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(25, 23, 67, 0.035);
}

.events-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 22px;
}

.events-panel-header h2 {
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 9px;
  color: #191743;
}

.events-panel-header p {
  color: #858592;
  font-size: 12px;
  margin: 0;
  line-height: 1.5;
}

.events-link {
  background: transparent;
  border: none;
  color: #6546ff;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
}

/* TABLE */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.events-table th {
  background: #fafafd;
  color: #71717f;
  font-size: 10px;
  font-weight: 700;
  padding: 15px 12px;
  border-bottom: 1px solid #eaeaf0;
}

.events-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #eeeeF3;
  font-size: 12px;
  color: #454558;
}

.event-name {
  font-weight: 700;
}

.events-table small {
  color: #9292a0;
  font-size: 11px;
}

/* EMPTY STATE */
.empty-state {
  min-height: 145px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 20px;
}

.empty-icon {
  font-size: 31px;
}

.empty-state p {
  margin: 0;
  color: #858592;
  font-size: 12px;
}

.create-btn {
  padding: 11px 20px;
  font-size: 12px;
}

/* BADGES */
.category-badge {
  background: #f0edff;
  color: #6546ff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-active {
  color: #16a34a;
  background: #dcfce7;
}

.status-completed {
  color: #64748b;
  background: #f1f5f9;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .dashboard-overview {
    padding: 24px 16px;
  }

  .metrics-grid {
    gap: 12px;
  }
}

@media (max-width: 650px) {
  .dashboard-header,
  .events-panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header h1 {
    font-size: 21px;
  }

  .manage-btn {
    width: 100%;
  }

  .events-table {
    min-width: 650px;
  }
}
</style>