<template>
  <!-- 表格展示 -->
  <el-table
    ref="tableRef"
    border
    row-key="id"
    :data="tableData"
    :size="size"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column
      v-for="item of columnFields.filter(item => item.hidden !== true)"
      :key="item.key"
      :type="item.type"
      :prop="item.dataKey as string"
      :label="item.title"
      :align="item.align || 'center'"
      :width="item.width"
      :sortable="item.sortable"
      :fixed="item.fixed"
    >
      <template #default="scope">
        <template v-if="item.cellRenderer">
          <component :is="item.cellRenderer(scope)" />
        </template>
        <template v-else-if="item.type !== 'selection'">
          {{ scope.row[item.dataKey] }}
        </template>
        <slot
          v-if="item.slot"
          :name="item.slot"
          :record="item.dataKey"
          :value="scope.row"
        >
          插槽内容
        </slot>
        <!-- 通过data属性传递参数 -->
        <!--        <slot name="operation" :row="scope"></slot>-->
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, PropType, reactive, ref, useSlots, watchEffect } from "vue";
import { Column, TableInstance } from "element-plus";
import defaultProps from "element-plus/es/components/table/src/table/defaults";

// 父组件向子组件传输的数据
const props = defineProps({
  columnFields: {
    type: Array<Column>,
    default: []
  },
  ...defaultProps
});

// 排序条件,{k:v}
const orderData = defineModel({
  type: Object as any,
  default: {},
  required: true
});

// 选择的id
const selectionIds = defineModel("selectionIds", {
  type: Array as PropType<number[]>,
  default: []
});

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  "refresh"
]);

const slots = useSlots();

for (const key in slots) {
  console.log("key---", key);
}
console.log("slots---", slots.operation);

// 表格ref
const tableRef = ref<TableInstance | null>(null);

// 表格加载状态
const size = ref<"" | "default" | "small" | "large">(props.size);
// 表格结构定义
const columnFields = ref<Column[]>(props.columnFields);

// 表格数据定义
const tableData = ref<any[]>(props.data);

// 批量选择回调
function handleSelectionChange(rows: any[]) {
  console.log("handleSelectionChange", rows);

  const ids = [];
  rows.forEach(item => {
    ids.push(item.id);
  });

  selectionIds.value = ids;
}

/** *
 * 批量排序回调
 * column是发生排序变化的列。
 * order是排序方式，有三个选项 ascending 升序、descending 降序、 null 默认排序
 * prop就是该列的prop。
 * */
function handleSortChange({ column, prop, order }) {
  console.log("handleSortChange", prop, order);

  // 删除属性
  delete orderData.value[prop];
  if (order) {
    const value = order.includes("asc") ? "asc" : "desc";
    orderData.value = Object.assign({ [prop]: value }, orderData.value);
  }
  emit("refresh");
}

function refreshList() {
  // console.log("refreshList")
  emit("refresh");
}

function getTableRef() {
  return tableRef.value;
}

function getTableData() {
  return tableData.value;
}

defineExpose({
  selectionIds,
  getTableRef,
  refreshList,
  handleSortChange,
  handleSelectionChange
});

onMounted(() => {
  // console.log("onMounted")
});

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  // console.log("watchEffect", props.columns)
  size.value = props.size;
  columnFields.value = props.columnFields;
  tableData.value = props.data;
  // orderData.value = props.orderData
  // paginationData.value = props.paginationData
});

defineOptions({
  name: "VeTable"
});
</script>

<style lang="scss" scoped></style>
