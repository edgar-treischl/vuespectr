<template>
  <v-container
    fluid
    class="min-vh-100 d-flex align-center justify-center hero-container"
  >
    <v-row justify="center" class="w-100">
      <v-col cols="12" md="9" lg="7" class="text-center">
        <!-- Icon / Brand -->
        <v-icon size="56" color="primary" class="mb-4">
          mdi-crosshairs
        </v-icon>

        <!-- Hero title -->
        <h2 class="mb-4">
          Spectre
        </h2>

        <!-- Narrative description -->
        <p class="hero-narrative mb-10">
          Spectre silently infiltrates the OddJob repository, extracting validation
          results and decoding them into sleek visual intel. Validation results and pointer
          data create a rich meta data for a complete audit trail.
        </p>

        <!-- Selector block -->
        <div class="selector-block mx-auto">
          <v-select
            v-model="store.table"
            :items="tableOptions"
            label="Select dataset"
            prepend-inner-icon="mdi-table"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            hide-details
          />

          <v-select
            v-model="store.version"
            :items="versionOptions"
            label="Select version"
            prepend-inner-icon="mdi-tag-outline"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>

        <!-- Optional hint -->
        <div class="mt-10 hero-hint">
          Validation insights will appear once a dataset is selected
        </div>
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
.hero-container {
  background:
    radial-gradient(
      circle at top,
      rgba(0, 0, 0, 0.04),
      transparent 60%
    );
}

/* Narrative text: cinematic but restrained */
.hero-narrative {
  max-width: 640px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
}

/* Selector focus */
.selector-block {
  max-width: 420px;
}

/* Hero title */
h2 {
  font-weight: 700;
  font-size: 2.5rem;
  letter-spacing: -0.02em;
}

/* Subtle hint */
.hero-hint {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0.02em;
}
</style>


