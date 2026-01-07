<template>
  <div class="heatmap-container">
    <h4>Columns</h4>
    <div ref="chart" class="chart"></div>

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
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import * as echarts from "echarts"

/* ---------------- Refs & instances ---------------- */

const chart = ref(null)
let chartInstance = null
let observer = null

/* ---------------- Table filter (hard-coded for now) ---------------- */

const tableFilter = ref("penguins")

/* ---------------- Load columns.json ---------------- */

const columnsData = ref([])

onMounted(async () => {
  const res = await fetch("data/columns.json")
  const json = await res.json()
  columnsData.value = json.columns
  initChart()
})

/* ---------------- Filtered columns ---------------- */

const filteredColumns = computed(() =>
  columnsData.value.filter(c => c.table === tableFilter.value)
)

/* ---------------- Color mapping ---------------- */

const typeColors = {
  factor: "#1f77b4",
  numeric: "#31572c",
  integer: "#31572c",
  NA: "#d62728"
}

/* ---------------- Helpers ---------------- */

const truncateText = (text, maxChars) => {
  if (!text) return ""
  return text.length <= maxChars
    ? text
    : text.slice(0, maxChars - 3) + "..."
}

/* ---------------- Chart init ---------------- */

function initChart() {
  if (!chart.value) return

  chartInstance = echarts.init(chart.value)

  const versions = [
    ...new Set(filteredColumns.value.map(d => d.version))
  ]

  const columns = [
    ...new Set(filteredColumns.value.map(d => d.column_name))
  ]

  // Dynamic font size
  const tileFontSize = Math.max(
    12,
    Math.min(18, 300 / Math.max(columns.length, versions.length))
  )

  /* -------- Build heatmap matrix -------- */

  const seriesData = []

  columns.forEach((col, y) => {
    versions.forEach((ver, x) => {
      const item = filteredColumns.value.find(
        d => d.version === ver && d.column_name === col
      )

      const type = item?.type || "NA"

      seriesData.push({
        value: [x, y, 1],
        itemStyle: { color: typeColors[type] },
        labelText: type,
        description: item?.description ?? "",
        label: item?.label ?? col
      })
    })
  })

  /* ---------------- Chart option ---------------- */

  const option = {
    tooltip: {
      formatter: params => {
        const col = columns[params.data.value[1]]
        const ver = versions[params.data.value[0]]

        return `
          <b>${params.data.label}</b><br/>
          Column: ${col}<br/>
          Version: ${ver}<br/>
          Type: ${params.data.labelText}<br/>
          ${params.data.description || ""}
        `
      }
    },
    xAxis: {
      type: "category",
      data: versions,
      axisLabel: { rotate: 30, fontSize: 14, color: "#333", formatter: value => value.slice(0, 10) },
      axisLine: { lineStyle: { color: "#888" } }
    },
    yAxis: {
      type: "category",
      data: columns,
      inverse: true,
      axisLabel: { fontSize: 14, color: "#333" },
      axisLine: { lineStyle: { color: "#888" } }
    },
    grid: {
      left: "15%",
      right: "5%",
      top: "15%",
      bottom: "15%",
      containLabel: true
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            borderColor: "#000",
            borderWidth: 1
          }
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
          borderRadius: 4
        }
      }
    ],
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: { color: ["#ffffff", "#ffffff"] }
    }
  }

  chartInstance.setOption(option)

  /* -------- Resize observer -------- */

  observer = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  observer.observe(chart.value)
}

/* ---------------- Cleanup ---------------- */

onBeforeUnmount(() => {
  observer?.disconnect()
  chartInstance?.dispose()
})
</script>

<style scoped>
.heatmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chart {
  width: 95%;
  height: 500px;
}

h4 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: #444;
}

.legend {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
