<template>
  <section class="validation-wrapper">
    <h4 class="mb-3">🧯 Validation Report</h4>

    <div class="layout">
      <!-- Info panel -->
      <aside class="info">
        <p>
          The validation report provides a detailed summary of all checks
          performed during dataset validation.
        </p>
        <ul>
          <li>Each section represents a validation step.</li>
          <li>Results indicate pass, fail, or warning states.</li>
        </ul>
        <p class="muted">
          Use this report to verify expectations and ensure data integrity.
        </p>
      </aside>

      <!-- Report panel -->
      <main class="report">
        <div v-if="error" class="error">
          <h4>Report Not Available</h4>
          <p>{{ error }}</p>
        </div>

        <div
          v-else-if="html"
          class="report-content"
          v-html="html"
        ></div>

        <p v-else>Loading validation report…</p>
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const html = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    // 1. Load pointer metadata
    const pointerRes = await fetch("data/pointers.json");
    if (!pointerRes.ok) throw new Error("pointer.json not found");

    const pointerJson = await pointerRes.json();

    // 2. Latest penguins pointer (string-safe)
    const penguins = pointerJson.pointers
      .filter(p => p.table === "penguins" && p.report_path)
      .sort((a, b) => b.version.localeCompare(a.version));

    if (!penguins.length) {
      throw new Error("No validation report found for penguins");
    }

    const latest = penguins[0];

    // 3. Load HTML report
    const reportRes = await fetch(`${latest.report_path}`);
    if (!reportRes.ok) {
      throw new Error(`Report file not found: ${latest.report_path}`);
    }

    html.value = await reportRes.text();
  } catch (e) {
    console.error(e);
    error.value = e.message;
  }
});
</script>

<style scoped>
.validation-wrapper {
  padding: 1rem;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
}

.info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.muted {
  color: #6c757d;
  font-size: 0.85rem;
}

.report {
  background: white;
  border: 1px solid #ddd;
  padding: 0;
  min-height: 400px;
}

.report-content {
  padding: 0;
  overflow-x: auto;
}

/* Safety: keep report styles contained */
.report-content :deep(*) {
  max-width: 100%;
}

.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f8f9fa;
  color: #842029;
}
</style>
