import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { Timer } from "@element-plus/icons-vue"

import {
  createOperationLogApi,
  deleteOperationLogByIdsApi,
  deleteOperationLogApi,
  updateOperationLogApi,
} from "@/api/operation_log"

import { findUserListApi } from "@/api/user"
import { OperationLog } from "@/api/types"

const align = "center"

const tagType = (type) => {
  switch (type) {
    case "GET":
      return ""
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

const options = [
  {
    value: "新增",
    label: "新增",
  },
  {
    value: "修改",
    label: "修改",
  },
  {
    value: "删除",
    label: "删除",
  },
  {
    value: "查询",
    label: "查询",
  },
  {
    value: "新增或修改",
    label: "新增或修改",
  },
]

// 表格展示列信息
function getColumnFields(): Column[] {
  const instance = getCurrentInstance()
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 70,
      align: align,
      sortable: true,
    },
    {
      key: "opt_module",
      title: "系统模块",
      dataKey: "opt_module",
      width: 100,
      align: align,
    },
    {
      key: "opt_type",
      title: "操作类型",
      dataKey: "opt_type",
      width: 100,
      align: align,
    },
    {
      key: "opt_desc",
      title: "操作描述",
      dataKey: "opt_desc",
      width: 140,
      align: align,
    },
    {
      key: "request_method",
      title: "请求方式",
      dataKey: "request_method",
      width: 100,
      align: align,
      cellRenderer: (scope: any) => {
        return <el-tag type={tagType(scope.row.request_method)}>{scope.row.request_method}</el-tag>
      },
    },
    {
      key: "nickname",
      title: "操作人员",
      dataKey: "nickname",
      width: 140,
      align: align,
    },
    {
      key: "ip_address",
      title: "登录ip",
      dataKey: "ip_address",
      width: 140,
      align: align,
    },
    {
      key: "ip_source",
      title: "登录地址",
      dataKey: "ip_source",
      width: 0,
      align: align,
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
      width: 150,
      align: align,
      fixed: FixedDir.RIGHT,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-button
              text
              type="primary"
              size="small"
              icon="view"
              onClick={() => instance.exposed.handleFormVisibility(scope.row)}
            >
              查看
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => instance.exposed.onDelete(scope.row)}
            >
              {{
                reference: () => (
                  <el-button text type="danger" size="small" icon="delete">
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

// 搜索条件
function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "系统模块",
      field: "opt_module",
      flag: "and",
      rule: "like",
    },
    {
      type: RenderType.Select,
      label: "操作类型",
      field: "opt_type",
      flag: "and",
      rule: "=",
      options: options,
    },
  ]
}

// 表单字段
function getFormFields(model: OperationLog): FormField[] {
  return [
    {
      field: "opt_module",
      label: "操作模块",
    },
    {
      field: "opt_desc",
      label: "操作描述",
    },
    {
      field: "request_url",
      label: "请求地址",
    },
    {
      field: "request_method",
      label: "请求方式",
      render: (field, model) => {
        return <el-tag type={tagType(model.request_method)}>{model.request_method}</el-tag>
      },
    },
    {
      field: "opt_method",
      label: "操作方法",
    },
    {
      field: "request_param",
      label: "请求参数",
    },
    {
      field: "response_data",
      label: "返回数据",
    },
    {
      field: "nickname",
      label: "操作人员",
    },
    {
      field: "created_at",
      label: "操作日期",
      render: (field, model) => {
        return <span>{new Date(model.created_at).toLocaleString()}</span>
      },
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createOperationLogApi(data)
    case "update":
      return updateOperationLogApi(data)
    case "delete":
      return deleteOperationLogApi(data)
    case "deleteByIds":
      return deleteOperationLogByIdsApi(data)
    case "list":
      return findUserListApi(data)
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
