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
      table-name="日志"
    />
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage/TablePage.vue";
import { useTableHook } from "./hook.tsx";
import { onMounted } from "vue";

const defaultOrder = { id: "desc" };

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
