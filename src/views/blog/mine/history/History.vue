<template>
  <div>
    <TablePage
      :default-order="defaultOrder"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      :show-add-button="false"
      :show-edit-button="false"
      model-name="登录历史"
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
