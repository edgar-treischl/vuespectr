<template>
  <div class="chart-container">
    <Chart type="matrix" :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js"
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"
import { Chart } from "vue-chartjs"

// Register chart components
ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, MatrixController, MatrixElement)

/* --- Fake tibble data --- */
const rawData = [
  { version: "2025-08-20T13-44-51", column_name: "species", present: true },
  { version: "2025-08-20T13-44-51", column_name: "island", present: true },
  { version: "2025-08-20T13-44-51", column_name: "bill_length_mm", present: true },
  { version: "2025-08-20T13-44-51", column_name: "bill_depth_mm", present: true },
  { version: "2025-08-20T13-44-51", column_name: "flipper_length_mm", present: true },
  { version: "2025-08-21T10-30-00", column_name: "species", present: true },
  { version: "2025-08-21T10-30-00", column_name: "island", present: true },
  { version: "2025-08-21T10-30-00", column_name: "bill_length_mm", present: false }, // missing column example
  { version: "2025-08-21T10-30-00", column_name: "bill_depth_mm", present: true },
  { version: "2025-08-21T10-30-00", column_name: "flipper_length_mm", present: true }
]

/* --- Extract unique versions and columns --- */
const versions = [...new Set(rawData.map(d => d.version))]
const columns = [...new Set(rawData.map(d => d.column_name))]

/* --- Build presenceData for Chart.js matrix --- */
const padding = 2
const presenceData = []

columns.forEach((col, colIdx) => {
  versions.forEach((ver, verIdx) => {
    // Find the entry in rawData
    const entry = rawData.find(d => d.version === ver && d.column_name === col)
    const isPresent = entry ? entry.present : false // mark missing rows as false
    presenceData.push({
      x: verIdx,
      y: columns.length - 1 - colIdx, // top row = first column
      present: isPresent
    })
  })
})

/* --- Chart dataset --- */
const chartData = {
  datasets: [
    {
      label: "Column Presence",
      data: presenceData,
      width: ctx => ctx.chart.scales.x.getPixelForTick(1) - ctx.chart.scales.x.getPixelForTick(0) - padding,
      height: ctx => ctx.chart.scales.y.getPixelForTick(0) - ctx.chart.scales.y.getPixelForTick(1) - padding,
      backgroundColor: ctx => ctx.dataset.data[ctx.dataIndex].present ? "#31572c" : "#d00000",
      borderColor: "white",
      borderWidth: 1
    }
  ]
}

/* --- Chart options --- */
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => {
          const item = ctx.dataset.data[ctx.dataIndex]
          const col = columns[columns.length - 1 - item.y]
          const ver = versions[item.x]
          return `${col} - ${ver}: ${item.present ? "Yes" : "No"}`
        }
      }
    }
  },
  scales: {
    x: {
      type: "category",
      labels: versions,
      offset: true,
      ticks: { maxRotation: 45, minRotation: 45 },
      title: { display: true, text: "Version" }
    },
    y: {
      type: "category",
      labels: columns.slice().reverse(),
      offset: true,
      title: { display: true, text: "Column" }
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px; /* adjust as needed */
}
</style>
