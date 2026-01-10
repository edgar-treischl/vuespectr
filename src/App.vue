<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue'
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>




<style>

body {
  font-family: 'Roboto', sans-serif;
}
/* Make app full height and flex column */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Make main content grow to fill available space */
.v-application--wrap {
  flex: 1 0 auto;
}
</style>