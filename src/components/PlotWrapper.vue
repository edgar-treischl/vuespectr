<template>
  <div class="chart-wrapper">
    <slot />
  </div>
</template>

<script setup>
// Nothing needed here
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9; /* Adjust as needed, e.g., 4/3 */
  position: relative;
}
</style>
