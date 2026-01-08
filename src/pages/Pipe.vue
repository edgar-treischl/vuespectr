<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height" justify="center">
      <v-col cols="10" class="d-flex">
        <SidebarLayout>
          <!-- Header -->
          <template #header>
            <h2>🔧 Pipeline Overview</h2>
          </template>

          <!-- Sidebar -->
          <template #sidebar>
            <div class="sidebar-content">
              <p>
                What did we validate, and how? This view illustrates the validation
                pipeline, showing which tests were applied to each column.
              </p>

              <ul>
                <li>Each point represents a validation step in the pipeline.</li>
                <li>See at a glance which variables were validated and how.</li>
              </ul>

              <p class="muted mt-3">
                Use this plot to identify gaps or inconsistencies in validation coverage.
              </p>
            </div>
          </template>

          <!-- Main -->
          <PlotPipe />
        </SidebarLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SidebarLayout from "../components/SidebarLayout.vue";
import PlotPipe from "@/components/PlotPipe.vue";
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
