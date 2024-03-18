<template>
  <div>
    <TablePage
      ref="tableRef"
      :default-order="defaultOrder"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      :add-enable="false"
      :edit-enable="false"
      table-name="登录历史"
    >
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted } from "vue"

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()
const defaultOrder = { id: "desc" }

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
