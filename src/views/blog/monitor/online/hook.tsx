import { getCurrentInstance } from "vue";
import { type Column, ElMessage } from "element-plus";
import { type FormField, RenderType } from "@/utils/render.tsx";
import { FixedDir } from "element-plus/es/components/table-v2/src/constants";

import { findOnlineUserListApi, updateUserStatusApi } from "@/api/account.ts";
import { formatDate } from "@/utils/formatDate.ts";

const align = "center";

// 表格展示列信息
function getColumnFields(): Column[] {
  const instance = getCurrentInstance();
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 70,
      align: align,
      sortable: true
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
        );
      }
    },
    {
      key: "nickname",
      title: "昵称",
      dataKey: "nickname",
      width: 100,
      align: align
    },
    {
      key: "roles",
      title: "角色列表",
      dataKey: "roles",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {scope.row.roles.map((item: any) => {
              return <el-tag class="table-tag">{item.role_comment}</el-tag>;
            })}
          </div>
        );
      }
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
            inactive-color="#cccccc"
            active-text="禁用"
            inactive-text="正常"
            inline-prompt
            onChange={() => {
              updateUserStatusApi(scope.row).then(res => {
                ElMessage.success("更新状态成功");
              });
            }}
          />
        );
      }
    },
    {
      key: "ip_address",
      title: "注册ip",
      dataKey: "ip_address",
      width: 0,
      align: align
    },
    {
      key: "ip_source",
      title: "注册地址",
      dataKey: "ip_source",
      width: 0,
      align: align
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 120,
      align: align,
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
              class="table-text-button"
              type="primary"
              size="small"
              icon="view"
              onClick={() => instance.exposed.openForm(scope.row)}
            >
              查看
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => instance.exposed.onDelete(scope.row)}
            >
              {{
                reference: () => (
                  <el-button
                    text
                    class="table-text-button"
                    type="danger"
                    size="small"
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

// 搜索条件
function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "用户昵称",
      field: "nickname",

      searchRules: {
        flag: "and",
        rule: "like"
      }
    }
  ];
}

// 表单字段
function getFormFields(): FormField[] {
  return [
    {
      field: "roles",
      label: "角色"
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return null;
    case "update":
      return null;
    case "delete":
      return null;
    case "deleteByIds":
      return null;
    case "list":
      return findOnlineUserListApi(data);
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
