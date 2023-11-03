<template>
  <div>
    <TablePage
      :default-order="defaultOrder"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      model-name="标签"
    >
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted } from "vue"

const defaultOrder = { id: "desc" }

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
