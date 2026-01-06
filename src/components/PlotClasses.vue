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
        <div class="legend-color-box" :style="{ backgroundColor: color }"></div>
        <span class="legend-label">{{ type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chart = ref(null);
let chartInstance = null;
let observer = null;

const plotData = [
  { version: "v1", column_name: "age", type: "numerical" },
  { version: "v1", column_name: "sex", type: "factor" },
  { version: "v1", column_name: "income", type: "numerical" },
  { version: "v2", column_name: "age", type: "numerical" },
  { version: "v2", column_name: "sex", type: "factor" },
  { version: "v2", column_name: "income", type: "numerical" },
  { version: "v3", column_name: "age", type: "numerical" }
];

const typeColors = {
  factor: "#1f77b4",
  numerical: "#31572c",
  NA: "#d62728"
};

// Dynamically truncate text for tile labels
const truncateText = (text, maxChars) => {
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3) + "...";
};

onMounted(() => {
  chartInstance = echarts.init(chart.value);

  const versions = [...new Set(plotData.map(d => d.version))];
  const columns = [...new Set(plotData.map(d => d.column_name))];

  // Determine font size dynamically based on number of columns
  const tileFontSize = Math.max(
    12,
    Math.min(18, 300 / Math.max(columns.length, versions.length))
  );

  // Build series data
  const seriesData = [];
  columns.forEach((col, y) => {
    versions.forEach((ver, x) => {
      const item = plotData.find(d => d.version === ver && d.column_name === col);
      const type = item?.type || "NA";
      seriesData.push({
        value: [x, y, 1], // numeric value required
        itemStyle: { color: typeColors[type] },
        labelText: type // store type for labels
      });
    });
  });

  const option = {
    tooltip: {
      formatter: params => {
        const col = columns[params.data.value[1]];
        const ver = versions[params.data.value[0]];
        return `<b>${col}</b><br>${ver}<br>Type: ${params.data.labelText}`;
      }
    },
    xAxis: {
      type: "category",
      data: versions,
      axisLabel: { rotate: 30, fontSize: 14, color: "#333" },
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
          show: true,
          formatter: params => truncateText(params.data.labelText, 12),
          color: "#fff",
          fontSize: tileFontSize,
          fontWeight: 600,
          align: "center",
          verticalAlign: "middle"
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
  };

  chartInstance.setOption(option);

  // ResizeObserver for sidebar toggle or container resize
  observer = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  observer.observe(chart.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  chartInstance?.dispose();
});
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
