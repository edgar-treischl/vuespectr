<template>
  <div>
    <h4>Labels</h4>
    <div ref="chart" style="height: 600px; width: 100%;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chart = ref(null);
let chartInstance = null;
let observer = null;

// Smart truncate: split long text into lines of max n chars
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

onMounted(async () => {
  try {
    const res = await fetch("data/columns.json");
    if (!res.ok) throw new Error("columns.json not found");
    const json = await res.json();

    const allColumns = json.columns.filter(
      c => c.table === "penguins" && c.type === "factor"
    );
    if (!allColumns.length) throw new Error("No factor columns found");

    const versions = Array.from(
      new Set(allColumns.map(c => c.version))
    ).sort();

    const columns = Array.from(
      new Set(allColumns.map(c => c.column_name))
    ).sort();

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
          const sig = signatureMap[col][ver];
          return `<b>${col}</b><br><i>${ver}</i><br>${sig}`;
        },
      },
      xAxis: {
        type: "category",
        data: versions.map(v => truncateText(v, 10)),
        axisLabel: { rotate: 0, fontSize: 12, color: "#333" },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: columns,
        axisLabel: { fontSize: 12, color: "#333" },
        inverse: true,
        splitLine: { show: true, lineStyle: { color: "#eee" } },
      },
      grid: { left: "20%", right: "5%", top: "10%", bottom: "20%" },
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
  textStyle: {
    color: "#333",
    fontSize: 12
  }
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
            },
          },
          emphasis: {
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 4,
          },
        },
      ],
    };

    // Initialize chart
    chartInstance = echarts.init(chart.value);
    chartInstance.setOption(option);

    // Resize observer
    observer = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    });
    observer.observe(chart.value);

  } catch (e) {
    console.error(e);
    if (chart.value) {
      chart.value.innerHTML = `<p style="color:red;">${e.message}</p>`;
    }
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  if (chartInstance) chartInstance.dispose();
});
</script>


<style scoped>
h4 {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}
</style>
