<template>
  <div class="sidebar-layout">
    <div class="header d-flex justify-space-between align-center mb-3">
      <slot name="header">
        <!-- Optional default header -->
      </slot>

      <v-btn
        size="small"
        variant="outlined"
        color="primary"
        @click="showSidebar = !showSidebar"
      >
        {{ showSidebar ? 'Hide Info' : 'Show Info' }}
      </v-btn>
    </div>

    <div class="layout" :class="{ 'sidebar-hidden': !showSidebar }">
      <!-- Sidebar (optional) -->
      <aside v-if="showSidebar" class="info">
        <slot name="sidebar" />
      </aside>

      <!-- Main content (default slot) -->
      <main class="main-content">
        <slot>
          <div class="empty-state">
            No content provided
          </div>
        </slot>
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

.layout.sidebar-hidden {
  grid-template-columns: 1fr;
}

.info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.main-content {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  min-height: 400px;
  overflow: auto;
}

.empty-state {
  color: #999;
  text-align: center;
  padding: 2rem;
}
</style>
