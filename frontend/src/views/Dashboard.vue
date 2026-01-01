<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <p>Welcome to Handball Team Management - Under 18s</p>
    
    <div class="stats-grid">
      <div class="card">
        <h3>Players</h3>
        <p class="stat-number">0</p>
      </div>
      
      <div class="card">
        <h3>Upcoming Games</h3>
        <p class="stat-number">0</p>
      </div>
      
      <div class="card">
        <h3>Training Sessions</h3>
        <p class="stat-number">0</p>
      </div>
      
      <div class="card">
        <h3>Attendance Rate</h3>
        <p class="stat-number">0%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard component - placeholder only
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b983;
  margin-top: 0.5rem;
}
</style>
