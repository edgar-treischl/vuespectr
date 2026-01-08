<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height">
      <!-- LEFT COLUMN: CONTEXT + CONTROLS -->
      <v-col cols="12" md="6" class="pa-4 selectors-col">
        <h2 class="mb-1">💦 InSpectr</h2>
        <p class="text-muted mb-6">
          Automated validation insights for evolving datasets
        </p>

        <!-- What it does -->
        <v-card variant="tonal" class="pa-4 mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-radar</v-icon>
            <h5 class="mb-0">What it does</h5>
          </div>
          <p class="mb-0">
            InSpectr analyzes validation outputs and pipeline metadata, transforming
            them into clear, visual diagnostics with a complete audit trail.
          </p>
        </v-card>

        <!-- How to use -->
        <v-card variant="tonal" class="pa-4 mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-cursor-default-click</v-icon>
            <h5 class="mb-0">How to use it</h5>
          </div>
          <p class="mb-0">
            Select a dataset and version below to explore schema changes,
            validation coverage, and detailed reports.
          </p>
        </v-card>

        <!-- Current context -->

        <!-- Dataset selection -->
        <v-card outlined class="pa-4">
          <div class="d-flex align-center mb-3">
            <v-icon color="tertiary" size="24" class="mr-2">
              mdi-database-search
            </v-icon>
            <h5 class="mb-0">Dataset selection</h5>
          </div>

          <p class="text-muted mb-4">
            Choose a dataset and version to explore validation results and
            data quality insights.
          </p>

          <v-row dense>
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
      </v-col>

      <!-- RIGHT COLUMN: VIEWS + RESULTS -->
      <v-col cols="12" md="6" class="pa-4">
        <!-- Available views -->
        <v-card outlined class="pa-4 mb-6">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">
              mdi-view-dashboard
            </v-icon>
            <h5 class="mb-0">Available views</h5>
          </div>

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

        <!-- Table -->
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


.selectors-col {
  border-right: 1px solid #e0e0e0;
}

h2 {
  font-weight: 700;
}

h5 {
  font-weight: 600;
}

p {
  line-height: 1.55;
}

.text-muted {
  color: #6c757d;
  font-size: 0.9rem;
}

.v-list-item-title {
  font-size: 0.95rem;
}


</style>
