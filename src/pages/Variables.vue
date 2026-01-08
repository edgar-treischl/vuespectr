<template>
  <v-container fluid class="min-vh-100 pa-4">
  <v-row class="fill-height" justify="center">
    <v-col cols="10" class="d-flex">
      <SidebarLayout>
        <!-- Header -->
        <template #header>
          <h2>🎯 Variables</h2>
        </template>

        <!-- Sidebar -->
        <template #sidebar>
          <div class="sidebar-content">
            <p>
              Which variables are included in the data? This view helps compare column presence across different dataset versions.
            </p>

            <ul>
              <li>Each row represents a dataset version.</li>
              <li>Each column represents a variable.</li>
              <li>Green cells indicate presence; red indicate absence.</li>
            </ul>

            <p class="muted mt-3">
              Use the plot to detect schema drift or inconsistencies over time.
            </p>
          </div>
        </template>

        <!-- Main -->
        <PlotVariables />
      </SidebarLayout>
    </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import SidebarLayout from "../components/SidebarLayout.vue";
import PlotVariables from "@/components/PlotVariables.vue"
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
