<template>
  <v-card>
    <v-card-text style="height: 450px">
      <Scatter :data="chartData" :options="options" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
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

/* ---------------- Chart.js registration ---------------- */

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

/* ---------------- Table filter (hard-coded for now) ---------------- */

const tableFilter = ref("penguins")

/* ---------------- Load pipes.json ---------------- */

const pipes = ref([])

onMounted(async () => {
  const res = await fetch("data/pipes.json")
  const json = await res.json()
  pipes.value = json.pipes
})

/* ---------------- Filtered pipes ---------------- */

const filteredPipes = computed(() =>
  pipes.value.filter(p => p.table === tableFilter.value)
)

/* ---------------- Matrix axes ---------------- */

const cols = computed(() =>
  [...new Set(filteredPipes.value.map(p => p.columns))]
)

const tests = computed(() =>
  [...new Set(filteredPipes.value.map(p => p.validation_type))]
)

/* ---------------- Normalize to matrix ---------------- */

const rawData = computed(() =>
  cols.value.flatMap(col =>
    tests.value.map(test => ({
      col,
      test,
      count: filteredPipes.value.some(
        p => p.columns === col && p.validation_type === test
      )
        ? 1
        : 0
    }))
  )
)

/* ---------------- Color scale ---------------- */

function colorForCount(count) {
  return count === 1 ? "#31572c" : "#ffffff"
}

/* ---------------- Build datasets ---------------- */

const datasets = computed(() =>
  cols.value.map(col => {
    const points = rawData.value
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
        const match = rawData.value.find(
          d => d.col === col && d.test === test
        )
        return colorForCount(match?.count ?? 0)
      }
    }
  })
)

/* ---------------- Chart data ---------------- */

const chartData = computed(() => ({
  datasets: datasets.value
}))

/* ---------------- Chart options ---------------- */

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      type: "category",
      labels: tests.value,
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
      labels: cols.value,
      title: {
        display: true,
        text: "Column"
      }
    }
  }
}))
</script>
