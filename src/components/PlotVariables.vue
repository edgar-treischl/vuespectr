<template>
  <div class="chart-container">
    <Chart type="matrix" :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js"
import { MatrixController, MatrixElement } from "chartjs-chart-matrix"
import { Chart } from "vue-chartjs"

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, MatrixController, MatrixElement)

const chartData = ref({ datasets: [] })
const options = ref({})

onMounted(async () => {
  // 1️⃣ Fetch JSON
  const response = await fetch("data/meta.json")
  const meta = await response.json()

  // 2️⃣ Transform to rawData
  const rawData = meta.penguins.map(item => ({
    version: item.version,
    column_name: item.column_name,
    present: true
  }))

  // 3️⃣ Get unique versions and columns
  const versions = [...new Set(rawData.map(d => d.version))]
  const columns = [...new Set(rawData.map(d => d.column_name))]

  // 4️⃣ Build presenceData for Chart.js matrix
  const padding = 2
  const presenceData = []

  columns.forEach((col, colIdx) => {
    versions.forEach((ver, verIdx) => {
      const entry = rawData.find(d => d.version === ver && d.column_name === col)
      const isPresent = entry ? entry.present : false
      presenceData.push({
        x: verIdx,
        y: columns.length - 1 - colIdx,
        present: isPresent
      })
    })
  })

  // 5️⃣ Chart dataset
  chartData.value = {
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

  // 6️⃣ Chart options
  options.value = {
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
})
</script>

<style scoped>
.chart-container {
  height: 400px;
}
</style>
