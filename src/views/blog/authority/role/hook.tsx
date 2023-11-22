import { Column } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import {
  createRoleApi,
  deleteRoleApi,
  deleteRoleByIdsApi,
  findRoleDetailsListApi,
  updateRoleApi,
} from "@/api/role"

import { Timer } from "@element-plus/icons-vue"

const align = "center"

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
      type: RenderType.Input,
      label: "角色名称",
      field: "role_name",
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
    {
      type: RenderType.Select,
      label: "权限范围",
      field: "role_domain",
      options: methodOpt,
      searchRules: {
        flag: "and",
        rule: "=",
      },
    },
    {
      type: RenderType.Select,
      label: "权限标签",
      field: "role_comment",
      options: methodOpt,
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
  ]
}

function getColumnFields(): Column[] {
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
      key: "role_name",
      title: "角色名称",
      dataKey: "role_name",
      width: 120,
      align: align,
    },
    {
      key: "role_domain",
      title: "角色范围",
      dataKey: "role_domain",
      width: 0,
      align: align,
    },
    {
      key: "role_comment",
      title: "角色标签",
      dataKey: "role_comment",
      width: 80,
      align: align,
      sortable: true,
    },
    {
      key: "is_disable",
      title: "是否启用",
      dataKey: "is_disable",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>
        }
        return (
          <el-switch
            v-model={scope.row.is_disable}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-value={1}
            inactive-value={0}
            onClick={() => {}}
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
            <el-icon class="table-icon">
              <Timer />
            </el-icon>
            <span>{new Date(scope.row.created_at).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      key: "operation",
      title: "操作",
      dataKey: "operation",
      width: 160,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-button
              class="table-text-button"
              text
              type="primary"
              size="small"
              icon="Plus"
              onClick={() => {}}
            >
              新增
            </el-button>
            <el-button
              class="table-text-button"
              text
              type="primary"
              size="small"
              icon="editPen"
              onClick={() => {}}
            >
              修改
            </el-button>
            <el-popconfirm title="确定删除吗？" onConfirm={() => {}}>
              {{
                reference: () => (
                  <el-button
                    text
                    type="danger"
                    size="small"
                    class="table-text-button"
                    icon="delete"
                  >
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

function getFormFields(row: any): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "role_name",
      label: "角色名称",
    },
    {
      type: RenderType.Input,
      field: "role_domain",
      label: "权限访问",
    },
    {
      type: RenderType.Input,
      field: "role_comment",
      label: "角色标签",
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createRoleApi(data)
    case "update":
      return updateRoleApi(data)
    case "delete":
      return deleteRoleApi(data)
    case "deleteByIds":
      return deleteRoleByIdsApi(data)
    case "list":
      return findRoleDetailsListApi(data)
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
