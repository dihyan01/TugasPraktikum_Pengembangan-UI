<script setup>
// Jika ada logika atau router yang dibutuhkan
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <span class="badge">Selamat Datang</span>
        <h1 class="hero-title">Temukan Event & Komunitas Terbaik</h1>
        <p class="hero-subtitle">
          Jelajahi berbagai kegiatan menarik, seminar, dan workshop interaktif yang dapat mengembangkan skill serta jaringan Anda.
        </p>
        <div class="hero-actions">
          <router-link to="/browse" class="btn btn-primary">Jelajahi Event</router-link>
          <router-link to="/contact" class="btn btn-secondary">Hubungi Kami</router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">🚀</div>
        <h3>Event Terbaru</h3>
        <p>Akses informasi event terkini dan terpopuler yang diperbarui setiap hari.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">👥</div>
        <h3>Komunitas Luas</h3>
        <p>Bergabung dengan ribuan peserta dan profesional di berbagai bidang.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3>Pendaftaran Mudah</h3>
        <p>Daftarkan diri Anda dalam beberapa langkah praktis tanpa ribet.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  animation: fadeIn 0.5s ease;
}

.hero {
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 5rem 2rem;
  background: #fdfdfd;
  border-radius: 24px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.hero-content {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(102, 68, 255, 0.08);
  color: #6644ff;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1c1948;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #6644ff;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 68, 255, 0.2);
}

.btn-primary:hover {
  background: #5533ee;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #1c1948;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  border-color: #6644ff;
  color: #6644ff;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-color: #e0e0e0;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #1c1948;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}
</style>