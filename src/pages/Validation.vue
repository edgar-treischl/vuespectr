<template>
  <v-container fluid class="min-vh-100 pa-4">
    <v-row class="fill-height" justify="center">
      <v-col cols="10" class="d-flex">
        <SidebarLayout>
          <!-- Header -->
          <template #header>
            <h2>🧯 Validation Report</h2>
          </template>

          <!-- Sidebar -->
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

          <!-- Main -->
          <div class="main-content-body">
            <div
              v-if="!loaded"
              class="d-flex justify-center align-center loading-state"
            >
              <v-progress-circular indeterminate color="primary" />
              <span class="ml-2">Loading validation report…</span>
            </div>

            <div v-else-if="error" class="error">
              <v-icon color="error" size="36">mdi-alert-circle</v-icon>
              <p>
                Table: <strong>{{ store.table }}</strong><br />
                Version: <strong>{{ store.version }}</strong><br />
                {{ error }}
              </p>
            </div>

            <div v-else v-html="html" class="report-html" />
          </div>
        </SidebarLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useAppStore } from "@/stores/app";
import SidebarLayout from "../components/SidebarLayout.vue";

const store = useAppStore();
const html = ref(null);
const error = ref(null);
const loaded = ref(false);

async function loadReport() {
  loaded.value = false;
  html.value = null;
  error.value = null;

  if (!store.table || !store.version) {
    error.value = "Please select a table and version.";
    loaded.value = true;
    return;
  }

  try {
    const pointerRes = await fetch("data/pointers.json");
    if (!pointerRes.ok) throw new Error("pointers.json not found");

    const pointerJson = await pointerRes.json();
    const selection = pointerJson.pointers.find(
      (p) =>
        p.table === store.table &&
        p.version === store.version &&
        p.report_path
    );

    if (!selection || !selection.report_path) {
      throw new Error(
        "No validation report found for the selected table and version."
      );
    }

    const reportRes = await fetch(selection.report_path);
    if (!reportRes.ok)
      throw new Error(`Report file not found: ${selection.report_path}`);

    const reportText = await reportRes.text();
    if (!reportText.trim()) {
      throw new Error(
        `Report file is empty: ${selection.report_path}`
      );
    }

    html.value = reportText;

    await nextTick();
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
  } catch (e) {
    error.value = e.message || "Failed to load report.";
  } finally {
    loaded.value = true;
  }
}

onMounted(loadReport);

watch(
  () => [store.table, store.version],
  () => {
    if (store.table && store.version) loadReport();
  }
);

function downloadReport() {
  if (!html.value) return;

  const blob = new Blob([html.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `validation_report_${store.table}_${store.version}.html`;
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

/* Main content area */
.main-content-body {
  flex: 1;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.report-html {
  flex: 1;
  width: 100%;
  overflow-x: auto;
}

/* Loading & error states */
.loading-state {
  gap: 0.5rem;
  color: #555;
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
</style>
