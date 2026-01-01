<template>
  <div class="about-page-layout">
    <!-- Selector panel on the left -->
    <SelectorPanel />

    <!-- Main content -->
    <div class="about-page-content pa-4">
      <h2>About Page</h2>
      <p>
        Current selection from Pinia:
      </p>
      <p>Table: <strong>{{ store.table }}</strong></p>
      <p>Version: <strong>{{ store.version }}</strong></p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import SelectorPanel from '@/components/SelectorPanel.vue'

// Access Pinia store
const store = useAppStore()

// Optional: set default test values
store.table = 'TestTable'
store.version = 'v1'
</script>

<style scoped>
.about-page-layout {
  display: flex;
  height: 100vh; /* full viewport height */
}

.about-page-content {
  flex-grow: 1;
  overflow: auto;
}
</style>
