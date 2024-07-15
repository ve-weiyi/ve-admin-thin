import { type Column, ElMessage } from "element-plus";
import { type FormField, RenderType } from "@/utils/render.tsx";
import {
  createRoleApi,
  deleteRoleApi,
  deleteRoleListApi,
  findRoleListApi,
  updateRoleApi
} from "@/api/role.ts";
import { getCurrentInstance } from "vue";
import { FixedDir } from "element-plus/es/components/table-v2/src/constants";
import { formatDate } from "@/utils/formatDate.ts";

const align = "center";

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "角色标识",
      field: "role_key",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    },
    {
      type: RenderType.Input,
      label: "角色名称",
      field: "role_name",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    },
    {
      type: RenderType.Select,
      label: "角色状态",
      field: "is_disable",
      searchRules: {
        flag: "and",
        rule: "="
      },
      options: [
        { label: "已启用", value: 0 },
        { label: "已禁用", value: 1 }
      ]
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
      align: align
    },
    {
      title: "角色标识",
      dataKey: "role_name",
      width: 120,
      align: align
    },
    {
      title: "角色名称",
      dataKey: "role_name",
      width: 120,
      align: align
    },
    {
      title: "角色备注",
      dataKey: "role_comment",
      width: 0,
      align: align,
      sortable: true
    },
    {
      title: "状态",
      dataKey: "is_disable",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>;
        }
        return (
          <el-switch
            v-model={scope.row.is_disable}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-value={0}
            inactive-value={1}
            active-text="已启用"
            inactive-text="已禁用"
            inline-prompt
            onClick={() => {
              updateRoleApi(scope.row).then(res => {
                ElMessage.success("更新成功");
              });
            }}
          />
        );
      }
    },
    {
      title: "是否默认",
      dataKey: "is_default",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>;
        }
        return (
          <el-switch
            v-model={scope.row.is_default}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-value={1}
            inactive-value={0}
            active-text="默认"
            inactive-text="非默认"
            inline-prompt
            onClick={() => {
              updateRoleApi(scope.row).then(res => {
                ElMessage.success("更新成功");
              });
            }}
          />
        );
      }
    },
    {
      title: "创建时间",
      dataKey: "created_at",
      width: 140,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>
              <span>{formatDate(scope.row.created_at)}</span>
            </span>
          </div>
        );
      }
    },
    {
      title: "操作",
      dataKey: "operation",
      width: 200,
      align: align,
      fixed: FixedDir.RIGHT,
      slot: "operation"
      // cellRenderer: (scope: any) => {
      //   return (
      //     <div>
      //       <el-button
      //         class="table-text-button"
      //         text
      //         type="primary"
      //         size="small"
      //         icon="editPen"
      //         // onClick={() => openDrawer(scope.row)}
      //       >
      //         重置权限
      //       </el-button>
      //       <el-button
      //         class="table-text-button"
      //         text
      //         type="primary"
      //         size="small"
      //         icon="editPen"
      //         onClick={() => instance.exposed.openForm(scope.row)}
      //       >
      //         修改
      //       </el-button>
      //       <el-popconfirm
      //         title="确定删除吗？"
      //         onConfirm={() => {
      //           deleteRoleApi({
      //             id: scope.row.id
      //           }).then(res => {
      //             ElMessage.success("删除成功");
      //             instance.exposed.refreshList();
      //           });
      //         }}
      //       >
      //         {{
      //           reference: () => (
      //             <el-button
      //               text
      //               type="danger"
      //               size="small"
      //               class="table-text-button"
      //               icon="delete"
      //             >
      //               删除
      //             </el-button>
      //           )
      //         }}
      //       </el-popconfirm>
      //     </div>
      //   );
      // }
    }
  ];
}

function getFormFields(row: any): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "role_key",
      label: "角色标识"
    },
    {
      type: RenderType.Input,
      field: "role_name",
      label: "角色名称"
    },
    {
      type: RenderType.Input,
      field: "role_comment",
      label: "角色标签"
    },
    {
      type: RenderType.Radio,
      field: "is_disable",
      label: "是否禁用",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 }
      ]
    },
    {
      type: RenderType.Radio,
      field: "is_default",
      label: "是否默认",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 }
      ]
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createRoleApi(data);
    case "update":
      return updateRoleApi(data);
    case "delete":
      return deleteRoleApi(data);
    case "deleteByIds":
      return deleteRoleListApi(data);
    case "list":
      return findRoleListApi(data);
    default:
      return;
  }
}

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi
  };
}
