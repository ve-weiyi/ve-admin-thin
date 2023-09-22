import { getCurrentInstance } from "vue"
import { Column, ElMessage } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import { Timer } from "@element-plus/icons-vue"

import {
  createApiApi,
  deleteApiApi,
  deleteApiByIdsApi,
  findApiDetailsListApi,
  updateApiApi,
} from "@/api/api"

const align = "center"

const tagType = (type) => {
  switch (type) {
    case "GET":
      return "info"
    case "POST":
      return "success"
    case "PUT":
      return "warning"
    case "DELETE":
      return "danger"
    default:
      return ""
  }
}

const methodOpt = [
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
  {
    label: "NULL",
    value: "",
  },
]

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Select,
      label: "请求方法",
      field: "method",
      options: methodOpt,
      searchRules: {
        flag: "and",
        rule: "=",
      },
    },
    {
      type: RenderType.Input,
      label: "名称",
      field: "name",
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
  ]
}

function getColumnFields(): Column[] {
  const instance = getCurrentInstance()
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
      hidden: true,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 100,
      align: align,
      sortable: true,
    },
    {
      key: "name",
      title: "名称",
      dataKey: "name",
      width: 120,
      align: align,
    },
    {
      key: "path",
      title: "路径",
      dataKey: "path",
      width: 0,
      align: align,
    },
    {
      key: "method",
      title: "方法",
      dataKey: "method",
      width: 100,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>
        }
        return <el-tag type={tagType(scope.row.method)}>{scope.row.method}</el-tag>
      },
    },
    {
      key: "traceable",
      title: "是否追溯操作",
      dataKey: "traceable",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>
        }
        return (
          <el-switch
            v-model={scope.row.traceable}
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            active-value={1}
            inactive-value={0}
            onClick={() => {
              updateApiApi(scope.row).then((res) => {
                ElMessage.success("更新状态成功")
              })
            }}
          />
        )
      },
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 0,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-icon style="margin-right: 2px">
              <Timer />
            </el-icon>
            <span>{new Date(scope.row.created_at).toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      key: "operation",
      title: "操作",
      dataKey: "operation",
      width: 150,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-button
              class="operation-button"
              text
              type="primary"
              size="small"
              icon="Plus"
              onClick={() => instance.exposed.handleFormVisibility({ parent_id: scope.row.id })}
            >
              新增
            </el-button>
            <el-button
              class="operation-button"
              text
              type="primary"
              size="small"
              icon="editPen"
              onClick={() => instance.exposed.handleFormVisibility(scope.row)}
            >
              修改
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => {
                deleteApiApi(scope.row).then((res) => {
                  ElMessage.success("删除成功")
                })
              }}
            >
              {{
                reference: () => (
                  <el-button text type="danger" size="small" class="operation-button" icon="delete">
                    删除
                  </el-button>
                ),
              }}
            </el-popconfirm>
          </div>
        )
      },
    },
  ]
}

function getFormFields(model): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "parent_id",
      label: "接口分组",
      hidden: model.parent_id === 0,
    },
    {
      type: RenderType.Input,
      field: "name",
      label: "接口名称",
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "接口路径",
    },
    {
      type: RenderType.Radio,
      field: "method",
      label: "请求方式",
      options: methodOpt,
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createApiApi(data)
    case "update":
      return updateApiApi(data)
    case "delete":
      return deleteApiApi(data)
    case "deleteByIds":
      return deleteApiByIdsApi(data)
    case "list":
      return findApiDetailsListApi(data)
    default:
      return
  }
}

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi,
  }
}
