<template>
  <v-container fluid class="min-vh-100 hero-container">
    <!-- Radar Layer -->
    <div class="hero-radar">
      <!-- Radar rings -->
      <div class="radar-ring ring1"></div>
      <div class="radar-ring ring2"></div>
      <div class="radar-ring ring3"></div>

      <!-- Crosshair lines -->
      <div class="crosshair vertical"></div>
      <div class="crosshair horizontal"></div>

      <!-- Rotating sweep -->
      <div class="radar-sweep"></div>

      <!-- Icon and Hero Title inside radar -->
      <div class="radar-title">
        <v-icon size="54" color="tertiary" class="mb-0">
          mdi-crosshairs
        </v-icon>
        <h2 class="mb-0">Sp3ctr</h2>
        <!-- Subtle hint -->
        <div class="mt-0 hero-hint" style="display: inline-block; transform: translateX(-6px);">
          Monitoring data made simple.
        </div>
      </div>
    </div>

    <!-- Content Layer below radar -->
    <v-row justify="center" class="w-100 hero-content">
      <v-col cols="12" md="10" lg="10" class="text-center">
        <!-- Narrative description -->
        <p class="hero-narrative mb-12">
          Spectr silently infiltrates the OddJob repository, extracting validation
          results and decoding them into sleek visual intel. Select the data and inspect the results.
        </p>

        <!-- Selector + Table side by side -->
        <v-row dense class="selector-table-row" align="stretch">
          <!-- Selector Box -->
          <v-col cols="12" md="4">
            <v-card outlined class="pa-4">
              <h2 class="mb-4">🎩 Select Data</h2>
              <v-select
                v-model="store.table"
                :items="tableOptions"
                label="Data"
                prepend-inner-icon="mdi-table"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                hide-details
              />
              <v-select
                v-model="store.version"
                :items="versionOptions"
                label="Optional: Version"
                prepend-inner-icon="mdi-tag-outline"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-card>
          </v-col>

          <!-- Table Box -->
          <v-col cols="12" md="8">
            <v-card outlined class="pa-4">
              <TableOverview
                :selectedTable="store.table"
                :selectedVersion="store.version"
              />
            </v-card>
          </v-col>
        </v-row>
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(0,0,0,0.02), transparent 65%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Radar Layer */
.hero-radar {
  position: relative;
  width: 100%;
  height: 450px; /* height of radar area */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px; /* space between radar and content */
  z-index: 1;
}

/* Radar rings */
.radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(1px);
}
.ring1 { width: 150px; height: 150px; }
.ring2 { width: 300px; height: 300px; }
.ring3 { width: 450px; height: 450px; }

/* Crosshairs */
/* Radar rings — more visible */
.radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.15); /* stronger than before */
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(1.2px); /* subtle glow */
}

/* Crosshairs — more visible */
.crosshair {
  position: absolute;
  background: rgba(0, 0, 0, 0.2); /* darker */
  z-index: 1;
  box-shadow: 0 0 6px rgba(0,0,0,0.2); /* subtle glow */
}

.crosshair.vertical {
  width: 2px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair.horizontal {
  width: 200px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Rotating radar sweep — more visible */
.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: conic-gradient(rgba(0, 0, 0, 0.06) 0deg, transparent 40deg); /* stronger */
  transform: translate(-50%, -50%);
  animation: sweep 18s linear infinite;
  z-index: 1;
  filter: blur(1.2px); /* subtle glow */
}


/* Hero title inside radar */
.radar-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}

.radar-title h2 {
  margin: 0;
  font-weight: 700;
  font-size: 2.5rem;
  color: rgba(0,0,0,0.85);
}

/* Content Layer below radar */
.hero-content {
  position: relative;
  z-index: 2;
  padding-bottom: 60px;
}

/* Narrative text */
.hero-narrative {
  max-width: 640px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.75);
}

/* Selector block */
.selector-block {
  max-width: 420px;
  margin: 0 auto;
}

/* Hint */
.hero-hint {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0.02em;
}

/* Sweep animation */
@keyframes sweep {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}


.table-header h2 {
  margin-bottom: 0.75rem;
}

.overview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.overview-table th,
.overview-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.6rem;
  text-align: left;
}

.overview-table th {
  background: #f5f5f5;
}

.overview-table a {
  color: #1a73e8;
  text-decoration: none;
}

.overview-table a:hover {
  text-decoration: underline;
}

.selector-table-row .v-card {
  height: 100%;
}


</style>
