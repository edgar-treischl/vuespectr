<script setup>
import Navbar from './components/Navbar.vue';
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
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
</style>
