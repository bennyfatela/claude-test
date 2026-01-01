<template>
  <div id="app">
    <header>
      <h1>Handball Team Management</h1>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/players">Players</router-link>
        <router-link to="/sessions">Training Sessions</router-link>
        <router-link to="/games">Games</router-link>
        <router-link to="/statistics">Statistics</router-link>
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App component - basic structure only
</script>

<style scoped>
header {
  padding: 1rem 2rem;
  background: #1a1a1a;
  color: white;
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #42b983;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

nav a:hover {
  background: rgba(66, 185, 131, 0.1);
}

nav a.router-link-active {
  background: rgba(66, 185, 131, 0.2);
}

main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
