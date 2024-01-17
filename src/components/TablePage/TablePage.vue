<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-container">
      <el-form ref="searchRef" :inline="true" :model="searchFields">
        <el-form-item
          v-for="item of searchFields"
          :key="item.field"
          :prop="item.field"
          :label="item.label + '：'"
        >
          <template v-if="item.field">
            <component
              style="display: flex; justify-content: center; align-items: center"
              :is="builderFormRender(item, searchData)"
            />
          </template>
        </el-form-item>
        <el-form-item class="align-right">
          <el-button type="primary" icon="Search" @click="refreshList"> 搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="operation-container">
        <!-- 标题 -->
        <div class="table-title">{{ tableTitle }}</div>

        <!-- 表格操作 -->
        <div class="flex-between align-right">
          <div class="flex-between">
            <!-- 通过data属性传递参数 -->
            <slot
              name="operation"
              :selectionIds="selectionIds"
              :columnFieldsVisibility="columnFieldsVisibility"
            ></slot>
            <el-button
              v-if="props.showAddButton"
              type="primary"
              size="default"
              icon="plus"
              @click="openForm(null)"
            >
              新增{{ tableName }}
            </el-button>
            <el-button
              v-if="columnFieldsVisibility.filter((item) => item === 'selection').length > 0"
              type="danger"
              size="default"
              icon="Delete"
              :disabled="selectionIds.length === 0"
              @click="batchDeleteVisibility = true"
            >
              批量删除
            </el-button>
          </div>
          <div style="margin-left: 0.5rem; margin-right: 0.5rem">
            <el-tooltip content="刷新表格" placement="top">
              <el-button type="primary" icon="RefreshRight" circle @click="refreshList" />
            </el-tooltip>

            <el-tooltip content="表格密度" placement="top">
              <el-dropdown trigger="click">
                <el-button style="margin-inline: 0.5rem" type="primary" icon="Download" circle />
                <template #dropdown>
                  <el-dropdown-menu class="translation">
                    <el-dropdown-item
                      :style="getDropdownItemStyle('large')"
                      @click="size = 'large'"
                    >
                      宽松
                    </el-dropdown-item>
                    <el-dropdown-item
                      :style="getDropdownItemStyle('default')"
                      @click="size = 'default'"
                    >
                      默认
                    </el-dropdown-item>
                    <el-dropdown-item
                      :style="getDropdownItemStyle('small')"
                      @click="size = 'small'"
                    >
                      紧凑
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>

            <el-tooltip content="表格设置" placement="top">
              <el-button ref="buttonRef" type="primary" icon="setting" circle />
            </el-tooltip>

            <!-- 其他部分保持不变 -->
            <el-popover
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              placement="bottom-start"
              virtual-triggering
            >
              <div class="flex-between">
                <el-checkbox
                  label="列展示"
                  v-model="checkAllColumns"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllFieldChange"
                />
                <el-button type="primary" link @click="resetTable"> 重置</el-button>
              </div>

              <el-divider direction="horizontal" style="margin-top: 0; margin-bottom: 5px" />
              <el-checkbox-group
                v-model="columnFieldsVisibility"
                @change="handleFieldsVisibilityChange"
              >
                <el-space direction="vertical" alignment="stretch">
                  <!-- 单列拖拽 -->
                  <draggable
                    v-model="columnFields"
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
                          :label="element.title"
                          @change="(value) => handleCheckFieldChange(value, element)"
                        >
                          <span
                            class="inline-block w-[120px] truncate hover:text-text_color_primary"
                          >
                            {{ element.title }}
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
      </div>

      <!-- 表格菜单 -->
      <div class="status-menu" v-if="statusList.length !== 0">
        <span>状态</span>
        <template v-for="item of statusList" :key="item.value">
          <span @click="handleStatusCheck(item.value)" :class="isActive(item.value)">
            {{ item.label }}
          </span>
        </template>
      </div>

      <!-- 表格展示 -->
      <el-table
        border
        ref="tableRef"
        :loading="loading"
        :data="tableData"
        :size="size"
        row-key="id"
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
          :align="item.align"
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
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination-container"
        background
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="batchDeleteVisibility" class="dialog-container">
      <template #header>
        <div class="dialog-title-container">
          <el-icon style="color: #ff9900">
            <WarningFilled />
          </el-icon>
          删除提示
        </div>
      </template>
      <div style="font-size: 1rem">是否彻底删除选中项？</div>
      <template #footer>
        <el-button @click="cancelBatchDelete">取 消</el-button>
        <el-button type="primary" @click="confirmBatchDelete(selectionIds)"> 确 定</el-button>
      </template>
    </el-dialog>

    <!-- 角色-菜单对话框 -->
    <el-dialog v-model="formVisibility" class="dialog-container">
      <template #header>
        <div class="dialog-title-container">
          {{ formTitle }}
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        size="default"
      >
        <el-form-item
          v-for="item of formFields.filter((item) => item.hidden !== true)"
          :key="item.field"
          :prop="item.field"
          :label="item.label + '：'"
        >
          <template v-if="item.field">
            <component :is="builderFormRender(item, formData)" />
          </template>
        </el-form-item>
      </el-form>
      <template #footer v-if="showEditButton">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="submitForm(formData)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { builderFormRender, defaultPaginationData, FormField, Pagination } from "@/utils/render"
import {
  CheckboxGroupValueType,
  CheckboxValueType,
  Column,
  ElMessage,
  FormInstance,
  FormRules,
  TableInstance,
} from "element-plus"
import draggable from "vuedraggable/src/vuedraggable"
import { useRoute } from "vue-router"
import "@/style/table.scss"
import { copy } from "@/directives"

type StatusTag = {
  value: number | string
  label: string
}

// 父组件向子组件传输的数据
const props = defineProps({
  getColumnFields: {
    type: Function,
    required: true,
  },
  getFormFields: {
    type: Function,
    required: true,
  },
  getSearchFields: {
    type: Function,
    required: true,
  },
  // listApi: {
  //   type: Function,
  //   required: true,
  // },
  // addApi: {
  //   type: Function,
  //   required: true,
  // },
  // updateApi: {
  //   type: Function,
  //   required: true,
  // },
  // deleteApi: {
  //   type: Function,
  //   required: true,
  // },
  // batchDeleteApi: {
  //   type: Function,
  //   required: true,
  // },
  handleApi: {
    type: Function,
    required: true,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  tableTitle: {
    type: String,
    default: "",
  },
  modelName: {
    type: String,
    default: "",
  },
  statusList: {
    type: Array<StatusTag>,
    default: () => {
      return []
    },
  },
  onStatusChange: {
    type: Function,
    default: (): any => {},
  },
  defaultOrder: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  // 'eventName',
])

const tableTitle = props.tableTitle ? props.tableTitle : useRoute().meta.title
const tableName = props.modelName ? props.modelName : useRoute().meta.title

const buttonRef = ref()
const size = ref<"" | "default" | "small" | "large">("default")

const getDropdownItemStyle = computed(() => {
  return (s) => {
    return {
      background: s === size.value ? "#409eff" : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    }
  }
})

/** ******** start status menu **********/

const statusList = reactive<StatusTag[]>(props.statusList)

const type = ref<string | number>(statusList.length > 0 ? statusList[0].value : 0)
// 选择了状态
const handleStatusCheck = (status: string | number) => {
  type.value = status
  refreshList()
}

const isActive = (status: string | number) => {
  return status === type.value ? "status-menu-active" : "status-menu-normal"
}
/** ******** start status menu **********/

// 表格加载状态
const loading = ref(true)

// 表格结构定义
const columnFields = ref<Column[]>([])
const columnFieldsVisibility = ref<CheckboxGroupValueType>([])
const checkAllColumns = ref(true)
const isIndeterminate = ref(false)

// 表格数据定义
const tableRef = ref<TableInstance | null>(null)
const tableData = ref<any[]>([])
const pagination = reactive<Pagination>({ ...defaultPaginationData })
const selectionIds = reactive<number[]>([])

// 表搜素条件定义
const searchRef = ref<FormInstance | null>(null)
const searchFields = ref<FormField[]>(props.getSearchFields())
// 搜索条件,{k:v}
const searchData = ref<any>({})
// 排序条件,{k:v}
const orderData = ref<any>({})
// 条件查询 (key,value)
const conditions = reactive<Condition[]>([])
const sorts = reactive<Sort[]>([])

function onFindList(page: PageQuery) {
  console.log("onFindList", page)
  props.handleApi("list", page).then((res) => {
    if (res.data.page_size !== pagination.pageSize) {
      pagination.currentPage = res.data.page
      // pagination.pageSize = res.data.page_size
    }

    tableData.value = res.data.list
    pagination.total = res.data.total
    loading.value = false
  })
}

function onCreate(row: any) {
  console.log("onCreate", row)
  props.handleApi(row, "create").then((res) => {
    ElMessage.success("创建成功")
    closeForm()
    refreshList()
  })
}

function onUpdate(row: any) {
  console.log("onUpdate", row)
  props.handleApi("update", row).then((res) => {
    ElMessage.success("更新成功")
    closeForm()
    refreshList()
  })
}

function onDelete(id: number) {
  console.log("onDelete", id)
  props.handleApi("delete", id).then((res) => {
    ElMessage.success("删除成功")
    refreshList()
  })
}

function onDeleteByIds(ids: number[]) {
  console.log("onDeleteByIds", ids)
  props.handleApi("deleteByIds", ids).then((res) => {
    ElMessage.success("批量删除成功")
    batchDeleteVisibility.value = false
    refreshList()
  })
}

// 分页大小改变回调
function handleSizeChange(val: number) {
  console.log(`${val} items per page`)
  pagination.pageSize = val
  refreshList()
}

// 分页回调
function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`)
  pagination.currentPage = val
  refreshList()
}

function refreshList() {
  conditions.length = 0
  sorts.length = 0

  // 搜索条件
  for (const key in searchData.value) {
    const item = searchFields.value.find((v) => v.field === key)
    const value = searchData.value[key]
    conditions.push({
      flag: item?.searchRules.flag || "and",
      field: key,
      value: value,
      rule: item?.searchRules.rule || "=",
    })
  }

  const statusData = ref<any>({})
  if (props.onStatusChange) {
    statusData.value = props.onStatusChange(type.value)
  } else {
    statusData.value = { type: type.value }
  }
  // 状态条件
  for (const key in statusData.value) {
    const value = statusData.value[key]
    conditions.push({
      flag: "and",
      field: key,
      value: value,
      rule: "=",
    })
  }

  // 排序条件
  for (const key in orderData.value) {
    const value = orderData.value[key]
    sorts.push({
      field: key,
      order: value,
    })
  }

  loading.value = true
  onFindList({
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    sorts: sorts,
    conditions: conditions,
  })
}

function resetSearch() {
  searchData.value = {}
  orderData.value = props.defaultOrder
  tableRef.value?.clearSort()
  tableRef.value?.clearSelection()
}

// 重置表格
function resetTable() {
  checkAllColumns.value = true
  isIndeterminate.value = false
  columnFields.value = props.getColumnFields()
  columnFieldsVisibility.value = columnFields.value
    .filter((column) => column.hidden != true)
    .map((column) => column.title)
  // console.log("columnFields", columnFields.value)
  // console.log("columnFieldsVisibility", columnFieldsVisibility.value)
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
  console.log("handleSortChange", prop, order)

  const value = order === "ascending" ? "asc" : "desc"
  orderData.value = Object.assign({ [prop]: value }, orderData.value)
  orderData.value[prop] = value
  refreshList()
}

// 拖拽列显示排序
function handleDragFieldChange(evt: any): void {
  console.log("handleDragItemChange: ", evt)
}

// 选择所有的列
function handleCheckAllFieldChange(val: boolean) {
  isIndeterminate.value = false
  // 改变按钮状态
  columnFieldsVisibility.value = val ? columnFields.value.map((column) => column.title) : []
  // 改变列显示状态
  columnFields.value.map((column) => (val ? (column.hidden = false) : (column.hidden = true)))
  console.log("handleCheckAllFieldChange ", val, columnFieldsVisibility.value)
}

// 选择当前的列
function handleCheckFieldChange(val: CheckboxValueType, element: any) {
  columnFields.value.filter((item) => item.title === element.title)[0].hidden = !val
  console.log("handleCheckFieldChange ", val, element)
}

// 已选列表发送变化
function handleFieldsVisibilityChange(element: any[]) {
  checkAllColumns.value = element.length === columnFields.value.length
  isIndeterminate.value = element.length > 0 && !checkAllColumns.value
  console.log("handleFieldsVisibilityChange ", element)
}

/** ******** start 新增、修改 **********/
const formTitle = computed(() => {
  if (formData.value.id) {
    if (props.showEditButton) {
      return `编辑${tableName}`
    }
    return `查看${tableName}`
  } else {
    return `新增${tableName}`
  }
})
// 表单数据定义
const formFields = ref<FormField[]>([])
const formVisibility = ref(false)
const formStatus = ref("")

// 表单规则定义
const formRef = ref<FormInstance | null>(null)
const formData = ref<any>({})
const formRules: FormRules = reactive({})

// 重置表单
function resetForm(row: any) {
  if (row != null) {
    formData.value = row
  } else {
    formData.value = {}
  }

  // console.log("resetForm", formData.value)
  formFields.value = props.getFormFields(formData.value)
}

// 打开表单
function openForm(row: any) {
  formVisibility.value = true
  resetForm(row)
}

// 关闭表单
function closeForm() {
  formVisibility.value = false
  resetForm(null)
}

// 提交表单
function submitForm(row: any) {
  console.log("submitForm", formRef.value)
  formRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      if (row.id === 0) {
        onCreate(row)
      } else {
        onUpdate(row)
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

/** ******** end 新增、修改 **********/

/** ******** start 批量删除 **********/
// 批量移除提示框
const batchDeleteVisibility = ref(false)

// 取消批量删除
function cancelBatchDelete() {
  batchDeleteVisibility.value = false
}

// 确认批量删除
function confirmBatchDelete(ids: number[]) {
  batchDeleteVisibility.value = false
  onDeleteByIds(ids)
}

function confirmDelete(id: number) {
  onDelete(id)
}

/** ******** end 批量删除 **********/
onMounted(() => {
  resetForm(null)
  resetSearch()
  resetTable()
  refreshList()
})

defineExpose({
  onFindList,
  onCreate,
  onUpdate,
  onDelete,
  onDeleteByIds,
  resetSearch,
  resetTable,
  refreshList,
  handleSortChange,
  handleDragFieldChange,
  handleCheckAllFieldChange,
  handleFieldsVisibilityChange,
  handleCheckFieldChange,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  resetForm,
  openForm,
  closeForm,
  submitForm,
  confirmDelete,
  cancelBatchDelete,
  confirmBatchDelete,
})
</script>

<style lang="scss" scoped>
.search-container {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
    width: 100%;
  }
}
</style>
