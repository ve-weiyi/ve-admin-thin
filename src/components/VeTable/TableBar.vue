<script setup lang="ts">
import { computed, onMounted, type PropType, ref, watchEffect } from "vue"
import { CheckboxGroupValueType, CheckboxValueType, Column } from "element-plus"
import draggable from "vuedraggable/src/vuedraggable"
import cloneDeep from "lodash/cloneDeep"
import ExpandIcon from "./svg/expand.svg?component"
import RefreshIcon from "./svg/refresh.svg?component"
import CollapseIcon from "./svg/collapse.svg?component"
import SettingIcon from "./svg/settings.svg?component"

const props = defineProps({
  /** 头部最左边的标题 */
  title: {
    type: String,
    default: "列表",
  },
  /** 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可 */
  tableRef: {
    type: Object as PropType<any>,
  },
  /** 需要展示的列 */
  columnFields: {
    type: Array as PropType<TableColumnList>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isExpandAll: {
    type: Boolean,
    default: true,
  },
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  "refresh",
])

const size = ref<"" | "default" | "small" | "large">("default")
const loading = ref(props.loading)
const isExpandAll = ref(props.isExpandAll)

const buttonRef = ref()

const getDropdownItemStyle = computed(() => {
  return (s) => {
    return {
      background: s === size.value ? "#409eff" : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    }
  }
})

// 表格结构定义
const columns = ref<Column[]>([])
const dynamicColumns = ref<Column[]>([])

const allColumnVisibility = ref<CheckboxGroupValueType>([])
const columnsVisibility = ref<CheckboxGroupValueType>([])
const checkAllColumns = ref(true)
const isIndeterminate = ref(false)

// 重置表格
function resetTable() {
  // console.log("resetTable: ")
  checkAllColumns.value = true
  isIndeterminate.value = false
  columns.value = props.columnFields
  dynamicColumns.value = cloneDeep(props.columnFields) // 深拷贝
  allColumnVisibility.value = dynamicColumns.value.map((column) => column.title)
  columnsVisibility.value = dynamicColumns.value
    .filter((column) => column.hidden != true)
    .map((column) => column.title)
  // console.log("columns", columns.value)
  // console.log("columnsVisibility", columnsVisibility.value)
  // onRefresh()
}

// 拖拽列显示排序
function handleDragFieldChange(evt: any): void {
  console.log("handleDragItemChange: ", evt)
  const oldIndex = evt.moved.oldIndex
  const newIndex = evt.moved.newIndex

  const oldColumn = dynamicColumns.value[oldIndex]
  const newColumn = dynamicColumns.value[newIndex]

  const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0]
  dynamicColumns.value.splice(newIndex, 0, currentRow)
  // console.log("handleDragItemChange: ", oldColumn, newColumn, dynamicColumns)
}

// 选择所有的列
function handleCheckAllFieldChange(val: boolean) {
  console.log("handleCheckAllFieldChange ", val)
  isIndeterminate.value = false
  // 改变按钮状态
  columnsVisibility.value = val ? dynamicColumns.value.map((column) => column.title) : []
  // 改变列显示状态
  dynamicColumns.value.map((column) => (val ? (column.hidden = false) : (column.hidden = true)))
  // console.log("handleCheckAllFieldChange columnsVisibility", columnsVisibility.value)
}

// 选择当前的列
function handleCheckFieldChange(val: CheckboxValueType, element: any) {
  console.log("handleCheckFieldChange ", val, element)
  dynamicColumns.value.filter((item) => item.title === element)[0].hidden = !val
}

// 已选列表发送变化
function handleFieldsVisibilityChange(element: any[]) {
  console.log("handleFieldsVisibilityChange ", element)
  checkAllColumns.value = element.length === dynamicColumns.value.length
  isIndeterminate.value = element.length > 0 && !checkAllColumns.value
}

function onRefresh() {
  emit("refresh")
}

const iconClass = computed(() => {
  return [
    "w-[16px]",
    "text-black",
    "dark:text-white",
    "duration-100",
    "hover:!text-primary",
    "cursor-pointer",
    "outline-none",
  ]
})

const topClass = computed(() => {
  return [
    "flex",
    "justify-between",
    "pt-[3px]",
    "px-[11px]",
    "border-b-[1px]",
    "border-solid",
    "border-[#dcdfe6]",
    "dark:border-[#303030]",
  ]
})

function onExpand() {
  isExpandAll.value = !isExpandAll.value
  toggleRowExpansionAll(props.tableRef.data, isExpandAll.value)
}

function toggleRowExpansionAll(data, isExpansion) {
  data.forEach((item) => {
    props.tableRef.toggleRowExpansion(item, isExpansion)
    if (item.children !== undefined && item.children !== null) {
      toggleRowExpansionAll(item.children, isExpansion)
    }
  })
}

onMounted(() => {
  resetTable()
})

watchEffect(() => {
  loading.value = props.loading
  isExpandAll.value = props.isExpandAll
})
</script>

<template>
  <!-- 表格 -->
  <el-card v-loading="loading" shadow="never" class="table-bar">
    <div class="table-operation">
      <!-- 标题 -->
      <slot name="title">
        <p class="table-title">{{ props.title }}</p>
      </slot>

      <!-- 表格操作 -->
      <div class="flex items-center justify-around">
        <div style="margin-right: 1rem">
          <slot name="buttons"></slot>
        </div>

        <el-tooltip content="展开表格" placement="top">
          <ExpandIcon
            :style="{ transform: isExpandAll ? 'none' : 'rotate(-90deg)' }"
            :class="iconClass"
            @click="onExpand"
          />
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="刷新表格" placement="top">
          <RefreshIcon :class="iconClass" @click="onRefresh" />
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="表格密度" placement="top">
          <el-dropdown trigger="click">
            <CollapseIcon :class="iconClass" />
            <template #dropdown>
              <el-dropdown-menu class="translation">
                <el-dropdown-item :style="getDropdownItemStyle('large')" @click="size = 'large'">
                  宽松
                </el-dropdown-item>
                <el-dropdown-item
                  :style="getDropdownItemStyle('default')"
                  @click="size = 'default'"
                >
                  默认
                </el-dropdown-item>
                <el-dropdown-item :style="getDropdownItemStyle('small')" @click="size = 'small'">
                  紧凑
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="表格设置" placement="top">
          <SettingIcon ref="buttonRef" :class="iconClass" />
        </el-tooltip>

        <!-- 其他部分保持不变 -->
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          placement="bottom-start"
          virtual-triggering
        >
          <div style="display: flex; justify-content: space-between">
            <el-checkbox
              label="列展示"
              value="列展示"
              v-model="checkAllColumns"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllFieldChange"
            />
            <el-button type="primary" link @click="resetTable"> 重置</el-button>
          </div>

          <el-divider direction="horizontal" style="margin: 0" />

          <el-checkbox-group v-model="columnsVisibility" @change="handleFieldsVisibilityChange">
            <el-space direction="vertical" alignment="stretch">
              <!-- 单列拖拽 -->
              <draggable
                v-model="allColumnVisibility"
                item-key="key"
                @change="handleDragFieldChange"
                force-fallback="true"
                animation="300"
                draggable=".item-single"
              >
                <template #item="{ element, index }">
                  <div class="flex item-single" style="display: flex; align-items: center">
                    <el-icon style="margin-right: 5px; font-size: 16px">
                      <Operation />
                    </el-icon>
                    <el-checkbox
                      v-if="element"
                      :label="element"
                      :value="element"
                      @change="(value) => handleCheckFieldChange(value, element)"
                    >
                      <span class="inline-block w-[120px] truncate hover:text-text_color_primary">
                        {{ element }}
                      </span>
                    </el-checkbox>
                  </div>
                </template>
              </draggable>
            </el-space>
          </el-checkbox-group>
        </el-popover>
      </div>
    </div>

    <slot name="default" :size="size" :dynamicColumns="dynamicColumns"></slot>
  </el-card>
</template>

<style scoped lang="scss">
.table-bar {
  margin-top: 0.5rem;
  min-height: calc(100vh - 126px);
  :deep(.el-card__body) {
    padding-top: 0.5rem;
  }
}

.table-operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

//表头加粗，显示card标题
.table-title {
  margin-left: 0rem;
  margin-top: 0rem;
  font-size: 16px;
  font-weight: bold;
  color: #202a34;
}

.table-title::before {
  content: "";
  width: 24px;
  height: 16px;
  border-left: 3px solid #0081ff;
  margin-right: 20px;
  margin-left: -20px;
}
</style>
