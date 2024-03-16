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
      <template #batch-delete></template>
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
          :size="size"
          :columnFields="dynamicColumns"
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
      <MenuForm ref="formRef" :model="formData" :rules="formRules"></MenuForm>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useTableHook } from "./hook"
import { computed, reactive, ref } from "vue"
import { Column, FormInstance, FormRules } from "element-plus"
import { FormField } from "@/utils/render.tsx"
import VeTable from "@/components/VeTable/Table.vue"
import VeTableBar from "@/components/VeTable/TableBar.vue"
import VeTableSearch from "@/components/VeTable/TableSearch.vue"
import MenuForm from "./form.vue"

const defaultOrder = { id: "asc" }

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

// 表格加载状态
const loading = ref(true)

// 表格结构定义
const tableRef = ref()
const tableData = ref<any[]>([])
const tableFields = ref<Column[]>(getColumnFields())

/** ******** start 搜索 **********/
// 搜索表单定义
const searchRef = ref<FormInstance | null>(null)
const searchData = ref<any>({})
const searchFields = ref<FormField[]>(getSearchFields())

function refreshList() {
  const orderData = tableRef.value.orderData
  const paginationData = tableRef.value.paginationData

  console.log("refreshList")

  const conditions = []
  const sorts = []

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

  // 排序条件
  for (const key in orderData.value) {
    const value = orderData.value[key]
    sorts.push({
      field: key,
      order: value,
    })
  }

  // 默认排序条件
  if (sorts.length == 0) {
    for (const key in defaultOrder) {
      const value = defaultOrder[key]
      sorts.push({
        field: key,
        order: value,
      })
    }
  }

  const page = {
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    sorts: sorts,
    conditions: conditions,
  }

  loading.value = true
  handleApi("list", page).then((res) => {
    if (res.data.page_size !== paginationData.pageSize) {
      paginationData.currentPage = res.data.page
      // pagination.pageSize = res.data.page_size
    }

    tableData.value = res.data.list
    paginationData.total = res.data.total
    // loading.value = false
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
}

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
const formFields = ref<FormField[]>(getFormFields({}))
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
    formData.value = row
  } else {
    formData.value = {}
  }

  console.log("resetForm", formData.value)
  formFields.value = getFormFields(formData.value)
}

// 提交表单
function submitForm(row: any) {
  console.log("submitForm", formRef.value)
  formRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
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
}

function confirmDelete(id: number) {}

/** ******** end 批量删除 **********/

// onMounted(() => {
//   resetSearch()
//   resetTable()
//   refreshList()
// })

// function Sync(evt: MouseEvent) {
//   ElMessageBox.confirm(`确认要<strong>同步菜单列表到数据库吗</strong>`, "系统提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//     dangerouslyUseHTMLString: true,
//     draggable: true,
//   })
//     .then(() => {
//       const menus = constantMenus as RouteConfigsTable[]
//       syncMenuListApi({ menus: menus }).then((res) => {
//         ElMessage.success("同步成功")
//         tableRef.value.refreshList()
//       })
//     })
//     .catch(() => {
//       ElMessage.success("同步取消")
//     })
//
//   console.log("menu-->", constantMenus)
// }

// onMounted(() => {})
</script>

<style lang="scss" scoped></style>
