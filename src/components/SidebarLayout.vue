<template>
  <div class="sidebar-layout">
    <!-- Header -->
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

    <!-- Content -->
    <div class="layout">
      <!-- Sidebar -->
      <aside v-if="showSidebar" class="info">
        <slot name="sidebar" />
      </aside>

      <!-- Main content -->
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
/* Root layout container */
.sidebar-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* Header */
.header {
  margin-bottom: 0.75rem;
}

/* Layout: sidebar + main content */
.layout {
  display: flex;
  flex: 1;                  /* grow to fill parent height */
  gap: 1rem;
  min-height: 0;            /* important for flex children to shrink */
}

/* Sidebar */
.info {
  flex: 0 0 320px;          /* fixed width */
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
  overflow: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* Main content */
.main-content {
  flex: 1;                  /* take remaining width */
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  min-height: 400px;
  overflow: auto;
}

/* Empty state */
.empty-state {
  color: #999;
  text-align: center;
  padding: 2rem;
}

/* Responsive: hide sidebar on small screens */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .info {
    display: none;
    flex: 0 0 auto;
  }
}
</style>
