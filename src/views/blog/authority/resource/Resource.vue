<template>
  <div>
    <TablePage
      ref="tableRef"
      :default-order="defaultOrder"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      table-name="接口"
    >
      <template #operation="{ selectionIds, columnFieldsVisibility }">
        <el-button icon="CircleCheck" size="default" type="success" @click="Sync">
          同步接口
        </el-button>
      </template>
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted, ref } from "vue"
import { syncApiListApi } from "@/api/api"
import { ElMessage, ElMessageBox } from "element-plus"

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

const defaultOrder = { id: "desc" }
const tableRef = ref<InstanceType<typeof TablePage>>()

function Sync(evt: MouseEvent) {
  ElMessageBox.confirm(`确认要<strong>同步API到数据库吗</strong>`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    dangerouslyUseHTMLString: true,
    draggable: true,
  })
    .then(() => {
      syncApiListApi().then((res) => {
        ElMessage.success("同步成功")
        tableRef.value.refreshList()
      })
    })
    .catch(() => {
      ElMessage.success("同步取消")
    })
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
