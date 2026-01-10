<template>
  <div class="heatmap-container">
    <!-- Plot wrapper (controls size & ratio) -->
    <div class="chart-wrapper">
      <div ref="chart" class="chart"></div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import * as echarts from "echarts";

/* ---------------- Refs ---------------- */
const chart = ref(null);
let chartInstance = null;
let observer = null;

/* ---------------- Table filter ---------------- */
const tableFilter = ref("penguins");

/* ---------------- Load columns.json ---------------- */
const columnsData = ref([]);

onMounted(async () => {
  const res = await fetch("data/columns.json");
  const json = await res.json();
  columnsData.value = json.columns;

  await nextTick();
  waitForSizeAndInit();
});

/* ---------------- Filtered columns ---------------- */
const filteredColumns = computed(() =>
  columnsData.value.filter(c => c.table === tableFilter.value)
);

/* ---------------- Color mapping ---------------- */
const typeColors = {
  factor: "#1f77b4",
  numeric: "#31572c",
  integer: "#31572c",
  NA: "#d62728"
};

/* ---------------- Wait for layout ---------------- */
function waitForSizeAndInit() {
  const el = chart.value;
  if (!el) return;

  const wrapper = el.parentElement;

  if (wrapper.clientWidth === 0 || wrapper.clientHeight === 0) {
    requestAnimationFrame(waitForSizeAndInit);
    return;
  }

  initChart(wrapper);
}

/* ---------------- Init chart ---------------- */
function initChart(wrapper) {
  chartInstance = echarts.init(chart.value);

  const versions = [...new Set(filteredColumns.value.map(d => d.version))];
  const columns = [...new Set(filteredColumns.value.map(d => d.column_name))];

  const seriesData = [];
  columns.forEach((col, y) => {
    versions.forEach((ver, x) => {
      const item = filteredColumns.value.find(
        d => d.version === ver && d.column_name === col
      );

      const type = item?.type || "NA";

      seriesData.push({
        value: [x, y, 1],
        itemStyle: { color: typeColors[type] },
        labelText: type,
        description: item?.description ?? "",
        label: item?.label ?? col
      });
    });
  });

  const option = {
    tooltip: {
      formatter: params => {
        const col = columns[params.data.value[1]];
        const ver = versions[params.data.value[0]];
        return `
          <b>${params.data.label}</b><br/>
          Column: ${col}<br/>
          Version: ${ver}<br/>
          Type: ${params.data.labelText}<br/>
          ${params.data.description || ""}
        `;
      }
    },
    xAxis: {
      type: "category",
      data: versions,
      axisLabel: {
        fontSize: 14,
        color: "#333",
        formatter: v => v.slice(0, 10)
      },
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
      left: "10%",
      right: "10%",
      top: "5%",
      bottom: "10%",
      containLabel: true
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: { show: false },
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

  observer = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  observer.observe(wrapper);
}

/* ---------------- Cleanup ---------------- */
onBeforeUnmount(() => {
  observer?.disconnect();
  chartInstance?.dispose();
});
</script>

<style scoped>
.heatmap-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Plot wrapper controls ratio */
.chart-wrapper {
  width: 95%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  position: relative;
}

/* Chart fills wrapper */
.chart {
  position: absolute;
  inset: 0;
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
