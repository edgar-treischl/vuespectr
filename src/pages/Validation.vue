<template>
  <v-container class="min-vh-100 pa-4">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <SidebarLayout>
          <!-- Header slot -->
          <template #header>
            <h4>🧯 Validation Report</h4>
          </template>

          <!-- Sidebar slot -->
          <template #sidebar>
            <div class="sidebar-content">
              <p>
                The validation report provides a detailed summary of all checks
                performed during dataset validation.
              </p>

              <ul>
                <li>Each section represents a validation step.</li>
                <li>Results indicate pass, fail, or warning states.</li>
              </ul>

              <!-- Download button -->
              <div class="download-wrapper">
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  :disabled="!html"
                  @click="downloadReport"
                >
                  <v-icon start>mdi-download</v-icon>
                  Download Report
                </v-btn>
                <p class="small-text muted">
                  Click to download the full HTML report for offline review.
                </p>
              </div>

              <p class="muted mt-3">
                Use this report to verify expectations and ensure data integrity.
              </p>
            </div>
          </template>

          <!-- Main content (DEFAULT SLOT) -->
          <div
            v-if="!loaded && !error"
            class="d-flex justify-center align-center loading-state"
          >
            <v-progress-circular indeterminate color="primary" />
            <span class="ml-2">Loading validation report…</span>
          </div>

          <div v-else-if="error" class="error">
            <v-icon color="error" size="36">mdi-alert-circle</v-icon>
            <h5 class="mt-2">Report Not Available</h5>
            <p>{{ error }}</p>
          </div>

          <div v-else v-html="html" />
        </SidebarLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SidebarLayout from "../components/SidebarLayout.vue";

const html = ref(null);
const error = ref(null);
const loaded = ref(false);

onMounted(async () => {
  try {
    const pointerRes = await fetch("data/pointers.json");
    if (!pointerRes.ok) throw new Error("pointer.json not found");

    const pointerJson = await pointerRes.json();

    const penguins = pointerJson.pointers
      .filter(p => p.table === "penguins" && p.report_path)
      .sort((a, b) => b.version.localeCompare(a.version));

    if (!penguins.length) {
      throw new Error("No validation report found for penguins");
    }

    const latest = penguins[0];

    const reportRes = await fetch(latest.report_path);
    if (!reportRes.ok) {
      throw new Error(`Report file not found: ${latest.report_path}`);
    }

    html.value = await reportRes.text();
  } catch (e) {
    console.error(e);
    error.value = e.message;
  } finally {
    loaded.value = true;
  }
});

function downloadReport() {
  if (!html.value) return;

  const blob = new Blob([html.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "validation_report.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.download-wrapper {
  display: flex;
  flex-direction: column;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.download-wrapper .small-text {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.muted {
  color: #6c757d;
}

.mt-3 {
  margin-top: 1rem;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 400px;
  background: #f8f9fa;
  color: #842029;
  padding: 1rem;
  border-radius: 6px;
}

.loading-state {
  min-height: 400px;
  gap: 0.5rem;
  color: #555;
}
</style>
