<template>
  <section v-if="ready">
    <header class="table-header">
      <h2><strong>Data:</strong> {{ pointer.table }}</h2>

      <p class="subtitle">
        📦 <strong>Build:</strong>
        <select v-model="selectedVersion">
          <option v-for="p in penguinPointers" :key="p.version" :value="p.version">
            {{ p.version }}
          </option>
        </select>
        <br />
        ✅ <strong>Validation:</strong> {{ pointer.status }}
      </p>
    </header>

    <table class="meta-table">
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
      🕵️ <strong>Agent:</strong> {{ pointer.validated_by }}
    </footer>
  </section>

  <pre v-else class="debug">
Loading metadata…
Pointers loaded: {{ penguinPointers.length }}
Columns loaded: {{ allColumns.length }}
Selected version: {{ selectedVersion }}
  </pre>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const penguinPointers = ref([]);
const allColumns = ref([]);
const selectedVersion = ref(null);
const ready = ref(false);

const pointer = computed(() =>
  penguinPointers.value.find(p => p.version === selectedVersion.value)
);

const columns = computed(() =>
  allColumns.value.filter(
    c => c.table === "penguins" && c.version === selectedVersion.value
  )
);

onMounted(async () => {
  try {
    const pointerRes = await fetch("data/pointers.json");
    if (!pointerRes.ok) throw new Error("pointer.json not found");

    const pointerJson = await pointerRes.json();
    penguinPointers.value = pointerJson.pointers;

    if (!penguinPointers.value.length) throw new Error("No pointers");

    // latest = last
    selectedVersion.value =
      penguinPointers.value[penguinPointers.value.length - 1].version;

    const columnsRes = await fetch("data/columns.json");
    if (!columnsRes.ok) throw new Error("columns.json not found");

    const columnsJson = await columnsRes.json();
    allColumns.value = columnsJson.columns;

    ready.value = true;
  } catch (err) {
    console.error(err);
  }
});
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

.version-select {
  margin-left: 0.4rem;
  font-size: 0.9rem;
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
</style>
