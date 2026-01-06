<template>
  <v-container fluid>
    <v-row>
      <!-- Left column: dropdowns -->
      <v-col cols="12" md="4" class="pa-4">
        <h4>InSpectr</h4>
        <p>Pick a table and version:</p>

        <v-select
          v-model="store.table"
          :items="tableOptions"
          label="Table"
          dense
          outlined
          class="mb-4"
        ></v-select>

        <v-select
          v-model="store.version"
          :items="versionOptions"
          label="Version"
          dense
          outlined
        ></v-select>
      </v-col>

      <!-- Right column: table component -->
      <v-col cols="12" md="8" class="pa-4">
        <PointerOverviewTable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import PointerOverviewTable from '../components/PointerOverviewTable.vue'

// Pinia store
const store = useAppStore()

// Dropdown options
const tableOptions = ['TestTable', 'Users', 'Orders', 'Products']
const versionOptions = ['v1', 'v2', 'v3']

// Defaults
if (!store.table) store.table = tableOptions[0]
if (!store.version) store.version = versionOptions[0]
</script>

<style scoped>
/* Optional minimal styling */
h4 {
  margin-bottom: 1rem;
}
</style>
