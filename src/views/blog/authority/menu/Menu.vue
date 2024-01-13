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

const defaultOrder = { id: "desc" }

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

function Sync(evt: MouseEvent) {
  console.log("menu-->", constantMenus)
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
