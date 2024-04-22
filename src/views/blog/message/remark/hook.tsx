import { getCurrentInstance } from "vue";
import { type Column, ElTag } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";
import { Timer } from "@element-plus/icons-vue";

import {
  createRemarkApi,
  deleteRemarkApi,
  deleteRemarkByIdsApi,
  findRemarkListApi,
  updateRemarkApi
} from "@/api/remark";
import type { Remark } from "@/api/types";

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
      width: 80,
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
      key: "message_content",
      title: "留言内容",
      dataKey: "message_content",
      width: 140,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <div v-html={scope.row.message_content}></div>
          </div>
        );
      }
    },
    {
      key: "ip_address",
      title: "IP地址",
      dataKey: "ip_address",
      width: 140,
      align: align
    },
    {
      key: "ip_source",
      title: "IP来源",
      dataKey: "ip_source",
      width: 0,
      align: align
    },
    {
      key: "is_review",
      title: "状态",
      dataKey: "is_review",
      width: 80,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>
              {scope.row.is_review === 1 && <ElTag type="success">正常</ElTag>}
              {scope.row.is_review === 0 && (
                <ElTag type="warning">审核中</ElTag>
              )}
            </span>
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
            <span>{new Date(scope.row.created_at).toLocaleString()}</span>
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
            {scope.row.is_review === 0 && (
              <el-button
                type="success"
                size="default"
                onClick={() => instance.exposed.openForm(scope.row)}
              >
                通过
              </el-button>
            )}
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
function getFormFields(model: Remark): FormField[] {
  return [];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createRemarkApi(data);
    case "update":
      return updateRemarkApi(data);
    case "delete":
      return deleteRemarkApi(data);
    case "deleteByIds":
      return deleteRemarkByIdsApi(data);
    case "list":
      return findRemarkListApi(data);
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
