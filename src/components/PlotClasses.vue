<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <!-- Canvas Wrapper -->
        <div ref="canvasWrapper" class="canvas-wrapper">
          <canvas ref="canvas"></canvas>
        </div>

        <!-- Legend -->
        <div class="legend">
          <div
            v-for="(color, type) in typeColors"
            :key="type"
            class="legend-item"
          >
            <div
              class="legend-color-box"
              :style="{ backgroundColor: color }"
            ></div>
            <span class="legend-label">{{ type }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue"
import Chart from "chart.js/auto"
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"

Chart.register(MatrixController, MatrixElement)

// Refs for DOM elements
const canvas = ref(null)
const canvasWrapper = ref(null)

// Chart instance and ResizeObserver references
let chartInstance = null
let resizeObserver = null

// Props for external control (e.g., data and styles)
const plotData = [
  { version: "v1", column_name: "age", type: "numerical" },
  { version: "v1", column_name: "sex", type: "factor" },
  { version: "v1", column_name: "income", type: "numerical" },
  { version: "v2", column_name: "age", type: "numerical" },
  { version: "v2", column_name: "sex", type: "factor" },
  { version: "v2", column_name: "income", type: "numerical" },
  { version: "v3", column_name: "age", type: "numerical" }
]

// Color mapping for data types
const typeColors = {
  factor: "#1f77b4",
  numerical: "#2ca02c",
  NA: "#d62728"
}

// Render the chart
const renderChart = async () => {
  await nextTick()
  const canvasEl = canvas.value
  const wrapperEl = canvasWrapper.value
  if (!canvasEl || !wrapperEl) return

  const { width: canvasWidth, height: canvasHeight } =
    wrapperEl.getBoundingClientRect()
  if (canvasWidth === 0 || canvasHeight === 0) return

  // Destroy the previous chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // Build axis labels and matrix data
  const versions = [...new Set(plotData.map((d) => d.version))]
  const columns = [...new Set(plotData.map((d) => d.column_name))]

  const matrixData = columns.flatMap((col, rowIndex) =>
    versions.map((ver, colIndex) => {
      const item = plotData.find(
        (d) => d.version === ver && d.column_name === col
      )
      const color = item ? typeColors[item.type] || typeColors.NA : typeColors.NA
      return {
        x: colIndex,
        y: rowIndex,
        v: 1,
        label: item?.type || "NA", // Text to display in each tile
        backgroundColor: color,
        borderRadius: 3
      }
    })
  )

  // Create the chart instance
  chartInstance = new Chart(canvasEl, {
    type: "matrix",
    data: {
      datasets: [
        {
          label: "Column Types",
          data: matrixData,
          width: (ctx) => {
            // Ensure `chartArea` exists
            const chartArea = ctx.chart.chartArea
            if (!chartArea) return 20 // Default fallback width (e.g., 20px)
            return (chartArea.width / versions.length) * 0.9
          },
          height: (ctx) => {
            // Ensure `chartArea` exists
            const chartArea = ctx.chart.chartArea
            if (!chartArea) return 20 // Default fallback height (e.g., 20px)
            return (chartArea.height / columns.length) * 0.9
          },
          borderColor: "#fff",
          borderWidth: 1,
          backgroundColor: (ctx) => ctx.raw.backgroundColor,
          borderRadius: (ctx) => ctx.raw.borderRadius
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => {
              const item = items[0].raw
              return `${columns[item.y]} / ${versions[item.x]}`
            },
            label: (tooltipItem) => `Type: ${tooltipItem.raw.label}`
          }
        },
        legend: { display: false }
      },
      layout: {
        padding: 20 // Add spacing around the chart
      },
      scales: {
        x: {
          type: "linear",
          min: -0.5,
          max: versions.length - 0.5,
          ticks: {
            stepSize: 1,
            callback: (val) => versions[Math.round(val)] || ""
          },
          grid: { display: false }
        },
        y: {
          type: "linear",
          min: -0.5,
          max: columns.length - 0.5,
          ticks: {
            stepSize: 1,
            callback: (val) => columns[Math.round(val)] || ""
          },
          grid: { display: false },
          reverse: true
        }
      }
    }
  })
}

onMounted(() => {
  renderChart()
  if (canvasWrapper.value) {
    resizeObserver = new ResizeObserver(() => renderChart())
    resizeObserver.observe(canvasWrapper.value)
  }
})

onBeforeUnmount(() => {
  // Destroy the chart instance and unobserve ResizeObserver on unmount
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  if (resizeObserver && canvasWrapper.value) {
    resizeObserver.unobserve(canvasWrapper.value)
    resizeObserver = null
  }
})
</script>

<style scoped>
/* Ensure the canvas and legend take appropriate space and don't overflow */

.canvas-wrapper {
  width: 100%;
  height: calc(100vh - 150px); /* Reduce height dynamically to fit legend */
  min-height: 400px;
  position: relative;
}

.legend {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Allow wrapping if legend items are too wide */
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
  border-radius: 3px;
}

.legend-label {
  font-size: 14px;
}



</style>