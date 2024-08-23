<template>
  <div>
    <!-- 表格搜索条件 -->
    <VeTableSearch
      ref="searchRef"
      v-model="searchData"
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
        <slot name="table-top" />

        <!-- 批量选择提示 -->
        <div
          v-if="selectionIds.length > 0"
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectionIds.length }} 项
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
                :disabled="selectionIds.length === 0"
              >
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </div>

        <!-- 表格 -->
        <VeTable
          ref="tableRef"
          v-model="orderData"
          v-model:selection-ids="selectionIds"
          row-key="id"
          :data="tableData"
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

        <!-- 分页 -->
        <VeTablePagination
          v-if="pageData.total > 0"
          v-model="pageData"
          @pagination="refreshList"
        />
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
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { Column, ElMessage, FormInstance, FormRules } from "element-plus";
import { builderFormRender, FormField } from "@/utils/render.tsx";
import VeTable from "@/components/VeTable/Table.vue";
import VeTableBar from "@/components/VeTable/TableBar.vue";
import VeTableSearch from "@/components/VeTable/TableSearch.vue";
import VeTablePagination from "@/components/VeTable/TablePagination.vue";
import cloneDeep from "lodash/cloneDeep";
import "@/style/table.scss";

const data = reactive({
  selectionIds: [],
  pageData: {
    currentPage: 1,
    pageSize: 10,
    total: 20
  },
  searchData: {} as any,
  orderData: {} as any,
  tableData: [],
  formData: {} as any
});

const { selectionIds, pageData, searchData, orderData, tableData, formData } =
  toRefs(data);

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
  }
});

// 需要包装基本类型数据，使用 ref；如果你需要包装对象，使用 reactive。
// 表格加载状态
const loading = ref(false);

// 表格结构定义
const tableRef = ref();
const tableFields = ref<Column[]>(props.getColumnFields());

// 搜索表单定义
const searchRef = ref();
const searchFields = ref<FormField[]>(props.getSearchFields());

/** ******** api 操作 **********/
async function refreshList(query?: PageQuery): Promise<any> {
  // const search = searchData.value;
  // const order = tableRef.value?.getOrderData();
  // const pagination = tableRef.value?.getPaginationData();

  console.log("refreshList", query);

  const conditions: Condition[] = query?.conditions || [];
  const sorts: Sort[] = query?.sorts || [];
  const q = {};

  // 搜索条件
  for (const key in searchData.value) {
    const item = searchFields.value.find(v => v.field === key);
    const value = searchData.value[key];
    q[key] = value;
    // if (value === "") {
    //   continue;
    // }
    // conditions.push({
    //   field: key,
    //   value: value instanceof String ? value : JSON.stringify(value),
    //   logic: item?.searchRules.flag || "and",
    //   operator: item?.searchRules.rule || "="
    // });
  }

  // 排序条件
  for (const key in orderData.value) {
    const value = orderData.value[key];
    sorts.push({
      field: key,
      order: value
    });
  }

  let page: PageQuery = {
    page: pageData.value.currentPage,
    page_size: pageData.value.pageSize,
    sorts: sorts
  };

  page = Object.assign(page, q);

  loading.value = true;
  return props.handleApi("list", page).then(res => {
    if (
      res.data.page_size !== 0 &&
      res.data.page_size !== pageData.value.pageSize
    ) {
      pageData.value.currentPage = res.data.page;
      pageData.value.pageSize = res.data.page_size;
    }

    tableData.value = res.data.list;
    pageData.value.total = res.data.total;
    loading.value = false;
    // setTimeout(() => {
    //   loading.value = false
    // }, 300)
  });
}

async function onCreate(row: any): Promise<any> {
  console.log("onCreate", row);
  return props.handleApi("create", row).then(res => {
    ElMessage.success("创建成功");
    refreshList();
  });
}

async function onUpdate(row: any): Promise<any> {
  console.log("onUpdate", row);
  return props.handleApi("update", row).then(res => {
    ElMessage.success("更新成功");
    refreshList();
  });
}

async function onDelete(row: any): Promise<any> {
  console.log("onDelete", row);
  return props.handleApi("delete", row).then(res => {
    ElMessage.success("删除成功");
    refreshList();
  });
}

async function onDeleteByIds(ids: number[]): Promise<any> {
  console.log("onDeleteByIds", ids);
  return props.handleApi("deleteByIds", { ids: ids }).then(res => {
    ElMessage.success("批量删除成功");
    refreshList();
  });
}

/** ******** 新增、修改 表单 **********/
// 添加表单定义
const formRef = ref<FormInstance | null>(null);
const formRules: FormRules = reactive({});
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
        onCreate(row).then(() => {
          closeForm();
        });
      } else {
        onUpdate(row).then(() => {
          closeForm();
        });
      }
    } else {
      console.error("表单校验不通过", fields);
    }
  });
}

/** ******** 批量删除 **********/

// 取消批量删除
function cancelBatchDelete() {
  tableRef?.value.getTableRef().clearSelection();
}

// 确认批量删除
function confirmBatchDelete() {
  const ids = tableRef?.value.selectionIds;
  onDeleteByIds(ids);
}

function resetSearch() {
  searchRef.value?.clearSearch();
}

// 重置表格
function resetTable() {
  tableRef.value?.getTableRef().clearSort();
  tableRef.value?.getTableRef().clearSelection();
  // console.log("columns", columns.value)
}

onMounted(() => {
  orderData.value = props.defaultOrder;
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
  openForm,
  closeForm,
  resetForm,
  submitForm
});
</script>

<style lang="scss" scoped></style>
