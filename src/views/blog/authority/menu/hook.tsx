import { getCurrentInstance, h } from "vue";
import type { Column } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";
import {
  createMenuApi,
  deleteMenuApi,
  deleteMenuListApi,
  findMenuListApi,
  updateMenuApi
} from "@/api/menu";
import { transformI18n } from "@/plugins/i18n.ts";
import { useRenderIcon } from "@/components/ReIcon/src/hooks.ts";
import type { MenuDetailsDTO } from "@/api/types.ts";

const align = "center";

const getMenuType = (type, text = false) => {
  switch (type) {
    case 0:
      return text ? "菜单" : "primary";
    case 1:
      return text ? "iframe" : "warning";
    case 2:
      return text ? "外链" : "danger";
    case 3:
      return text ? "按钮" : "info";
  }
};

const methodOpt = [
  {
    label: "GET",
    value: "GET"
  },
  {
    label: "POST",
    value: "POST"
  },
  {
    label: "PUT",
    value: "PUT"
  },
  {
    label: "DELETE",
    value: "DELETE"
  },
  {
    label: "NULL",
    value: ""
  }
];

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "名称",
      field: "name",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    },
    {
      type: RenderType.Select,
      label: "请求方法",
      field: "method",
      options: methodOpt,
      searchRules: {
        flag: "and",
        rule: "="
      }
    }
  ];
}

function getColumnFields(): Column[] {
  const instance = getCurrentInstance();
  return [
    {
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
      hidden: true
    },
    {
      title: "id",
      dataKey: "id",
      width: 100,
      align: align,
      hidden: true,
      sortable: true
    },
    {
      title: "菜单名称",
      dataKey: "title",
      align: "left",
      width: 0,
      cellRenderer: (scope: any) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(scope.row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{transformI18n(scope.row.title)}</span>
        </>
      )
    },
    {
      title: "菜单类型",
      dataKey: "type",
      width: 100,
      cellRenderer: (scope: any) => (
        <el-tag
          size={"default"}
          type={getMenuType(scope.row.type)}
          effect="plain"
        >
          {getMenuType(scope.row.type, true)}
        </el-tag>
      )
    },
    {
      dataKey: "path",
      title: "路由路径",
      width: 0
    },
    // {
    //   key: "component",
    //   title: "路由组件",
    //   dataKey: "component",
    //   width: 120,
    // },
    {
      dataKey: "rank",
      title: "排序",
      width: 80,
      sortable: true,
      cellRenderer: (scope: any) => {
        return <span>{scope.row.meta.rank}</span>;
      }
    },
    {
      dataKey: "show_link",
      title: "显示",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>;
        }
        return (
          <el-switch
            v-model={scope.row.meta.showLink}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-value={true}
            inactive-value={false}
            onClick={() => {
              const data = Object.assign(scope.row, {
                meta: JSON.stringify(scope.row.meta)
              });

              instance.exposed.onUpdate(data);
            }}
          />
        );
      }
    },
    {
      title: "创建时间",
      dataKey: "created_at",
      width: 0,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>{new Date(scope.row.created_at).toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      title: "操作",
      dataKey: "operation",
      width: 160,
      align: align,
      slot: "",
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
                let data: MenuDetailsDTO = {
                  id: 0,
                  type: 0,
                  parent_id: scope.row.id,
                  meta: {
                    transition: {}
                  }
                };
                instance.exposed.openForm(data);
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
                instance.exposed.openForm(scope.row);
              }}
            >
              修改
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => {
                instance.exposed.confirmDelete(scope.row.id);
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
                )
              }}
            </el-popconfirm>
          </div>
        );
      }
    }
  ];
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
          value: 1
        },
        {
          label: "一级菜单",
          value: 0
        }
      ]
    },
    {
      type: RenderType.Input,
      field: "name",
      label: "菜单名称"
    },
    {
      type: RenderType.Input,
      field: "title",
      label: "菜单标题"
    },
    {
      type: RenderType.Input,
      field: "icon",
      label: "菜单图标"
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "菜单路径"
    },
    {
      type: RenderType.Number,
      field: "rank",
      label: "显示排序",
      default: 1
    },
    {
      type: RenderType.Radio,
      field: "is_hidden",
      label: "显示状态",
      default: "1",
      options: [
        {
          label: "显示",
          value: 1
        },
        {
          label: "隐藏",
          value: 0
        }
      ]
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createMenuApi(data);
    case "update":
      return updateMenuApi(data);
    case "delete":
      return deleteMenuApi(data);
    case "deleteByIds":
      return deleteMenuListApi(data);
    case "list":
      return findMenuListApi(data);
    default:
      return;
  }
}

let res = await findMenuListApi({});
let parentOptions = res.data.list;

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi,
    parentOptions
  };
}
