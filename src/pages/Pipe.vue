<template>
  <v-container class="min-vh-100 pa-4">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <SidebarLayout>
          <!-- Header slot -->
          <template #header>
            <h3>🔧 Pipeline Overview</h3>
          </template>

          <!-- Sidebar slot -->
          <template #sidebar>
            <div class="sidebar-content">
              <p>
                What did we validate, and how? The chart illustrates the validation pipeline, showing which 
                tests were applied to each column.
              </p>

              <ul>
                <li>Each point represents a validation step of the validation pipeline.</li>
                <li>You can see on one page which variables were validated and how.</li>
              </ul>

              <p class="muted mt-3">
                Use it to identify gaps or inconsistencies in validation coverage.
              </p>
            </div>
          </template>

          <!-- Main content -->
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
