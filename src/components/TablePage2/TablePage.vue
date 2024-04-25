<template>
  <div>
    <!-- 表格搜索条件 -->
    <VeTableSearch
      ref="searchRef"
      :searchFields="searchFields"
      :loading="loading"
      @refresh="refreshList"
    />

    <VeTableBar
      :title="tableTitle"
      :columnFields="tableFields"
      :loading="loading"
      :isExpandAll="false"
      :tableRef="tableRef?.getTableRef()"
      @refresh="refreshList"
    >
      <template #buttons>
        <slot name="toolbar" />
        <el-button
          v-if="addEnable"
          type="primary"
          icon="Plus"
          @click="openForm(null)"
        >
          新增{{ tableName }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
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
        <div
          v-if="tableRef?.selectionIds.length > 0"
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ tableRef?.selectionIds.length }} 项
            </span>
            <el-button type="primary" text @click="cancelBatchDelete()">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="confirmBatchDelete()">
            <template #reference>
              <el-button
                v-if="
                  dynamicColumns.filter(item => item.key === 'selection')
                    .length > 0
                "
                type="danger"
                size="default"
                icon="Delete"
                text
                :disabled="tableRef?.selectionIds.length === 0"
              >
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <VeTable
          ref="tableRef"
          row-key="id"
          :data="tableData"
          :order-data="defaultOrder"
          :size="size"
          :columnFields="dynamicColumns"
          @refresh="refreshList"
        >
          <template
            v-for="t in dynamicColumns.filter(k => k.slot)"
            #[t.slot]="{ record, value }"
          >
            <slot :name="t.slot" :record="record" :value="value" />
          </template>
        </VeTable>
      </template>
    </VeTableBar>

    <!-- 添加、修改对话框 -->
    <el-dialog v-model="formVisibility" class="dialog-container">
      <template #header>
        <div style="font-weight: bold">
          {{ formTitle }}
        </div>
      </template>
      <template v-if="editEnable" #footer>
        <el-button @click="closeForm()">取消</el-button>
        <el-button type="primary" @click="submitForm(formData)">确定</el-button>
      </template>

      <slot
        name="form-component"
        :formData="formData"
        :formRules="formRules"
        :formFields="formFields"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          size="default"
        >
          <el-form-item
            v-for="item of formFields.filter(item => item.hidden !== true)"
            :key="item.field"
            :prop="item.field"
            :label="item.label + '：'"
          >
            <template v-if="item.field">
              <component :is="builderFormRender(item, formData)" />
            </template>
          </el-form-item>
        </el-form>
      </slot>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Column, ElMessage, FormInstance, FormRules } from "element-plus";
import { builderFormRender, FormField } from "@/utils/render.tsx";
import VeTable from "@/components/VeTable/Table.vue";
import VeTableBar from "@/components/VeTable/TableBar.vue";
import VeTableSearch from "@/components/VeTable/TableSearch.vue";
import cloneDeep from "lodash/cloneDeep";
import "@/style/table.scss";

const props = defineProps({
  getColumnFields: {
    type: Function as PropType<() => Column[]>,
    default: () => []
  },
  getFormFields: {
    type: Function as PropType<(row: any) => FormField[]>,
    required: true
  },
  getSearchFields: {
    type: Function as PropType<() => FormField[]>,
    required: true
  },
  handleApi: {
    type: Function as PropType<(type: string, data: any) => Promise<any>>,
    required: true
  },
  defaultOrder: {
    type: Object,
    default: () => {
      return { id: "desc" };
    }
  },
  tableTitle: {
    type: String,
    default: "表格管理"
  },
  tableName: {
    type: String,
    default: "表格"
  },
  addEnable: {
    type: Boolean,
    default: true
  },
  editEnable: {
    type: Boolean,
    default: true
  },
  statusList: {
    type: Array<StatusTag>,
    default: () => {
      return [];
    }
  }
});

// 需要包装基本类型数据，使用 ref；如果你需要包装对象，使用 reactive。
// 表格加载状态
const loading = ref(false);

// 表格结构定义
const tableRef = ref();
const tableData = ref<any[]>([]);
const tableFields = ref<Column[]>(props.getColumnFields());

/** ******** start 搜索 **********/
// 搜索表单定义
const searchRef = ref(null);
const searchData = ref<any>({});
const searchFields = ref<FormField[]>(props.getSearchFields());

/** ******** end 搜索 **********/

/** ******** start 新增、修改 表单 **********/
// 添加表单定义
const formRef = ref<FormInstance | null>(null);
const formRules: FormRules = reactive({});
const formData = ref<any>({});
const formFields = ref<FormField[]>(props.getFormFields({}));
const formVisibility = ref(false);

const formTitle = computed(() => {
  const tableName = props.tableName;
  if (formData.value.id) {
    if (props.editEnable) {
      return `修改${tableName}`;
    } else {
      return `查看${tableName}`;
    }
  } else {
    return `新增${tableName}`;
  }
});

// 打开表单
function openForm(row: any) {
  formVisibility.value = true;
  resetForm(row);
}

// 关闭表单
function closeForm() {
  formVisibility.value = false;
  // resetForm(null)
}

// 重置表单
function resetForm(row: any) {
  if (row != null) {
    formData.value = cloneDeep(row);
  } else {
    formData.value = {};
  }

  console.log("resetForm", formData.value);
  formFields.value = props.getFormFields(formData.value);
}

// 提交表单
function submitForm(row: any) {
  console.log("submitForm", row.id, formRef.value);
  formRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      if (row.id === undefined || row.id === 0) {
        onCreate(row);
      } else {
        onUpdate(row);
      }
    } else {
      console.error("表单校验不通过", fields);
    }
  });
}

/** ******** end 新增、修改 **********/

/** ******** start 批量删除 **********/

// 取消批量删除
function cancelBatchDelete() {
  tableRef?.value.getTableRef().clearSelection();
}

// 确认批量删除
function confirmBatchDelete() {
  const ids = tableRef?.value.selectionIds;
  onDeleteByIds(ids);
}

/** ******** end 批量删除 **********/

/** ******** start status menu **********/
type StatusTag = {
  value: number | string;
  label: string;
  condition: any;
};

const status = ref<any>(
  props.statusList.length > 0 ? props.statusList[0].value : 0
);

const isActive = (value: string | number) => {
  return value === status.value ? "status-menu-active" : "status-menu-normal";
};
// 选择了状态
const handleStatusCheck = (value: string | number) => {
  status.value = value;
  refreshList();
};

/** ******** start status menu **********/

function onCreate(row: any) {
  console.log("onCreate", row);
  props.handleApi("create", row).then(res => {
    ElMessage.success("创建成功");
    closeForm();
    refreshList();
  });
}

function onUpdate(row: any) {
  console.log("onUpdate", row);
  props.handleApi("update", row).then(res => {
    ElMessage.success("更新成功");
    closeForm();
    refreshList();
  });
}

function onDelete(row: any) {
  console.log("onDelete", row);
  props.handleApi("delete", row).then(res => {
    ElMessage.success("删除成功");
    refreshList();
  });
}

function onDeleteByIds(ids: number[]) {
  console.log("onDeleteByIds", ids);
  props.handleApi("deleteByIds", { ids: ids }).then(res => {
    ElMessage.success("批量删除成功");
    refreshList();
  });
}

function refreshList() {
  const searchData = searchRef.value?.getSearchData();
  const orderData = tableRef.value?.getOrderData();
  const paginationData = tableRef.value?.getPaginationData();

  // console.log("refreshList", orderData, searchData)

  const conditions: Condition[] = [];
  const sorts: Sort[] = [];

  const statusData =
    props.statusList.find(v => v.value === status.value)?.condition || {};
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

  // 搜索条件
  for (const key in searchData) {
    const item = searchFields.value.find(v => v.field === key);
    const value = searchData[key];
    conditions.push({
      field: key,
      value: value instanceof String ? value : JSON.stringify(value),
      logic: item?.searchRules.flag || "and",
      operator: item?.searchRules.rule || "="
    });
  }

  // 排序条件
  for (const key in orderData) {
    const value = orderData[key];
    sorts.push({
      field: key,
      order: value
    });
  }

  // // 默认排序条件
  // if (sorts.length == 0) {
  //   for (const key in defaultOrder) {
  //     const value = defaultOrder[key]
  //     sorts.push({
  //       field: key,
  //       order: value,
  //     })
  //   }
  // }

  const page: PageQuery = {
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    sorts: sorts,
    conditions: conditions
  };

  loading.value = true;
  props.handleApi("list", page).then(res => {
    if (res.data.page_size !== paginationData.pageSize) {
      paginationData.currentPage = res.data.page;
      if (res.data.page_size) {
        paginationData.pageSize = res.data.page_size;
      }
      // pagination.pageSize = res.data.page_size
    }

    tableData.value = res.data.list;
    paginationData.total = res.data.total;
    loading.value = false;
    // setTimeout(() => {
    //   loading.value = false
    // }, 300)
  });
}

function resetSearch() {
  searchData.value = {};
}

// 重置表格
function resetTable() {
  tableRef.value?.getTableRef().clearSort();
  tableRef.value?.getTableRef().clearSelection();
  // console.log("columns", columns.value)
}

onMounted(() => {
  resetSearch();
  resetTable();
  refreshList();
});

defineExpose({
  onCreate,
  onUpdate,
  onDelete,
  onDeleteByIds,
  refreshList,
  resetForm,
  openForm,
  closeForm,
  submitForm
});
</script>

<style lang="scss" scoped></style>
