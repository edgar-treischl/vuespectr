<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height" justify="center">
      <v-col cols="10" class="d-flex">
        <SidebarLayout>
          <!-- Header -->
          <template #header>
            <h2>🏷️ Labels</h2>
          </template>

          <!-- Sidebar -->
          <template #sidebar>
            <div class="sidebar-content">
              <p>
                This view shows the labels or category identifiers present in the dataset.
              </p>

              <ul>
                <li>Each label represents a class or group associated with your data.</li>
                <li>Useful for supervised tasks such as classification or evaluation.</li>
              </ul>

              <p class="muted mt-3">
                Check for consistency in labels across dataset versions.
              </p>
            </div>
          </template>

          <!-- Main -->
          <PlotLabels />
        </SidebarLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SidebarLayout from "../components/SidebarLayout.vue";
import PlotLabels from "@/components/PlotLabels.vue";
</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.muted {
  color: #6c757d;
}

.mt-3 {
  margin-top: 1rem;
}
</style>
