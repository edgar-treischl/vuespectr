<template>
  <div>
    <h4>Label Matrix (All penguins versions)</h4>
    <div ref="chart" style="height: 600px; width: 100%;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const chart = ref(null);

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
  return parts.join("\n"); // line breaks inside tile
};

onMounted(async () => {
  try {
    const res = await fetch("data/columns.json");
    if (!res.ok) throw new Error("columns.json not found");
    const json = await res.json();

    const allColumns = json.columns.filter(c => c.table === "penguins" && c.type === "factor");
    if (!allColumns.length) throw new Error("No factor columns found");

    const versions = Array.from(new Set(allColumns.map(c => c.version))).sort();
    const columns = Array.from(new Set(allColumns.map(c => c.column_name))).sort();

    const signatureMap = {};
    columns.forEach(col => {
      signatureMap[col] = {};
      versions.forEach(ver => {
        const colData = allColumns.find(c => c.column_name === col && c.version === ver);
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
        min: 0,
        max: 1,
        show: false,
        inRange: { color: ["#31572c", "#d00000"] },
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: {
            show: true,
            color: "#fff",
            fontSize: 14, // increased font
            formatter: params => {
              const col = columns[params.data[1]];
              const ver = versions[params.data[0]];
              return truncateText(signatureMap[col][ver], 18); // truncate per line
            },
            lineHeight: 16, // spacing between lines
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
  font-weight: 600;
  color: #444;
}
</style>
