<template>
  <div class="heatmap-container">
    <!-- Plot wrapper -->
    <div class="chart-wrapper">
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import * as echarts from "echarts";

const chart = ref(null);
let chartInstance = null;
let observer = null;

/* ---------------- Helpers ---------------- */
const truncateText = (text, n) => {
  if (!text) return "";
  const parts = [];
  let remaining = text;
  while (remaining.length > n) {
    parts.push(remaining.slice(0, n));
    remaining = remaining.slice(n);
  }
  if (remaining.length) parts.push(remaining);
  return parts.join("\n");
};

/* ---------------- Wait for size ---------------- */
function waitForSizeAndInit(initFn) {
  const el = chart.value;
  if (!el) return;

  const wrapper = el.parentElement;

  if (wrapper.clientWidth === 0 || wrapper.clientHeight === 0) {
    requestAnimationFrame(() => waitForSizeAndInit(initFn));
    return;
  }

  initFn(wrapper);
}

/* ---------------- Lifecycle ---------------- */
onMounted(async () => {
  try {
    const res = await fetch("data/columns.json");
    if (!res.ok) throw new Error("columns.json not found");
    const json = await res.json();

    const allColumns = json.columns.filter(
      c => c.table === "penguins" && c.type === "factor"
    );
    if (!allColumns.length) throw new Error("No factor columns found");

    await nextTick();

    waitForSizeAndInit(wrapper => initChart(wrapper, allColumns));

  } catch (e) {
    console.error(e);
    if (chart.value) {
      chart.value.innerHTML = `<p style="color:red;">${e.message}</p>`;
    }
  }
});

/* ---------------- Chart init ---------------- */
function initChart(wrapper, allColumns) {
  chartInstance = echarts.init(chart.value);

  const versions = [...new Set(allColumns.map(c => c.version))].sort();
  const columns = [...new Set(allColumns.map(c => c.column_name))].sort();

  const signatureMap = {};
  columns.forEach(col => {
    signatureMap[col] = {};
    versions.forEach(ver => {
      const colData = allColumns.find(
        c => c.column_name === col && c.version === ver
      );
      signatureMap[col][ver] = colData?.levels
        ? colData.levels.split(/\s*,\s*/).sort().join(", ")
        : "";
    });
  });

  const seriesData = [];
  columns.forEach((col, yIndex) => {
    let prevSig = null;
    versions.forEach((ver, xIndex) => {
      const sig = signatureMap[col][ver];
      const changed = prevSig !== null && sig !== prevSig ? 1 : 0;
      prevSig = sig;
      seriesData.push([xIndex, yIndex, changed]);
    });
  });

  const option = {
    tooltip: {
      backgroundColor: "#333",
      borderColor: "#555",
      borderWidth: 1,
      textStyle: { color: "#fff", fontSize: 13 },
      formatter: params => {
        const col = columns[params.data[1]];
        const ver = versions[params.data[0]];
        return `<b>${col}</b><br><i>${ver}</i><br>${signatureMap[col][ver]}`;
      }
    },
    xAxis: {
      type: "category",
      data: versions.map(v => truncateText(v, 10)),
      axisLabel: { fontSize: 12, color: "#333" },
      splitLine: { show: false }
    },
    yAxis: {
      type: "category",
      data: columns,
      inverse: true,
      axisLabel: { fontSize: 12, color: "#333" },
      splitLine: { show: true, lineStyle: { color: "#eee" } }
    },
    grid: {
      left: "10%",
      right: "10%",
      top: "5%",
      bottom: "15%",
      containLabel: true
    },
    visualMap: {
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      bottom: 10,
      show: true,
      pieces: [
        { value: 0, label: "Unchanged", color: "#31572c" },
        { value: 1, label: "Changed", color: "#d00000" }
      ],
      textStyle: { color: "#333", fontSize: 12 }
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: {
          show: true,
          color: "#fff",
          fontSize: 14,
          lineHeight: 16,
          formatter: params => {
            const col = columns[params.data[1]];
            const ver = versions[params.data[0]];
            return truncateText(signatureMap[col][ver], 18);
          }
        },
        emphasis: {
          itemStyle: { borderColor: "#fff", borderWidth: 1 }
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
          borderRadius: 4
        }
      }
    ]
  };

  chartInstance.setOption(option);

  observer = new ResizeObserver(() => chartInstance?.resize());
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
  justify-content: center;
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
</style>
