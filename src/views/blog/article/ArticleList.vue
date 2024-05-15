<template>
  <div>
    <TablePage
      ref="tableRef"
      table-title="文章管理"
      table-name="文章"
      :status-list="statusList"
      :default-order="defaultOrder"
      :handle-api="handleApi"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
    />
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage2/TablePage.vue";
import { useTableHook } from "./article_list";
import { onMounted } from "vue";

const {
  getSearchFields,
  getColumnFields,
  getFormFields,
  handleApi,
  statusList
} = useTableHook();

const defaultOrder = { id: "desc" };

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
