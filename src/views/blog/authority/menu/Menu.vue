<template>
  <div>
    <TablePage
      :default-order="defaultOrder"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      model-name="菜单"
    >
      <template #operation="{ selectionIds, columnFieldsVisibility }">
        <el-button icon="CircleCheck" size="default" type="success" @click="Sync">
          同步菜单
        </el-button>
      </template>
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted } from "vue"
import router, { constantMenus } from "@/router"
import { ElMessage, ElMessageBox } from "element-plus"
import { syncMenuListApi } from "@/api/menu"
import { RouteConfigsTable } from "@/api/types"

const defaultOrder = { id: "asc" }

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

function Sync(evt: MouseEvent) {
  ElMessageBox.confirm(`确认要<strong>同步菜单列表到数据库吗</strong>`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    dangerouslyUseHTMLString: true,
    draggable: true,
  })
    .then(() => {
      const menus = constantMenus as RouteConfigsTable[]
      syncMenuListApi({ menus: menus }).then((res) => {
        ElMessage.success("同步成功")
      })
    })
    .catch(() => {
      ElMessage.success("同步取消")
    })

  console.log("menu-->", constantMenus)
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
