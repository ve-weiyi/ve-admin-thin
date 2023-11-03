import { getCurrentInstance, h, resolveDynamicComponent } from "vue"
import { Column } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import {
  createMenuApi,
  deleteMenuApi,
  deleteMenuByIdsApi,
  findMenuDetailsListApi,
  updateMenuApi,
} from "@/api/menu"
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
      label: "名称",
      field: "name",
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
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
      key: "icon",
      title: "图标",
      dataKey: "icon",
      width: 0,
      align: "left",
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-icon class="table-icon">
              {" "}
              {h(resolveDynamicComponent(scope.row.icon) as string)}{" "}
            </el-icon>
            {scope.row.icon}
          </div>
        )
      },
    },
    {
      key: "rank",
      title: "排序",
      dataKey: "rank",
      width: 80,
      align: align,
      sortable: true,
    },
    {
      key: "path",
      title: "路径",
      dataKey: "path",
      width: 0,
      align: align,
    },
    {
      key: "is_hidden",
      title: "隐藏",
      dataKey: "is_hidden",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>
        }
        return (
          <el-switch
            v-model={scope.row.is_hidden}
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            active-value={1}
            inactive-value={0}
            onClick={() => {
              instance.exposed.onUpdate(scope.row)
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
              text
              class="table-text-button"
              type="primary"
              size="small"
              icon="Plus"
              onClick={() => {
                instance.exposed.openForm(null)
              }}
            >
              新增
            </el-button>
            <el-button
              text
              class="table-text-button"
              type="primary"
              size="small"
              icon="editPen"
              onClick={() => {
                instance.exposed.openForm(scope.row)
              }}
            >
              修改
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => {
                instance.exposed.confirmDelete(scope.row.id)
              }}
            >
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
      type: RenderType.Radio,
      field: "name",
      label: "菜单类型",
      default: "目录",
      options: [
        {
          label: "目录",
          value: 1,
        },
        {
          label: "一级菜单",
          value: 0,
        },
      ],
    },
    {
      type: RenderType.Input,
      field: "name",
      label: "菜单名称",
    },
    {
      type: RenderType.Input,
      field: "icon",
      label: "菜单图标",
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "菜单路径",
    },
    {
      type: RenderType.Number,
      field: "rank",
      label: "显示排序",
      default: 1,
    },
    {
      type: RenderType.Radio,
      field: "is_hidden",
      label: "显示状态",
      default: "1",
      options: [
        {
          label: "显示",
          value: 1,
        },
        {
          label: "隐藏",
          value: 0,
        },
      ],
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createMenuApi(data)
    case "update":
      return updateMenuApi(data)
    case "delete":
      return deleteMenuApi(data)
    case "deleteByIds":
      return deleteMenuByIdsApi(data)
    case "list":
      return findMenuDetailsListApi(data)
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
