import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { Timer } from "@element-plus/icons-vue"

import {
  createOperationLogApi,
  deleteOperationLogByIdsApi,
  deleteOperationLogApi,
  updateOperationLogApi,
} from "@/api/operation_log"

import { findUserListApi, updateUserStatusApi } from "@/api/user"
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
      key: "avatar",
      title: "头像",
      dataKey: "avatar",
      width: 60,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <img src={scope.row.avatar} width="40" height="40" />
          </div>
        )
      },
    },
    {
      key: "nickname",
      title: "昵称",
      dataKey: "nickname",
      width: 100,
      align: align,
    },
    {
      key: "roles",
      title: "角色列表",
      dataKey: "roles",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div style={"display: flex;flex-wrap: wrap;"}>
            {scope.row.roles.map((item: any) => {
              return (
                <el-tag style={"margin-right:0.2rem;margin-top:0.2rem"}>{item.role_comment}</el-tag>
              )
            })}
          </div>
        )
      },
    },
    {
      key: "status",
      title: "状态",
      dataKey: "status",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <el-switch
            v-model={scope.row.status}
            active-value={1}
            inactive-value={0}
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            onChange={() => {
              updateUserStatusApi(scope.row).then((res) => {
                ElMessage.success("更新状态成功")
              })
            }}
          />
        )
      },
    },
    {
      key: "ip_address",
      title: "注册ip",
      dataKey: "ip_address",
      width: 0,
      align: align,
    },
    {
      key: "ip_source",
      title: "注册地址",
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
      field: "roles",
      label: "角色",
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
