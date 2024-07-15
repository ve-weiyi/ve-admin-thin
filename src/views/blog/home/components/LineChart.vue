<template>
  <div
    ref="container"
    :class="props.className"
    :style="{ height: props.height, width: props.width }"
  />
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { EChartsOption } from "echarts";
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  Ref,
  ShallowRef,
  shallowRef,
  watchEffect
} from "vue";

type ECharts = echarts.ECharts;

const props = defineProps({
  data: {
    type: Object as () => { xAxis: string[]; values: number[] },
    default: () => ({
      xAxis: ["2022-01-18", "2022-01-19"],
      values: [100, 100]
    })
  },
  className: {
    type: String,
    default: "chart"
  },
  width: {
    type: String,
    default: "90%"
  },
  height: {
    type: String,
    default: "90%"
  }
});

const chart: ShallowRef<ECharts | null> = shallowRef(null);
const container: Ref<HTMLElement | null> = ref(null);
const option: Ref<EChartsOption | null> = ref(null);

const initChart = () => {
  chart.value = echarts.init(container.value as HTMLElement);
};

const updateCharts = () => {
  option.value = {
    xAxis: {
      data: props.data.xAxis,
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 8,
      right: 35,
      bottom: 0,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ["访问量(PV)", "独立访客(UV)"]
    },
    series: [
      {
        name: "访问量(PV)",
        itemStyle: {
          color: "#FF005A"
        },
        lineStyle: {
          color: "#FF005A",
          width: 2
        },
        smooth: true,
        type: "line",
        data: props.data.values,
        animationDuration: 2800,
        animationEasing: "cubicInOut"
      },
      {
        name: "独立访客(UV)",
        smooth: true,
        type: "line",
        itemStyle: {
          color: "#3888fa"
        },
        lineStyle: {
          color: "#3888fa",
          width: 2
        },
        areaStyle: {
          color: "#f3f8ff"
        },
        data: [] as number[],
        animationDuration: 2800,
        animationEasing: "quadraticOut"
      }
    ]
  };
  chart.value.setOption(option.value);
};

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  if (!chart.value) {
    return;
  }
  updateCharts();
});

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});
onBeforeUnmount(() => {
  if (!chart.value) {
    return;
  }
  chart.value.dispose();
  chart.value = null;
});

defineExpose({
  chart
});
</script>
