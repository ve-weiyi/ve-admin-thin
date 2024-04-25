import { getCurrentInstance } from "vue";
import type { Column } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";
import { FixedDir } from "element-plus/es/components/table-v2/src/constants";
import { Timer } from "@element-plus/icons-vue";

import JsonViewer from "vue-json-viewer";

import {
  createOperationLogApi,
  deleteOperationLogApi,
  deleteOperationLogListApi,
  findOperationLogListApi,
  updateOperationLogApi
} from "@/api/operation_log";
import type { OperationLog } from "@/api/types";

const align = "center";

const tagType = (type: string) => {
  switch (type) {
    case "GET":
      return "";
    case "POST":
      return "success";
    case "PUT":
      return "warning";
    case "DELETE":
      return "danger";
    default:
      return "info";
  }
};

const options = [
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
      key: "opt_module",
      title: "系统模块",
      dataKey: "opt_module",
      width: 100,
      align: align
    },
    {
      key: "opt_desc",
      title: "操作描述",
      dataKey: "opt_desc",
      width: 140,
      align: align
    },
    {
      key: "request_method",
      title: "请求方式",
      dataKey: "request_method",
      width: 100,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <el-tag type={tagType(scope.row.request_method)}>
            {scope.row.request_method}
          </el-tag>
        );
      }
    },
    {
      key: "nickname",
      title: "操作人员",
      dataKey: "nickname",
      width: 140,
      align: align
    },
    {
      key: "ip_address",
      title: "登录ip",
      dataKey: "ip_address",
      width: 140,
      align: align
    },
    {
      key: "ip_source",
      title: "登录地址",
      dataKey: "ip_source",
      width: 0,
      align: align
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
      label: "系统模块",
      field: "opt_module",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    },
    {
      type: RenderType.Select,
      label: "请求方法",
      field: "opt_type",
      options: options,
      searchRules: {
        flag: "and",
        rule: "="
      }
    }
  ];
}

// 表单字段
function getFormFields(model: OperationLog): FormField[] {
  return [
    {
      field: "user_id",
      label: "用户id"
    },
    {
      field: "nickname",
      label: "操作人员"
    },
    {
      field: "ip_address",
      label: "登录ip"
    },
    {
      field: "ip_source",
      label: "操作地址",
      render(field, model) {
        if (model.ip_source == "") {
          return <div style="width: 100%">未知地址</div>;
        }
        return <div style="width: 100%">{model.ip_source}</div>;
      }
    },
    {
      field: "opt_module",
      label: "操作模块"
    },
    {
      field: "opt_desc",
      label: "操作描述"
    },
    {
      field: "request_url",
      label: "请求地址"
    },
    {
      field: "request_method",
      label: "请求方式",
      render: (field, model) => {
        return (
          <el-tag type={tagType(model.request_method)}>
            {model.request_method}
          </el-tag>
        );
      }
    },
    {
      field: "request_data",
      label: "请求参数",
      render: (field, model) => {
        return (
          <JsonViewer
            value={JSON.parse(model.request_data)}
            copyable
            boxed
            expanded
          />
        );
      }
    },
    {
      field: "response_data",
      label: "返回数据",
      render: (field, model) => {
        return (
          <JsonViewer
            value={JSON.parse(model.response_data)}
            copyable
            boxed
            expanded
          />
        );
      }
    },
    {
      field: "response_status",
      label: "状态码"
    },
    {
      field: "cost",
      label: "响应耗时"
    },
    {
      field: "created_at",
      label: "操作日期",
      render: (field, model) => {
        return <span>{new Date(model.created_at).toLocaleString()}</span>;
      }
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createOperationLogApi(data);
    case "update":
      return updateOperationLogApi(data);
    case "delete":
      return deleteOperationLogApi(data);
    case "deleteByIds":
      return deleteOperationLogListApi(data);
    case "list":
      return findOperationLogListApi(data);
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
