<template>
  <div>
    <TablePage
      ref="tableRef"
      table-name="文章"
      :default-order="defaultOrder"
      :handle-api="handleApi"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
    >
      <template #table-top>
        <!-- 表格菜单 -->
        <div v-if="statusList.length !== 0" class="status-menu">
          <span>状态</span>
          <template v-for="item of statusList" :key="item.value">
            <span
              :class="isActive(item.value)"
              @click="handleStatusCheck(item.value)"
            >
              {{ item.label }}
            </span>
          </template>
        </div>
      </template>
    </TablePage>
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage/TablePage.vue";
import { useTableHook } from "./article_list";
import { onMounted, ref } from "vue";

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

const defaultOrder = { id: "desc" };

const tableRef = ref<any>(null);

onMounted(() => {});
/** ******** start status menu **********/
type StatusTag = {
  value: string | number;
  label: string;
  condition: any;
};

const statusList: StatusTag[] = [
  { value: "all", label: "全部", condition: { is_delete: 0 } },
  { value: "public", label: "公开", condition: { is_delete: 0, status: 0 } },
  { value: "private", label: "私密", condition: { is_delete: 0, status: 1 } },
  { value: "draft", label: "草稿", condition: { is_delete: 0, status: 2 } },
  { value: "delete", label: "回收站", condition: { is_delete: 1 } }
];

const status = ref<string | number>(
  statusList.length > 0 ? statusList[0].value : 0
);

const isActive = (value: string | number) => {
  return value == status.value ? "status-menu-active" : "status-menu-normal";
};
// 选择了状态
const handleStatusCheck = (value: string | number) => {
  status.value = value;

  const conditions = [];
  const statusData =
    statusList.find(v => v.value === status.value)?.condition || {};
  // 状态条件
  for (const key in statusData) {
    const value = statusData[key];
    conditions.push({
      field: key,
      value: value instanceof String ? value : JSON.stringify(value),
      logic: "and",
      operator: "="
    });
  }

  const query: PageQuery = {
    conditions: conditions
  };

  tableRef.value.refreshList(query);
};
</script>

<style lang="scss" scoped></style>
