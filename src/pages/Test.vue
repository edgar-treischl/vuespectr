<template>
  <v-container fluid>
    <v-row>
      <!-- Left column: Description + dropdowns -->
      <v-col cols="12" md="6" class="pa-4 selectors-col">
        <h4 class="mb-4">
          💦 About InSpectr
        </h4>

        <v-card outlined class="pa-4 mb-4">
          <p>
            Sp3ctr silently infiltrates the OddJob repository, extracts validation results, 
            and decodes them into sleek visual intel. Validation results and pointer data create 
            rich metadata for a complete audit trail.
          </p>
          <p>
            The table on the right shows the most recent validation runs. Pick a table name and version, 
            and InSpectr visualizes key insights.
          </p>
          <p>This app includes:</p>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Overview:</strong> Get a quick summary of your dataset’s structure.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Pipe:</strong> Visualizes each step of the validation pipeline.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Validation:</strong> Inspect the validation report.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Variables:</strong> Lists all variables (columns) across versions.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Classes:</strong> Highlights distribution of classes (levels) across dataset versions.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Labels:</strong> Shows categories included in the dataset.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Diff:</strong> Fetch the last change of the pipeline using Git diff.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <p class="text-muted">Monitoring data made simple with InSpectr.</p>
      </v-col>

      <!-- Right column: Table component -->
      <v-col cols="12" md="6" class="pa-4">
                <!-- Dropdowns -->
        <v-row class="mb-4">
          <v-col cols="6">
            <v-select
              v-model="store.table"
              :items="tableOptions"
              label="Data"
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="store.version"
              :items="versionOptions"
              label="Version"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        
        <PointerOverviewTable />
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import PointerOverviewTable from '../components/PointerOverviewTable.vue'

// Pinia store for reactive selection
const store = useAppStore()

// Dropdown options (hardcoded for now)
const tableOptions = ['TestTable', 'Users', 'Orders', 'Products']
const versionOptions = ['v1', 'v2', 'v3']

// Set default values if empty
if (!store.table) store.table = tableOptions[0]
if (!store.version) store.version = versionOptions[0]
</script>

<style scoped>
.selectors-col {
  border-right: 1px solid #e0e0e0;
}

.v-list-item-title {
  font-size: 0.95rem;
}
</style>
