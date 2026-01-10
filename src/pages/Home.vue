<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height">
      <!-- LEFT COLUMN: CONTEXT + GUIDE -->
      <v-col cols="12" md="6" class="pa-6 selectors-col">
        <!-- About -->
        <h2 class="mb-3">🔫 About the app</h2>
        <p class="text-muted mb-6">
          Spectre silently infiltrates the OddJob repository, extracting validation
          results and decoding them into sleek visual intel. Validation results and pointer
          data create a rich meta data for a complete audit trail.
        </p>

        <!-- What it does -->
        <v-card class="pa-4 mb-6">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">mdi-radar</v-icon>
            <h5 class="mb-0">What it does</h5>
          </div>

          <p class="mb-4">
            The table on the right side gives an overview of the most recent
            validation runs. Pick a table name (and version) and SpectreApp visualizes key insights.
          </p>

          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>
                <strong>Overview</strong> — dataset structure at a glance
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Pipe</strong> — validation pipeline steps
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Validation</strong> — detailed validation reports
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Variables</strong> — columns across versions
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Classes</strong> — categorical level changes
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Labels</strong> — dataset categories
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <strong>Diff</strong> — pipeline changes via Git
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN: ACTIONS + RESULTS -->
      <v-col cols="12" md="6" class="pa-6">
        <!-- Dataset selection -->
        <v-card class="pa-5 mb-6 mt-12" elevation="2">
          <div class="d-flex align-center mb-3">
            <v-icon color="tertiary" size="22" class="mr-2">
              mdi-database-search
            </v-icon>
            <h3 class="mb-2">Dataset selection</h3>
          </div>

          <p class="text-muted mb-4">
            Choose a dataset and version to explore validation results and
            data quality insights.
          </p>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="store.table"
                :items="tableOptions"
                label="Table"
                prepend-inner-icon="mdi-table"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="store.version"
                :items="versionOptions"
                label="Version"
                prepend-inner-icon="mdi-tag-outline"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- Results -->
        <v-card class="pa-4" elevation="1">
          <div class="table-section">
              <TableOverview
                :selectedTable="store.table"
                :selectedVersion="store.version"
                />
              </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>





<script setup>
import { ref, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import TableOverview from "@/components/TableOverview.vue";

const store = useAppStore();

const tableOptions = ref([]);
const versionOptions = ref([]);
let allPointers = [];

onMounted(async () => {
  const res = await fetch("data/pointers.json");
  const json = await res.json();
  allPointers = json.pointers;

  tableOptions.value = Array.from(
    new Set(allPointers.map(p => p.table).filter(Boolean))
  );

  if (!store.table || !store.version) {
    const defaultTable = tableOptions.value[0];
    updateVersionOptions(defaultTable);
    store.table = defaultTable;
    store.version = versionOptions.value[0];
  } else {
    updateVersionOptions(store.table);
  }
});

watch(() => store.table, (newTable) => {
  if (newTable) updateVersionOptions(newTable);
});

function updateVersionOptions(table) {
  versionOptions.value = allPointers
    .filter(p => p.table === table)
    .map(p => p.version)
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

  if (!versionOptions.value.includes(store.version)) {
    store.version = versionOptions.value[0];
  }
}
</script>

<style scoped>
/* ---------- Layout & structure ---------- */

.selectors-col {
  border-right: 1px solid #e6e6e6;
  background: linear-gradient(
    180deg,
    rgba(250, 250, 250, 0.85),
    rgba(255, 255, 255, 1)
  );
}

/* ---------- Typography ---------- */

h2 {
  font-weight: 700;
  font-size: 2.05rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

h5 {
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

p {
  line-height: 1.4;              /* improved readability */
  font-size: 1.05rem;            /* slightly toned down */
  color: #2c2c2c;
}

/* Muted helper text */
.text-muted {
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.35;
}

/* ---------- Lists ---------- */

.v-list-item {
  padding-left: 0;
  padding-right: 0;
}

.v-list-item-title {
  font-size: 0.95rem;
  line-height: 1.35;
}

/* ---------- Cards ---------- */

.v-card {
  border-radius: 10px;
}

.v-card.pa-4 {
  padding: 1.25rem !important;
}

/* ---------- Icons ---------- */

.v-icon {
  opacity: 0.85;
}

/* ---------- Subtle polish ---------- */

/* Improve visual rhythm between sections */
.mb-6 {
  margin-bottom: 1.75rem !important;
}

/* Make outlines softer */
.v-card--variant-outlined {
  border-color: #e3e3e3;
}

@media (min-width: 960px) {
  .selectors-col {
    position: sticky;
    top: 0;
    height: 100vh;
  }
}

.v-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.table-section {
  margin-top: 3.5rem;
  margin-bottom: 3rem;
}


</style>
