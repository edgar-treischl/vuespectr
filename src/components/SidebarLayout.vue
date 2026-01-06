<template>
  <div class="sidebar-layout">
    <div class="header d-flex justify-space-between align-center mb-3">
      <slot name="header"></slot>

      <!-- Toggle button -->
      <v-btn
        small
        outlined
        color="primary"
        @click="showSidebar = !showSidebar"
      >
        {{ showSidebar ? 'Hide Info' : 'Show Info' }}
      </v-btn>
    </div>

    <div class="layout" :class="{ 'sidebar-hidden': !showSidebar }">
      <!-- Sidebar -->
      <aside v-if="showSidebar" class="info">
        <slot name="sidebar"></slot>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <slot name="main"></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showSidebar = ref(true);
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
  transition: all 0.3s ease;
}

/* Full width main content if sidebar hidden */
.layout.sidebar-hidden {
  grid-template-columns: 1fr;
}

.info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.main-content {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  min-height: 400px;
  overflow: auto;
}
</style>
