import type { App } from "vue";
import { loadElementPlus } from "./element-plus";
import { loadElementPlusIcon } from "./element-plus-icon";
import { useEcharts } from "@/plugins/echarts";

export function loadPlugins(app: App) {
  loadElementPlus(app);
  loadElementPlusIcon(app);
  useEcharts(app);
}
