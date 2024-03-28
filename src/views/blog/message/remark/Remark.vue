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
      :tab-list="tabList"
      table-name="留言管理"
    >
      <template #operation="{ selectionIds, columnFieldsVisibility }">
        <el-button
          v-if="
            columnFieldsVisibility.filter(item => item === 'selection').length >
            0
          "
          :disabled="selectionIds.length === 0"
          icon="CircleCheck"
          size="default"
          type="success"
          @click="1"
        >
          批量通过
        </el-button>
      </template>
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import TablePage from "@/components/TablePage/TablePage.vue";
import { useTableHook } from "./hook";
import { onMounted } from "vue";

const defaultOrder = { id: "desc" };
const tabList = [
  {
    key: "is_review",
    label: "全部",
    count: null
  },
  {
    key: "is_review",
    label: "正常",
    count: 1
  },
  {
    key: "is_review",
    label: "审核中",
    count: 0
  }
];

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
