<template>
  <v-card>
    <v-card-title>Pipe Validation Matrix</v-card-title>

    <v-card-text style="height: 450px">
      <Scatter :data="chartData" :options="options" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { Scatter } from "vue-chartjs"
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

// Dummy data
const rawData = [
  { col: "customer…", test: "not_null", count: 1 },
  { col: "customer…", test: "unique", count: 1 },
  { col: "customer…", test: "range", count: 0 },

  { col: "order_id", test: "not_null", count: 1 },
  { col: "order_id", test: "unique", count: 1 },
  { col: "order_id", test: "range", count: 1 },

  { col: "amount", test: "not_null", count: 1 },
  { col: "amount", test: "unique", count: 0 },
  { col: "amount", test: "range", count: 1 }
]

const tests = ["not_null", "unique", "range"]
const cols = ["customer…", "order_id", "amount"]

// Color scale similar to ggplot gradient
function colorForCount(count) {
  return count === 1 ? "#31572c" : "#ffffff"
}

// Build datasets (one line per column)
const datasets = cols.map(col => {
  const points = rawData
    .filter(d => d.col === col)
    .map(d => ({
      x: d.test,
      y: d.col
    }))

  return {
    label: col,
    data: points,
    showLine: true,
    borderColor: "lightgray",
    borderWidth: 1,
    pointRadius: 6,
    pointBackgroundColor: ctx => {
      const test = ctx.raw.x
      const match = rawData.find(
        d => d.col === col && d.test === test
      )
      return colorForCount(match?.count ?? 0)
    }
  }
})

const chartData = {
  datasets
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      type: "category",
      labels: tests,
      title: {
        display: true,
        text: "Test"
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      type: "category",
      labels: cols,
      title: {
        display: true,
        text: "Column"
      }
    }
  }
}
</script>
