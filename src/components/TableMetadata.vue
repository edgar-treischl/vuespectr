<template>
  <section v-if="ready">
    <header class="table-header">
      <h2><strong>Data:</strong> {{ currentTable }}</h2>

      <p class="subtitle">
        📦 <strong>Build:</strong> {{ currentVersion }}<br />
        ✅ <strong>Validation:</strong> {{ pointer?.status || "-" }}
      </p>
    </header>

    <table class="meta-table" v-if="columns.length">
      <thead>
        <tr>
          <th>Column</th>
          <th>Label</th>
          <th>Type</th>
          <th>Levels</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="col in columns" :key="col.column_name">
          <td>{{ col.column_name }}</td>
          <td>{{ col.label }}</td>
          <td>{{ col.type }}</td>
          <td>{{ col.levels }}</td>
          <td>{{ col.description }}</td>
        </tr>
      </tbody>
    </table>

    <footer class="caption">
      🕵️ <strong>Agent:</strong> {{ pointer?.validated_by || "-" }}
    </footer>
  </section>

  <p v-else class="debug">
    Loading metadata…
    Pointers loaded: {{ tableVersions.length }}
    Columns loaded: {{ allColumns.length }}
    Selected version: {{ currentVersion }}
  </p>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

// reactive store values
const currentTable = computed(() => store.table);
const currentVersion = computed(() => store.version);

const allPointers = ref([]);
const allColumns = ref([]);
const ready = ref(false);

// pointers filtered for current table
const tablePointers = computed(() =>
  allPointers.value.filter(p => p.table === currentTable.value)
);

// available versions for current table
const tableVersions = computed(() =>
  tablePointers.value
    .map(p => p.version)
    .sort((a, b) => b.localeCompare(a)) // latest first
);

// current pointer
const pointer = computed(() =>
  tablePointers.value.find(p => p.version === currentVersion.value)
);

// columns for current table + version
const columns = computed(() =>
  allColumns.value.filter(
    c => c.table === currentTable.value && c.version === currentVersion.value
  )
);

// load JSON
onMounted(async () => {
  try {
    const pointerRes = await fetch("data/pointers.json");
    const pointerJson = await pointerRes.json();
    allPointers.value = pointerJson.pointers;

    const columnsRes = await fetch("data/columns.json");
    const columnsJson = await columnsRes.json();
    allColumns.value = columnsJson.columns;

    // pick latest version if store.version is empty
    if (!store.version && tableVersions.value.length) {
      store.version = tableVersions.value[0];
    }

    ready.value = true;
  } catch (err) {
    console.error(err);
  }
});

// watch for table change to update version automatically
watch(
  () => store.table,
  () => {
    if (!store.version && tableVersions.value.length) {
      store.version = tableVersions.value[0];
    }
  }
);
</script>

<style scoped>
.table-header h2 {
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}

.meta-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.meta-table th,
.meta-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.6rem;
  vertical-align: top;
}

.meta-table th {
  background: #f5f5f5;
  text-align: left;
}

.caption {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #444;
}

.debug {
  font-family: monospace;
  color: #888;
}
</style>
