import { getCurrentInstance, h } from "vue";
import type { Column } from "element-plus";
import { type FormField, RenderType } from "@/utils/render.tsx";
import {
  addMenuApi,
  deleteMenuApi,
  batchDeleteMenuApi,
  findMenuListApi,
  updateMenuApi
} from "@/api/menu.ts";
import { transformI18n } from "@/plugins/i18n.ts";
import { useRenderIcon } from "@/components/ReIcon/src/hooks.ts";
import type { MenuBackDTO } from "@/api/types.ts";
import { formatDate } from "@/utils/date.ts";

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

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "菜单名称",
      field: "title",
      searchRules: {
        flag: "and",
        rule: "like"
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
      width: 140,
      cellRenderer: (scope: any) => (
        <>
          <span>{transformI18n(scope.row.meta.title)}</span>
        </>
      )
    },
    {
      dataKey: "icon",
      title: "图标",
      width: 80,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <>
            <span class="inline-block mr-1">
              {h(useRenderIcon(scope.row.icon), {
                style: { paddingTop: "1px" }
              })}
            </span>
          </>
        );
      }
    },
    {
      dataKey: "rank",
      title: "排序",
      width: 80,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return <span>{scope.row.meta.rank}</span>;
      }
    },
    {
      title: "菜单类型",
      dataKey: "type",
      width: 100,
      align: align,
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
            v-model={scope.row.meta.show_link}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-value={true}
            inactive-value={false}
            onClick={() => {
              // const data = Object.assign(scope.row, {
              //   meta: JSON.stringify(scope.row.meta)
              // });

              instance.exposed.onUpdate(scope.row);
            }}
          />
        );
      }
    },
    {
      title: "创建时间",
      dataKey: "created_at",
      width: 140,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>{formatDate(scope.row.created_at)}</span>
          </div>
        );
      }
    },
    {
      title: "操作",
      dataKey: "operation",
      width: 200,
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
                let data: MenuBackDTO = {
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
              title="确定删除吗？如果是父菜单，则会一起删除子菜单。"
              onConfirm={() => {
                instance.exposed.onDelete(scope.row);
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
      return addMenuApi(data);
    case "update":
      return updateMenuApi(data);
    case "delete":
      return deleteMenuApi(data);
    case "deleteByIds":
      return batchDeleteMenuApi(data);
    case "list":
      return findMenuListApi({});
    default:
      return;
  }
}

let parentOptions = [];

findMenuListApi({}).then(res => {
  parentOptions = res.data.list;
});
// onMounted(async () => {
//   let res = await findMenuListApi({});
//   parentOptions = res.data.list;
// });

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi,
    parentOptions
  };
}
