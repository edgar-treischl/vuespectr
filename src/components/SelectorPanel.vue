<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    :mini-variant.sync="mini"
    app
    width="250"
    mini-variant-width="50"
    permanent
    class="selector-drawer"
    hide-overlay
  >
    <!-- Header + toggle button -->
    <div class="d-flex align-center justify-space-between px-3 py-2">
      <h3 class="text-h6 m-0" v-if="!mini">Selection</h3>
      <v-btn icon @click="toggleMini">
        <v-icon>{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </v-btn>
    </div>

    <!-- Selectors (only visible when expanded) -->
    <v-divider v-if="!mini" class="my-2" />

    <v-select
      v-if="!mini"
      v-model="store.table"
      :items="tables"
      label="Table"
      dense
      hide-details
      outlined
      class="mb-3"
    />

    <v-select
      v-if="!mini"
      v-model="store.version"
      :items="versions"
      label="Version"
      dense
      hide-details
      outlined
    />
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

// Drawer is always open
const drawerOpen = ref(true)

// Mini state controls collapse
const mini = ref(false)

function toggleMini() {
  mini.value = !mini.value
}

// Example data
const tables = ['Sales', 'Finance', 'Operations']
const versions = ['v1', 'v2', 'v3']
</script>

<style scoped>
.selector-drawer {
  background-color: white;
  border-right: 1px solid rgba(0,0,0,0.1);
}

.selector-drawer .v-navigation-drawer__content {
  transition: width 0.2s;
}
</style>
