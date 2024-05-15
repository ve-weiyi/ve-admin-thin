<template>
  <div>
    <TablePage
      ref="tableRef"
      table-title="友链管理"
      table-name="友链"
      :add-enable="true"
      :edit-enable="true"
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
import { useTableHook } from "./hook";
import { onMounted } from "vue";

const defaultOrder = { id: "desc" };

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
