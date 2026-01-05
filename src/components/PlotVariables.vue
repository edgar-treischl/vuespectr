<template>
  <div class="chart-container">
    <Chart type="matrix" :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js"
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"
import { Chart } from "vue-chartjs"

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  MatrixController,
  MatrixElement
)

const chartData = ref({ datasets: [] })
const options = ref({})

onMounted(async () => {
  // 1️⃣ Fetch JSON
  const response = await fetch("data/meta.json")
  const meta = await response.json()

  // 2️⃣ Extract unique versions & columns
  const versions = [...new Set(meta.penguins.map(p => p.version))]
  const columns = [...new Set(meta.penguins.map(p => p.column_name))]

  // 3️⃣ Build lookup for fast presence check
  const presenceSet = new Set(
    meta.penguins.map(p => `${p.version}||${p.column_name}`)
  )

  // 4️⃣ Build FULL matrix (missing = false)
  const matrixData = []

  columns.forEach(col => {
    versions.forEach(ver => {
      matrixData.push({
        x: ver,
        y: col,
        present: presenceSet.has(`${ver}||${col}`)
      })
    })
  })

  // 5️⃣ Dataset
  chartData.value = {
    datasets: [
      {
        label: "Column Presence",
        data: matrixData,

        width: ({ chart }) =>
          chart.chartArea.width / versions.length - 2,

        height: ({ chart }) =>
          chart.chartArea.height / columns.length - 2,

        backgroundColor: ctx =>
          ctx.raw.present ? "#31572c" : "#d00000",

        borderColor: "#ffffff",
        borderWidth: 1
      }
    ]
  }

  // 6️⃣ Options
  options.value = {
    responsive: true,
    maintainAspectRatio: false,

    // ✅ Reserve space for axes + legend
    layout: {
      padding: {
        top: 24,
        right: 24,
        bottom: 56,
        left: 48
      }
    },

    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 14,
          padding: 16,
          generateLabels: () => [
            { text: "Present", fillStyle: "#31572c" },
            { text: "Missing", fillStyle: "#d00000" }
          ]
        }
      },

      tooltip: {
        backgroundColor: "#000",
        callbacks: {
          label: ctx => {
            const { x, y, present } = ctx.raw
            return `${y} (${x}): ${present ? "Present" : "Missing"}`
          }
        }
      }
    },

    scales: {
      x: {
        type: "category",
        labels: versions,
        offset: true,
        ticks: {
          padding: 8
        },
        title: {
          display: true,
          text: "Version",
          padding: { top: 10 }
        }
      },
      y: {
        type: "category",
        labels: columns,
        offset: true,
        ticks: {
          padding: 8
        },
        title: {
          display: true,
          text: "Column",
          padding: { bottom: 10 }
        }
      }
    }
  }
})
</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
  overflow: visible; /* 🔑 prevents label clipping */
}
</style>
