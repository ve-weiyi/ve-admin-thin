import { getCurrentInstance } from "vue";
import type { Column } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";
import { Timer } from "@element-plus/icons-vue";

import {
  createFriendLinkApi,
  deleteFriendLinkApi,
  deleteFriendLinkListApi,
  findFriendLinkListApi,
  updateFriendLinkApi
} from "@/api/friend_link";
import type { FriendLink } from "@/api/types";

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
      key: "link_avatar",
      title: "链接头像",
      dataKey: "link_avatar",
      width: 100,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <img src={scope.row.link_avatar} width="40" height="40" />
          </div>
        );
      }
    },
    {
      key: "link_name",
      title: "链接名称",
      dataKey: "link_name",
      width: 120,
      align: align
    },
    {
      key: "link_address",
      title: "链接地址",
      dataKey: "link_address",
      width: 120,
      align: align
    },
    {
      key: "link_intro",
      title: "链接介绍",
      dataKey: "link_intro",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <div v-html={scope.row.link_intro}></div>
          </div>
        );
      }
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 170,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-icon class="table-icon">
              <Timer />
            </el-icon>
            <span>
              {new Date(scope.row.created_at * 1000).toLocaleString()}
            </span>
          </div>
        );
      }
    },
    {
      key: "operation",
      title: "操作",
      width: 160,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {
              <el-button
                type="primary"
                size="default"
                onClick={() => instance.exposed.openForm(scope.row)}
              >
                编辑
              </el-button>
            }
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => instance.exposed.onDelete(scope.row)}
            >
              {{
                reference: () => (
                  <el-button type="danger" size="default">
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
      label: "链接名称",
      field: "link_name",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    }
  ];
}

// 表单字段
function getFormFields(model: FriendLink): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "link_avatar",
      label: "链接头像"
    },
    {
      type: RenderType.Input,
      field: "link_name",
      label: "链接名称"
    },
    {
      type: RenderType.Input,
      field: "link_address",
      label: "链接地址"
    },
    {
      type: RenderType.Textarea,
      field: "link_intro",
      label: "链接介绍"
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createFriendLinkApi(data);
    case "update":
      return updateFriendLinkApi(data);
    case "delete":
      return deleteFriendLinkApi(data);
    case "deleteByIds":
      return deleteFriendLinkListApi(data);
    case "list":
      return findFriendLinkListApi(data);
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
