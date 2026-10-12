<script setup>
import AppButton from '@/components/ui/AppButton.vue';
import AppCard from '@/components/ui/AppCard.vue';
</script>

<template>
  <div class="home-page">
    <!-- HERO SECTION : THE FOLD + Z-PATTERN -->
    <section class="hero-section">
      <div class="hero-content">
        <span class="badge">
          Welcome to Gatherly
        </span>

        <h1 class="hero-title">
          Connect, Discover, and Experience
        </h1>

        <p class="hero-subtitle">
          A community event platform designed to bring ideas together. 
          Discover hundreds of events near you.
        </p>

        <div class="hero-action">
          <AppButton variant="primary" @click="$router.push('/browse/events')">
            Discover Events
          </AppButton>
        </div>
      </div>
    </section>

    <!-- FEATURES SECTION : ADAPTIVE GRID -->
    <section class="features-section">
      <div class="features-header">
        <h2>
          Why Choose Gatherly?
        </h2>
        <p>
          Everything you need to host or attend unforgettable events.
        </p>
      </div>

      <div class="features-grid">
        <AppCard class="feature-card">
          <div class="feature-icon">
            🔎
          </div>
          <h3>
            Discover Easily
          </h3>
          <p>
            Find events tailored to your interests using our smart category and location filters.
          </p>
        </AppCard>

        <AppCard class="feature-card">
          <div class="feature-icon">
            🎟️
          </div>
          <h3>
            Seamless Ticketing
          </h3>
          <p>
            Register with one click and get your digital QR ticket instantly on your device.
          </p>
        </AppCard>

        <AppCard class="feature-card">
          <div class="feature-icon">
            📊
          </div>
          <h3>
            Host Like a Pro
          </h3>
          <p>
            Manage attendees, track revenue, and scan QR codes with our comprehensive dashboard.
          </p>
        </AppCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ==========================
   GLOBAL HOME LAYOUT
========================== */
.home-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ==========================
   HERO SECTION
   THE FOLD
========================== */
.hero-section {
  min-height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  background: var(--bg-light);
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.hero-content {
  max-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 8px 18px;
  background: #eeeaff;
  color: var(--primary);
  border-radius: 50px;
  margin-bottom: 20px;
  font-weight: 600;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-main);
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 25px;
}

.hero-action {
  display: flex;
  justify-content: center;
}

/* ==========================
   FEATURES SECTION
   ADAPTIVE GRID
========================== */
.features-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 var(--space-12) 0;
}

.features-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.features-header h2 {
  color: var(--text-main);
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.features-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: var(--space-8);
  text-align: center;
}

.feature-icon {
  font-size: 35px;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: var(--text-main);
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-card p {
  color: var(--text-muted);
  line-height: 1.5;
}
</style>