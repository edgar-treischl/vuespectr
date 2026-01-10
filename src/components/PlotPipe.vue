<template>
  <PlotWrapper>
    <Scatter :data="chartData" :options="options" />
  </PlotWrapper>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Scatter } from "vue-chartjs";
import PlotWrapper from "./PlotWrapper.vue";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

/* ---------------- Chart.js registration ---------------- */
ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/* ---------------- State ---------------- */
const tableFilter = ref("penguins");
const pipes = ref([]);
const wrapperWidth = ref(800); // default before first measure

/* ---------------- Load data ---------------- */
onMounted(async () => {
  const res = await fetch("data/pipes.json");
  const json = await res.json();
  pipes.value = json.pipes;

  // observe wrapper width
  const wrapper = document.querySelector(".plot-wrapper");
  if (wrapper) {
    const ro = new ResizeObserver(entries => {
      wrapperWidth.value = entries[0].contentRect.width;
    });
    ro.observe(wrapper);

    onBeforeUnmount(() => ro.disconnect());
  }
});

/* ---------------- Filtered pipes ---------------- */
const filteredPipes = computed(() =>
  pipes.value.filter(p => p.table === tableFilter.value)
);

/* ---------------- Axes ---------------- */
const cols = computed(() =>
  [...new Set(filteredPipes.value.map(p => p.columns))]
);

const tests = computed(() =>
  [...new Set(filteredPipes.value.map(p => p.validation_type))]
);

/* ---------------- Normalize ---------------- */
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
);

/* ---------------- Responsive scaling ---------------- */
const scale = computed(() => {
  const w = wrapperWidth.value;

  return {
    font: Math.max(10, Math.min(14, w / 70)),
    point: Math.max(4, Math.min(7, w / 150)),
    gridPadding: Math.max(40, Math.min(90, w * 0.12))
  };
});

/* ---------------- Color ---------------- */
const colorForCount = count =>
  count === 1 ? "#31572c" : "#ffffff";

/* ---------------- Datasets ---------------- */
const datasets = computed(() =>
  cols.value.map(col => {
    const points = rawData.value
      .filter(d => d.col === col)
      .map(d => ({ x: d.test, y: d.col }));

    return {
      label: col,
      data: points,
      showLine: true,
      borderColor: "lightgray",
      borderWidth: 1,
      pointRadius: scale.value.point,
      pointBackgroundColor: ctx => {
        const match = rawData.value.find(
          d => d.col === col && d.test === ctx.raw.x
        );
        return colorForCount(match?.count ?? 0);
      }
    };
  })
);

/* ---------------- Chart data ---------------- */
const chartData = computed(() => ({
  datasets: datasets.value
}));

/* ---------------- Responsive options ---------------- */
const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  layout: {
    padding: scale.value.gridPadding
  },
  scales: {
    x: {
      type: "category",
      labels: tests.value,
      title: {
        display: true,
        text: "Test",
        font: { size: scale.value.font + 1 }
      },
      ticks: {
        font: { size: scale.value.font },
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      type: "category",
      labels: cols.value,
      title: {
        display: true,
        text: "Column",
        font: { size: scale.value.font + 1 }
      },
      ticks: {
        font: { size: scale.value.font }
      }
    }
  }
}));
</script>
