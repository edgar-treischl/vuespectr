<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <PlotClasses />
  </v-container>
</template>

<script setup>
import PlotClasses from "@/components/PlotClasses.vue"
</script>

<style scoped>
/* Ensure the full height of the viewport is used */
.v-container {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden; /* Prevent unwanted scrolling issues */
}

.PlotClasses {
  max-width: 100%; /* Ensure it doesn’t overflow horizontally */
}
</style>