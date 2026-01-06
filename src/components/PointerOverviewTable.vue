<template>
  <section v-if="rows.length">
    <header class="table-header">
      <h2>🏃 Summary Last Run</h2>
    </header>

    <table class="overview-table">
      <thead>
        <tr>
          <th>Table</th>
          <th>Version</th>
          <th>Status</th>
          <th>🔗 Link</th>
          <th>🕵️ Agent</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.table">
          <td>{{ row.table }}</td>
          <td>{{ row.version }}</td>
          <td>{{ row.status }}</td>
          <td>
            <a :href="row.link" target="_blank" rel="noopener">
              {{ row.linkText }}
            </a>
          </td>
          <td>{{ row.validated_by }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <p v-else>Loading overview…</p>
</template>

<script setup>
import { ref, onMounted } from "vue";

const rows = ref([]);

const BASE_URL =
  "https://gitlab.lrz.de/edgar-treischl/OddJob/-/tree/main";

onMounted(async () => {
  const res = await fetch("data/pointers.json");
  const json = await res.json();

  const latestByTable = {};

  for (const p of json.pointers) {
    if (!p.table || !p.version) continue;

    // keep latest version per table (string-safe)
    if (
      !latestByTable[p.table] ||
      p.version.localeCompare(latestByTable[p.table].version) > 0
    ) {
      latestByTable[p.table] = p;
    }
  }

  rows.value = Object.values(latestByTable).map(p => {
    const fileName = p.report_path?.split("/").pop();

    return {
      table: p.table,
      version: p.version,
      status: p.status,
      validated_by: p.validated_by,
      linkText: fileName,
      link: `${BASE_URL}/${fileName}/pointers?ref_type=heads`
    };
  });
});
</script>

<style scoped>
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
</style>
