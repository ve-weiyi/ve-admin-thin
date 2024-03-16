<template>
  <div>
    <VeTableSearch
      ref="searchRef"
      :searchFields="searchFields"
      :loading="loading"
      @refresh="refreshList"
    ></VeTableSearch>

    <VeTableBar
      title="菜单管理（初版，持续完善中）"
      :columnFields="tableFields"
      :loading="loading"
      :isExpandAll="false"
      :tableRef="tableRef?.getTableRef()"
      @refresh="refreshList"
    >
      <template #buttons>
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          :disabled="tableRef?.selectionIds.length === 0"
          @click="openBatchDelete()"
        >
          批量删除
        </el-button>
        <el-button type="primary" icon="Plus" @click="openForm(null)"> 新增菜单</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <VeTable
          ref="tableRef"
          row-key="id"
          :data="tableData"
          :order-data="defaultOrder"
          :size="size"
          :columnFields="dynamicColumns"
          @refresh="refreshList"
        ></VeTable>
      </template>
    </VeTableBar>

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
        <el-button @click="cancelBatchDelete()">取 消</el-button>
        <el-button type="primary" @click="confirmBatchDelete(tableRef.selectionIds)">
          确 定
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加、修改对话框 -->
    <el-dialog v-model="formVisibility">
      <template #header>
        <div style="font-weight: bold">
          {{ formTitle }}
        </div>
      </template>
      <template #footer>
        <el-button @click="closeForm()">取消</el-button>
        <el-button type="primary" @click="submitForm(formData)">确定</el-button>
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
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue"
import { Column, ElMessage, FormInstance, FormRules } from "element-plus"
import { builderFormRender, FormField } from "@/utils/render.tsx"
import VeTable from "@/components/VeTable/Table.vue"
import VeTableBar from "@/components/VeTable/TableBar.vue"
import VeTableSearch from "@/components/VeTable/TableSearch.vue"
import cloneDeep from "lodash/cloneDeep"

const props = defineProps({
  getColumnFields: {
    type: Function as PropType<() => Column[]>,
    default: () => [],
  },
  getFormFields: {
    type: Function as PropType<(row: any) => FormField[]>,
    required: true,
  },
  getSearchFields: {
    type: Function as PropType<() => FormField[]>,
    required: true,
  },
  handleApi: {
    type: Function as PropType<(type: string, data: any) => Promise<any>>,
    required: true,
  },
  defaultOrder: {
    type: Object,
    default: () => {
      return { id: "desc" }
    },
  },
})

// 需要包装基本类型数据，使用 ref；如果你需要包装对象，使用 reactive。
// 表格加载状态
const loading = ref(true)

// 表格结构定义
const tableRef = ref()
const tableData = ref<any[]>([])
const tableFields = ref<Column[]>(props.getColumnFields())

/** ******** start 搜索 **********/
// 搜索表单定义
const searchRef = ref(null)
const searchFields = ref<FormField[]>(props.getSearchFields())

/** ******** end 搜索 **********/

/** ******** start 新增、修改 表单 **********/
const formTitle = computed(() => {
  const tableName = "菜单"
  if (formData.value.id) {
    return `查看${tableName}`
  } else {
    return `新增${tableName}`
  }
})

// 表单规则定义
const formRef = ref<FormInstance | null>(null)
const formRules: FormRules = reactive({})

// 表单数据定义
const formData = ref<any>({})
const formFields = ref<FormField[]>(props.getFormFields({}))
const formVisibility = ref(false)

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

// 重置表单
function resetForm(row: any) {
  if (row != null) {
    formData.value = cloneDeep(row)
  } else {
    formData.value = {}
  }

  console.log("resetForm", formData.value)
  formFields.value = props.getFormFields(formData.value)
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

function openBatchDelete() {
  batchDeleteVisibility.value = true
}

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

function refreshList() {
  const searchData = searchRef.value?.getSearchData()
  const orderData = tableRef.value?.getOrderData()
  const paginationData = tableRef.value?.getPaginationData()

  console.log("refreshList", orderData, searchData)

  const conditions = []
  const sorts = []

  // 搜索条件
  for (const key in searchData) {
    const item = searchFields.value.find((v) => v.field === key)
    const value = searchData[key]
    conditions.push({
      flag: item?.searchRules.flag || "and",
      field: key,
      value: value,
      rule: item?.searchRules.rule || "=",
    })
  }

  // 排序条件
  for (const key in orderData) {
    const value = orderData[key]
    sorts.push({
      field: key,
      order: value,
    })
  }

  // // 默认排序条件
  // if (sorts.length == 0) {
  //   for (const key in defaultOrder) {
  //     const value = defaultOrder[key]
  //     sorts.push({
  //       field: key,
  //       order: value,
  //     })
  //   }
  // }

  const page = {
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    sorts: sorts,
    conditions: conditions,
  }

  loading.value = true
  props.handleApi("list", page).then((res) => {
    if (res.data.page_size !== paginationData.pageSize) {
      paginationData.currentPage = res.data.page
      // pagination.pageSize = res.data.page_size
    }

    tableData.value = res.data.list
    paginationData.total = res.data.total
    setTimeout(() => {
      loading.value = false
    }, 300)
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

// onMounted(() => {
//   resetSearch()
//   resetTable()
//   refreshList()
// })

defineExpose({
  onCreate,
  onUpdate,
  onDelete,
  onDeleteByIds,
  refreshList,
  resetForm,
  openForm,
  closeForm,
  submitForm,
  confirmDelete,
  cancelBatchDelete,
  confirmBatchDelete,
})
</script>

<style lang="scss" scoped></style>
