import { reactive, ref, computed, onMounted } from "vue"
import {
  CheckboxValueType,
  Column,
  ElMessageBox,
  FormInstance,
  FormRules,
  TableInstance,
} from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import {
  createPhotoAlbumApi,
  deletePhotoAlbumByIdsApi,
  deletePhotoAlbumApi,
  findPhotoAlbumDetailsListApi,
  updatePhotoAlbumApi,
} from "@/api/photo_album"
import { PhotoAlbumDetails } from "@/api/types"
import { FormField } from "@/utils/render"

interface Pagination {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

const defaultOrder = { id: "desc" }

function getColumnFields(): Column[] {
  return []
}

function getFormFields(formData: any): FormField[] {
  return []
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createPhotoAlbumApi(data)
    case "update":
      return updatePhotoAlbumApi(data)
    case "delete":
      return deletePhotoAlbumApi(data)
    case "deleteByIds":
      return deletePhotoAlbumByIdsApi(data)
    case "list":
      return findPhotoAlbumDetailsListApi(data)
    default:
      return
  }
}

/** 默认的分页参数 */
const defaultPaginationData: Pagination = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper",
}
const align = "center"

export function useTableHook() {
  // 表格加载状态
  const loading = ref(true)

  // 表格结构定义
  const columnFields = ref<Column[]>([])
  const checkedColumnFields = ref<Column[]>([])
  const checkAllColumns = ref(true)
  const isIndeterminate = ref(false)

  // 表格数据定义
  const tableRef = ref<TableInstance | null>(null)
  const tableData = ref<PhotoAlbumDetails[]>([])
  const pagination = reactive<Pagination>({ ...defaultPaginationData })
  const selectionIds = reactive<number[]>([])

  // 表搜素条件定义
  const searchRef = ref<FormInstance | null>(null)
  const searchFields = ref<FormField[]>()
  // 搜索条件,{k:v}
  const searchData = ref<any>({})
  // 排序条件,{k:v}
  const orderData = ref<any>({})
  // 条件查询 (key,value)
  const conditions = reactive<Condition[]>([])
  const sorts = reactive<Sort[]>([])

  function onSearchList() {
    // console.log("onSearchList", searchData.value, orderData.value)

    conditions.length = 0
    sorts.length = 0

    // 搜索条件
    for (const key in searchData.value) {
      const item = searchFields.value.find((v) => v.field === key)
      const value = searchData.value[key]
      conditions.push({
        flag: item?.searchRules.flag || "and",
        field: key,
        value: value,
        rule: item?.searchRules.rule || "=",
      })
    }

    // 排序条件
    for (const key in orderData.value) {
      const value = orderData.value[key]
      sorts.push({
        field: key,
        order: value,
      })
    }

    loading.value = true
    handleApi("list", {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sorts: sorts,
      conditions: conditions,
    }).then((res) => {
      if (res.data.page_size !== pagination.pageSize) {
        pagination.currentPage = res.data.page
        pagination.pageSize = res.data.page_size
      }

      tableData.value = res.data.list
      pagination.total = res.data.total
      loading.value = false
    })
  }

  function onCreate(row) {
    console.log("onCreate", row)
    handleApi(row, "create").then((res) => {
      ElMessage.success("创建成功")
      closeForm()
      onSearchList()
    })
  }

  function onUpdate(row) {
    console.log("onUpdate", row)
    handleApi("update", row).then((res) => {
      ElMessage.success("更新成功")
      closeForm()
      onSearchList()
    })
  }

  function onDelete(row) {
    console.log("onDelete", row)
    handleApi("delete", row.id).then((res) => {
      ElMessage.success("删除成功")
      onSearchList()
    })
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids)
    handleApi("deleteByIds", ids).then((res) => {
      ElMessage.success("批量删除成功")
      removeVisibility.value = false
      onSearchList()
    })
  }

  // 表格点击事件 查看、新增、编辑、删除、启用、停用
  type actionEvent = "add" | "edit" | "view" | "delete" | "enable" | "disable" | "submitForm"

  // function onClickAction(event: actionEvent, data: any) {
  //   console.log("onClickAction", event, data)
  //   switch (event) {
  //     case "submitForm":
  //       submitForm(data)
  //       break
  //     default:
  //       break
  //   }
  // }

  // 分页大小改变回调
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`)
    pagination.pageSize = val
    onSearchList()
  }

  // 分页回调
  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
    onSearchList()
  }

  // 批量选择回调
  function handleSelectionChange(rows: any[]) {
    console.log("handleSelectionChange", rows)
    selectionIds.length = 0
    rows.forEach((item) => {
      selectionIds.push(item.id)
    })
  }

  /** *
   * 批量排序回调
   * column是发生排序变化的列。
   * order是排序方式，有三个选项 ascending 升序、descending 降序、 null 默认排序
   * prop就是该列的prop。
   * */
  function handleSortChange({ column, prop, order }) {
    console.log("handleSortChange", prop, order)

    const value = order === "ascending" ? "asc" : "desc"
    orderData.value = Object.assign({ [prop]: value }, orderData.value)
    orderData.value[prop] = value
    onSearchList()
  }

  // 拖拽排序
  function handleDragChange(evt): void {
    console.log("handleDragItemChange: ", evt)
  }

  // 选择所有的列
  function handleCheckAllChange(val: boolean) {
    console.log("handleCheckAllChange ", val, columnFields.value)
    isIndeterminate.value = false
    checkedColumnFields.value = val ? columnFields.value : []
    columnFields.value.map((column) => (val ? (column.hidden = false) : (column.hidden = true)))
  }

  // 已选列表发送变化
  function handleCheckedColumnFieldsChange(element: any[]) {
    console.log("handleCheckedColumnFieldsChange ", element)
    checkAllColumns.value = element.length === columnFields.value.length
    isIndeterminate.value = element.length > 0 && !checkAllColumns.value
  }

  // 当前选择的列
  function handleCheckedColumnChange(val: CheckboxValueType, element: any) {
    console.log("handleCheckedColumnChange ", val, element)
    columnFields.value.filter((item) => item.title === element.title)[0].hidden = !val
  }

  // 表单数据定义
  const formFields = ref<FormField[]>([])
  const formVisibility = ref(false)
  const formStatus = ref("")

  // 表单规则定义
  const formRef = ref<FormInstance | null>(null)
  const formData = ref<any>({})
  const formRules: FormRules = reactive({})

  // 批量移除提示框
  const removeVisibility = ref(false)

  // 显示表单
  function handleFormVisibility(row: any) {
    formVisibility.value = true
    resetForm(row)
  }

  // 隐藏表单
  function closeForm() {
    formVisibility.value = false
    resetForm(null)
  }

  // 提交表单
  function submitForm(row) {
    console.log("submitForm", row)
    formRef.value?.validate((valid: boolean, fields: any) => {
      if (valid) {
        if (row.id === 0) {
          onCreate(row)
        } else {
          onUpdate(row)
        }
      } else {
        console.error("表单校验不通过", fields)
      }
    })
  }

  // 重置表单
  function resetForm(row) {
    if (row != null) {
      formData.value = row
    } else {
      formData.value = {}
    }

    // console.log("resetForm", formData.value)
    formFields.value = getFormFields(formData.value)
  }

  function resetSearch() {
    searchData.value = {}
    orderData.value = defaultOrder
    tableRef.value?.clearSort()
    tableRef.value?.clearSelection()
  }

  function resetTable() {
    checkAllColumns.value = true
    isIndeterminate.value = false
    columnFields.value = getColumnFields()
    checkedColumnFields.value = columnFields.value.filter((column) => column.hidden != true)
    // console.log("columnFields", columnFields.value)
    // console.log("checkedColumnFields", checkedColumnFields.value)
  }

  onMounted(() => {
    resetForm(null)
    resetSearch()
    resetTable()
    onSearchList()
  })

  return {
    onDelete,
    onDeleteByIds,
    onSearchList,
    handleSortChange,
    handleDragChange,
    handleCheckAllChange,
    handleCheckedColumnFieldsChange,
    handleCheckedColumnChange,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    handleFormVisibility,
    closeForm,
    submitForm,
    resetForm,
    resetSearch,
    resetTable,
    loading,
    removeVisibility,
    formVisibility,
    searchData,
    tableData,
    formData,
    pagination,
    formRef,
  }
}
