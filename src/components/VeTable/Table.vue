<template>
  <!-- 表格展示 -->
  <el-table
    border
    ref="tableRef"
    row-key="id"
    :data="tableData"
    :size="size"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column
      v-for="item of columnFields.filter((item) => item.hidden !== true)"
      :type="item.type"
      :key="item.key"
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
          {{ scope.row[item.dataKey] || scope.row[item.key] }}
        </template>
        <!-- 通过data属性传递参数 -->
        <!--        <slot name="operation" :row="scope"></slot>-->
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    class="table-pagination"
    background
    :current-page="paginationData.currentPage"
    :page-size="paginationData.pageSize"
    :total="paginationData.total"
    :page-sizes="paginationData.pageSizes"
    :layout="paginationData.layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { onMounted, reactive, ref, watchEffect } from "vue"
import { defaultPaginationData, Pagination } from "@/utils/render"
import { Column, TableInstance } from "element-plus"
import defaultProps from "element-plus/es/components/table/src/table/defaults"

// 父组件向子组件传输的数据
const props = defineProps({
  columnFields: {
    type: Array<Column>,
    default: [],
  },
  orderData: {
    type: Object,
    default: () => ({}),
  },
  paginationData: {
    type: Object as PropType<Pagination>,
    default: () => defaultPaginationData,
  },
  ...defaultProps,
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  "refresh",
])

// 表格ref
const tableRef = ref<TableInstance | null>(null)

// 表格加载状态
const size = ref<"" | "default" | "small" | "large">(props.size)
// 表格结构定义
const columnFields = ref<Column[]>(props.columnFields)

// 表格数据定义
const tableData = ref<any[]>(props.data)
// 排序条件,{k:v}
const orderData = ref<any>(props.orderData)
// 分页参数
const paginationData = ref<Pagination>(props.paginationData)

// 选择的id
const selectionIds = reactive<number[]>([])

// 分页大小改变回调
function handleSizeChange(val: number) {
  console.log(`${val} items per page`)
  paginationData.value.pageSize = val
  if (paginationData.value.pageSizes.filter((item) => item === val).length !== 0) {
    refreshList()
  }
}

// 分页回调
function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`)
  paginationData.value.currentPage = val
  refreshList()
}

// 批量选择回调
function handleSelectionChange(rows: any[]) {
  console.log("handleSelectionChange", rows)
  selectionIds.length = 0
  rows.forEach((item) => {
    selectionIds.push(item.id)
  })
}

/** *
 * 批量排序回调
 * column是发生排序变化的列。
 * order是排序方式，有三个选项 ascending 升序、descending 降序、 null 默认排序
 * prop就是该列的prop。
 * */
function handleSortChange({ column, prop, order }) {
  // console.log("handleSortChange", prop, order)

  const value = order === "ascending" ? "asc" : "desc"
  orderData.value = Object.assign({ [prop]: value }, orderData.value)
  orderData.value[prop] = value
  console.log("handleSortChange orderData", orderData.value)
  emit("refresh")
}

function refreshList() {
  // console.log("refreshList")
  emit("refresh")
}

function getTableRef() {
  return tableRef.value
}

function getTableData() {
  return tableData.value
}

function getOrderData() {
  return orderData.value
}

function getPaginationData() {
  return paginationData.value
}

defineExpose({
  getOrderData,
  getPaginationData,
  selectionIds,
  getTableRef,
  refreshList,
  handleSortChange,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
})

onMounted(() => {
  // console.log("onMounted")
})

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  // console.log("watchEffect", props.columns)
  size.value = props.size
  columnFields.value = props.columnFields
  tableData.value = props.data
  // orderData.value = props.orderData
  // paginationData.value = props.paginationData
})

defineOptions({
  name: "VeTable",
})
</script>

<style lang="scss" scoped>
.table-pagination {
  float: right;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}
</style>
