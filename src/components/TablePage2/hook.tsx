import { onMounted, reactive, ref } from "vue";
import {
  type Column,
  ElMessage,
  type FormInstance,
  type FormRules,
  type TableInstance
} from "element-plus";
import {
  defaultPaginationData,
  type FormField,
  type Pagination
} from "@/utils/render";

export function useTablePageHook<T>(
  getSearchFields: () => FormField[],
  getColumnFields: () => Column[],
  getFormFields: (formData: any) => FormField[],
  handleApi: (event: string, data: any) => any,
  defaultOrder: any = { id: "desc" }
) {
  // 表格加载状态
  const loading = ref(true);

  // 表格结构定义
  const columnFields = ref<Column[]>([]);

  // 表格数据定义
  const tableRef = ref<TableInstance | null>(null);
  const tableData = ref<T[]>([]);
  const pagination = reactive<Pagination>({ ...defaultPaginationData });
  const selectionIds = reactive<number[]>([]);

  // 表搜素条件定义
  const searchRef = ref<FormInstance | null>(null);
  const searchFields = ref<FormField[]>(getSearchFields());
  // 搜索条件,{k:v}
  const searchData = ref<any>({});
  // 排序条件,{k:v}
  const orderData = ref<any>({});
  // 条件查询 (key,value)

  const conditions = reactive<Condition[]>([]);

  const sorts = reactive<Sort[]>([]);

  function onFindList(page: PageQuery) {
    console.log("onFindList", page);
    handleApi("list", page).then(res => {
      if (res.data.page_size !== pagination.pageSize) {
        pagination.currentPage = res.data.page;
        pagination.pageSize = res.data.page_size;
      }

      tableData.value = res.data.list;
      pagination.total = res.data.total;
      loading.value = false;
    });
  }

  function onCreate(row: any) {
    console.log("onCreate", row);
    handleApi(row, "create").then(res => {
      ElMessage.success("创建成功");
      closeForm();
      refreshList();
    });
  }

  function onUpdate(row: any) {
    console.log("onUpdate", row);
    handleApi("update", row).then(res => {
      ElMessage.success("更新成功");
      closeForm();
      refreshList();
    });
  }

  function onDelete(row: any) {
    console.log("onDelete", row);
    handleApi("delete", row).then(res => {
      ElMessage.success("删除成功");
      refreshList();
    });
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids);
    handleApi("deleteByIds", { ids }).then(res => {
      ElMessage.success("批量删除成功");
      batchDeleteVisibility.value = false;
      refreshList();
    });
  }

  // 分页大小改变回调
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    refreshList();
  }

  // 分页回调
  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    refreshList();
  }

  function refreshList() {
    // console.log("refreshList", orderData, searchData)

    const search = searchData.value;
    const order = orderData.value;

    const conditions: Condition[] = [];
    const sorts: Sort[] = [];

    // 搜索条件
    for (const key in search) {
      const item = searchFields.value.find(v => v.field === key);
      const value = search[key];
      conditions.push({
        field: key,
        value: value instanceof String ? value : JSON.stringify(value),
        logic: item?.searchRules.flag || "and",
        operator: item?.searchRules.rule || "="
      });
    }

    // 排序条件
    for (const key in order) {
      const value = order[key];
      sorts.push({
        field: key,
        order: value
      });
    }

    const page: PageQuery = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sorts: sorts,
      conditions: conditions
    };

    loading.value = true;
    handleApi("list", page).then(res => {
      if (res.data.page_size !== pagination.pageSize) {
        pagination.currentPage = res.data.page;
        pagination.pageSize = res.data.page_size;
      }

      tableData.value = res.data.list;
      pagination.total = res.data.total;
      loading.value = false;
    });
  }

  function resetSearch() {
    searchData.value = {};
    orderData.value = defaultOrder;
    tableRef.value?.clearSort();
    tableRef.value?.clearSelection();
  }

  // 重置表格
  function resetTable() {
    columnFields.value = getColumnFields();
  }

  // 批量选择回调
  function handleSelectionChange(rows: any[]) {
    console.log("handleSelectionChange", rows);
    selectionIds.length = 0;
    rows.forEach(item => {
      selectionIds.push(item.id);
    });
  }

  /** *
   * 批量排序回调
   * column是发生排序变化的列。
   * order是排序方式，有三个选项 ascending 升序、descending 降序、 null 默认排序
   * prop就是该列的prop。
   * */
  function handleSortChange({ column, prop, order }) {
    console.log("handleSortChange", prop, order);

    const value = order === "ascending" ? "asc" : "desc";
    orderData.value = Object.assign({ [prop]: value }, orderData.value);
    orderData.value[prop] = value;
    refreshList();
  }

  /** ******** start 新增、修改 **********/
  // 表单数据定义
  const formFields = ref<FormField[]>([]);
  const formVisibility = ref(false);
  const formStatus = ref("");

  // 表单规则定义
  const formRef = ref<FormInstance | null>(null);
  const formData = ref<any>({});
  const formRules: FormRules = reactive({});

  // 重置表单
  function resetForm(row: any) {
    if (row != null) {
      formData.value = row;
    } else {
      formData.value = {};
    }

    // console.log("resetForm", formData.value)
    formFields.value = getFormFields(formData.value);
  }

  // 打开表单
  function openForm(row: any) {
    formVisibility.value = true;
    resetForm(row);
  }

  // 关闭表单
  function closeForm() {
    formVisibility.value = false;
    resetForm(null);
  }

  // 提交表单
  function submitForm(row: any) {
    console.log("submitForm", formRef.value);
    formRef.value?.validate((valid: boolean, fields: any) => {
      if (valid) {
        if (row.id === 0) {
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
  // 批量移除提示框
  const batchDeleteVisibility = ref(false);

  // 取消批量删除
  function cancelBatchDelete() {
    batchDeleteVisibility.value = false;
  }

  // 确认批量删除
  function confirmBatchDelete(ids: number[]) {
    batchDeleteVisibility.value = false;
    onDeleteByIds(ids);
  }

  function confirmDelete(id: number) {
    onDelete({ id });
  }

  /** ******** end 批量删除 **********/
  onMounted(() => {
    resetForm(null);
    resetSearch();
    resetTable();
    refreshList();
  });

  return {
    onFindList,
    onCreate,
    onUpdate,
    onDelete,
    onDeleteByIds,
    loading,
    pagination,
    selectionIds,
    tableRef,
    tableData,
    searchRef,
    searchData,
    refreshList,
    handleSortChange,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    resetSearch,
    resetTable,
    formRef,
    formData,
    formRules,
    formVisibility,
    resetForm,
    openForm,
    closeForm,
    submitForm,
    batchDeleteVisibility,
    confirmDelete,
    confirmBatchDelete,
    cancelBatchDelete
  };
}
