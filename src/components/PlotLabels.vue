<template>
  <div>
    <h4>Labels</h4>
    <div ref="chart" style="height: 500px; width: 100%;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const chart = ref(null);

// Utility to truncate long text
const truncateText = (text, n) => {
  if (!text) return "";
  return text.length > n ? text.slice(0, n - 3) + "..." : text;
};

onMounted(async () => {
  try {
    // Load JSON
    const res = await fetch("data/columns.json");
    if (!res.ok) throw new Error("columns.json not found");
    const json = await res.json(); // <-- FIXED: parse JSON

    // Filter for penguins factor columns
    const allColumns = json.columns.filter(c => c.table === "penguins" && c.type === "factor");

    if (!allColumns.length) throw new Error("No factor columns found");

    // All versions sorted
    const versions = Array.from(new Set(allColumns.map(c => c.version))).sort();

    // All column names sorted
    const columns = Array.from(new Set(allColumns.map(c => c.column_name))).sort();

    // Build signatures per column/version
    const signatureMap = {};
    columns.forEach(col => {
      signatureMap[col] = {};
      versions.forEach(ver => {
        const colData = allColumns.find(c => c.column_name === col && c.version === ver);
        if (colData?.levels) {
          const levels = colData.levels.split(/\s*,\s*/).sort();
          signatureMap[col][ver] = levels.join(", "); // full label text
        } else {
          signatureMap[col][ver] = "";
        }
      });
    });

    // Build heatmap data [xIndex, yIndex, changedFlag]
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

    // Configure ECharts
    const option = {
      tooltip: {
        formatter: params => {
          const col = columns[params.data[1]];
          const ver = versions[params.data[0]];
          const sig = signatureMap[col][ver];
          return `<b>${col}</b><br>${ver}<br>${sig}`;
        },
      },
      xAxis: {
        type: "category",
        data: versions.map(v => truncateText(v, 14)),
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "category",
        data: columns,
      },
      grid: { left: "20%", right: "10%", top: "10%", bottom: "20%" },
      visualMap: {
        min: 0,
        max: 1,
        show: false,
        inRange: { color: ["#31572c", "#d00000"] }, // 0=green, 1=red
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: {
            show: true,
            color: "#fff",
            formatter: params => {
              const col = columns[params.data[1]];
              const ver = versions[params.data[0]];
              return truncateText(signatureMap[col][ver], 20);
            },
          },
        },
      ],
    };

    const myChart = echarts.init(chart.value);
    myChart.setOption(option);
  } catch (e) {
    console.error(e);
    chart.value.innerHTML = `<p style="color:red;">${e.message}</p>`;
  }
});
</script>

<style scoped>
h4 {
  margin-bottom: 0.5rem;
}
</style>
