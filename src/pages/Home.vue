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

      <!-- Right column: filtered table -->
      <v-col cols="12" md="8" class="pa-4">
        <TableOverview
          :selectedTable="store.table"
          :selectedVersion="store.version"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import TableOverview from "../components/TableOverview.vue";

const store = useAppStore();

const tableOptions = ref([]);
const versionOptions = ref([]);

// Keep track of all pointers
let allPointers = [];

onMounted(async () => {
  // Fetch pointers JSON
  const res = await fetch("data/pointers.json");
  const json = await res.json();

  allPointers = json.pointers;

  // Get unique tables
  const tables = Array.from(new Set(allPointers.map(p => p.table).filter(Boolean)));
  tableOptions.value = tables;

  // Pick default table/version only if store is empty
  if (!store.table || !store.version) {
    const defaultTable = tables[0];
    const versionsForTable = allPointers
      .filter(p => p.table === defaultTable)
      .map(p => p.version)
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a)); // latest first

    store.table = defaultTable;
    store.version = versionsForTable[0];
  } else {
    // If store has a table, populate versionOptions for it
    updateVersionOptions(store.table);
  }
});

// Update version options whenever table changes
watch(() => store.table, (newTable) => {
  updateVersionOptions(newTable);
});

function updateVersionOptions(table) {
  versionOptions.value = allPointers
    .filter(p => p.table === table)
    .map(p => p.version)
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a)); // latest first

  // If current version not in options, pick latest
  if (!versionOptions.value.includes(store.version)) {
    store.version = versionOptions.value[0];
  }
}
</script>
