<template>
  <!-- RAIL & PANE SYSTEM
  Kerangka khusus untuk kebutuhan produktivitas/pengelolaan aplikasi. -->
  <div class="dashboard-layout">

    <!-- RAIL: Navigasi samping yang posisinya terkunci (fixed) -->
    <aside class="dashboard-rail">
      <div class="rail-brand">
        <router-link to="/">Gatherly Organizer</router-link>
      </div>
      <nav class="rail-nav">
        <router-link to="/dashboard" class="rail-link active">Overview</router-link>
        <a href="#" class="rail-link">My Events</a>
        <a href="#" class="rail-link">Attendees</a>
        <a href="#" class="rail-link">QR Check-in</a>
      </nav>
      <div class="rail-footer">
        <router-link to="/" class="rail-link">&larr; Back to Public</router-link>
      </div>
    </aside>

    <!-- PANE: Area utama dinamis tempat konten berubah dan bisa digulir secara mandiri -->
    <main class="dashboard-pane">
      <header class="pane-header">
        <h1>Dashboard</h1>
        <div class="user-profile">Admin</div>
      </header>
      <div class="pane-content">
        <RouterView />
      </div>
    </main>

  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh; /* Mengunci agar web tidak bisa di-scroll secara global */
  overflow: hidden;
}

.dashboard-rail {
  width: 260px; /* Sidebar statis ditaruh tetap */
  display: flex;
  flex-direction: column;
}

.dashboard-pane {
  flex: 1;
  overflow-y: auto; /* Hanya jendela konten utama ini yang bisa digulir */
}
</style>