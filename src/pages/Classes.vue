<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height" justify="center">
      <v-col cols="10" class="d-flex">
        <SidebarLayout>
          <!-- Header -->
          <template #header>
            <h2>🏫 Classes</h2>
          </template>

          <!-- Sidebar -->
          <template #sidebar>
            <div class="sidebar-content">
              <p>
                This view shows the distribution of classes (levels) across dataset
                versions.
              </p>

              <ul>
                <li>Each section represents one categorical variable.</li>
                <li>Track whether levels have changed, disappeared, or appeared.</li>
              </ul>

              <p class="muted mt-3">
                Look for unexpected class changes and inconsistent encoding.
              </p>
            </div>
          </template>

          <!-- Main -->
          <PlotClasses />
        </SidebarLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SidebarLayout from "../components/SidebarLayout.vue";
import PlotClasses from "@/components/PlotClasses.vue";
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
