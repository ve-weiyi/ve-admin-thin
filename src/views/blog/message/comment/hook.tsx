import { getCurrentInstance } from "vue";
import { type Column, ElTag } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";
import { Timer } from "@element-plus/icons-vue";

import {
  createCommentApi,
  deleteCommentApi,
  deleteCommentByIdsApi,
  findCommentBackListApi,
  updateCommentApi
} from "@/api/comment";
import type { Comment } from "@/api/types";

const align = "center";

const options = [
  {
    value: 1,
    label: "文章"
  },
  {
    value: 2,
    label: "友链"
  },
  {
    value: 3,
    label: "说说"
  }
];

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
      key: "nickname",
      title: "评论人",
      dataKey: "nickname",
      width: 120,
      align: align
    },
    {
      key: "reply_nickname",
      title: "回复人",
      dataKey: "reply_nickname",
      width: 120,
      align: align
    },
    {
      key: "article_title",
      title: "文章标题",
      dataKey: "article_title",
      width: 160,
      align: align
    },
    {
      key: "comment_content",
      title: "评论内容",
      dataKey: "comment_content",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <div v-html={scope.row.comment_content}></div>
          </div>
        );
      }
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
      key: "type",
      title: "来源",
      dataKey: "type",
      width: 80,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>
              {scope.row.type === 1 && <ElTag>文章</ElTag>}
              {scope.row.type === 2 && <ElTag type="warning">友链</ElTag>}
              {scope.row.type === 3 && <ElTag type="danger">说说</ElTag>}
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
      type: RenderType.Select,
      label: "来源",
      field: "type",
      options: options,
      searchRules: {
        flag: "and",
        rule: "="
      }
    },
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
function getFormFields(model: Comment): FormField[] {
  return [];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createCommentApi(data);
    case "update":
      return updateCommentApi(data);
    case "delete":
      return deleteCommentApi(data);
    case "deleteByIds":
      return deleteCommentByIdsApi(data);
    case "list":
      return findCommentBackListApi(data);
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
