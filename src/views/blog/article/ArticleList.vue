<template>
  <div>
    <TablePage
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
      :handle-api="handleApi"
      :default-order="defaultOrder"
      :status-list="statusList"
      :on-status-change="onStatusChange"
      model-name="文章"
    />
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./article_list"
import { onMounted } from "vue"

const { getSearchFields, getColumnFields, getFormFields, handleApi, statusList, onStatusChange } =
  useTableHook()

const defaultOrder = { id: "desc" }

onMounted(() => {
})
</script>

<style lang="scss" scoped></style>
