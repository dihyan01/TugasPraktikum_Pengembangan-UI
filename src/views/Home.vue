<script setup>

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

          <router-link 
            to="/browse/events"
            class="btn-primary">
            Discover Events
          </router-link>

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


        <div class="feature-card">


          <div class="feature-icon">
            🔎
          </div>


          <h3>
            Discover Easily
          </h3>


          <p>
            Find events tailored to your interests.
          </p>


        </div>




        <div class="feature-card">


          <div class="feature-icon">
            🎟️
          </div>


          <h3>
            Seamless Ticketing
          </h3>


          <p>
            Register and get digital tickets instantly.
          </p>


        </div>




        <div class="feature-card">


          <div class="feature-icon">
            📊
          </div>


          <h3>
            Host Like a Pro
          </h3>


          <p>
            Manage attendees and events easily.
          </p>


        </div>


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


  background: #fdfdfd;


  border-radius: 20px;


  border: 1px solid #eeeeee;


}



.hero-content {

  max-width: 750px;

}



.badge {


  display: inline-block;


  padding: 8px 18px;


  background: #eeeaff;


  color: #6644ff;


  border-radius: 50px;


  margin-bottom: 20px;


  font-weight: 600;


}



.hero-title {


  font-size: 3rem;


  font-weight: 800;


  line-height: 1.2;


  color: #1c1948;


  margin-bottom: 20px;


}



.hero-subtitle {


  font-size: 1.1rem;


  color: #666;


  line-height: 1.6;


  margin-bottom: 25px;


}



.hero-action {

  display: flex;

  justify-content: center;

}



.btn-primary {


  display: inline-block;


  background: #6644ff;


  color: white;


  padding: 12px 28px;


  border-radius: 10px;


  text-decoration: none;


  font-weight: 600;


  transition: 0.3s;


}



.btn-primary:hover {


  background: #5533ee;


  transform: translateY(-3px);


}




/* ==========================
   FEATURES SECTION
   ADAPTIVE GRID
========================== */


.features-section {


  display: flex;

  flex-direction: column;


  gap: 20px;


}



.features-header {


  text-align: center;


}



.features-header h2 {


  color: #1c1948;

  margin-bottom: 8px;


}



.features-header p {


  color: #666;


}



.features-grid {


  display: grid;


  grid-template-columns:

  repeat(auto-fit, minmax(280px, 1fr));


  gap: 20px;


}



.feature-card {


  background: white;


  padding: 24px;


  border-radius: 16px;


  border: 1px solid #e4e4e7;


  text-align: center;


  transition: 0.3s;


}



.feature-card:hover {


  transform: translateY(-5px);


}



.feature-icon {


  font-size: 35px;


  margin-bottom: 15px;


}



.feature-card h3 {


  color: #1c1948;


  margin-bottom: 10px;


}



.feature-card p {


  color: #666;


  line-height: 1.5;


}


</style>