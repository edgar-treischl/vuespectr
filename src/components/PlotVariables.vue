<template>
  <div class="heatmap-container">
    <!-- Chart -->
    <div class="chart-wrapper">
      <div ref="chart" class="chart"></div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color-box" style="background-color: #31572c;"></div>
        <span class="legend-label">Present</span>
      </div>
      <div class="legend-item">
        <div class="legend-color-box" style="background-color: #d00000;"></div>
        <span class="legend-label">Missing</span>
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

const truncateText = (text, maxChars) => {
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3) + "...";
};

onMounted(async () => {
  chartInstance = echarts.init(chart.value);

  // 1️⃣ Fetch JSON
  const response = await fetch("data/columns.json");
  const meta = await response.json();

  // 2️⃣ Extract unique versions & columns
  const versions = [...new Set(meta.columns.map(p => p.version))];
  const columns = [...new Set(meta.columns.map(p => p.column_name))];

  // 3️⃣ Build presence set
  const presenceSet = new Set(
    meta.columns.map(p => `${p.version}||${p.column_name}`)
  );

  // 4️⃣ Build heatmap data
  const data = [];
  columns.forEach((col, y) => {
    versions.forEach((ver, x) => {
      const present = presenceSet.has(`${ver}||${col}`);
      data.push({
        value: [x, y, present ? 1 : 0],
        color: present ? "#31572c" : "#d00000",
      });
    });
  });

  // 5️⃣ Determine font size dynamically
  const tileFontSize = Math.max(
    12,
    Math.min(18, 400 / Math.max(columns.length, versions.length))
  );

  // 6️⃣ ECharts option
  const option = {
    tooltip: {
      formatter: (params) => {
        const col = columns[params.data.value[1]];
        const ver = versions[params.data.value[0]];
        return `<b>${col}</b><br>${ver}<br>${params.data.labelText || ""}`;
      },
    },
    xAxis: {
      type: "category",
      data: versions,
      axisLabel: { rotate: 0, fontSize: 14, color: "#333" },
      axisLine: { lineStyle: { color: "#888" } },
    },
    yAxis: {
      type: "category",
      data: columns,
      inverse: true,
      axisLabel: { fontSize: 14, color: "#333" },
      axisLine: { lineStyle: { color: "#888" } },
    },
    grid: {
      left: 100,
      right: 40,
      top: 40,
      bottom: 80,
      containLabel: true,
    },
    series: [
      {
        type: "heatmap",
        data,
        label: {
          show: true,
          formatter: (params) => truncateText(params.data.labelText, 10),
          color: "#fff",
          fontSize: tileFontSize,
          fontWeight: 600,
          align: "center",
          verticalAlign: "middle",
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
          borderRadius: 4,
        },
      },
    ],
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: { color: ["#d00000", "#31572c"] },
    },
  };

  chartInstance.setOption(option);

  // 7️⃣ ResizeObserver for parent width/height changes
  observer = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  observer.observe(chart.value.parentElement);
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
  align-items: center;  /* center the chart horizontally */
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

/* Chart wrapper with aspect ratio */
.chart-wrapper {
  width: 100%;
  max-width: 1200px;        /* maximum chart width */
  position: relative;
  padding-bottom: 60%;       /* aspect ratio: height / width ~ 0.6 */
}

.chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}

/* Legend */
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
