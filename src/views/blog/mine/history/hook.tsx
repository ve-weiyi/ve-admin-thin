import { getCurrentInstance } from "vue";
import { type Column, ElMessage } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";

import { findUserLoginHistoryListApi } from "@/api/account";
import type { UserLoginHistory } from "@/api/types";

const align = "center";

const loginOption = [
  {
    value: "email",
    label: "邮箱"
  },
  {
    value: "phone",
    label: "手机号"
  },
  {
    value: "oauth",
    label: "第三方登录"
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
    // {
    //   key: "id",
    //   title: "id",
    //   dataKey: "id",
    //   width: 70,
    //   align: align,
    //   sortable: true,
    // },
    {
      key: "login_type",
      title: "登录方式",
      dataKey: "login_type",
      align: "center",
      width: 106
      // cellRenderer: (scope: any): any => {
      //   const { rowData } = scope
      //   return `<div>{LoginMethod[rowData.login_type]}</div>`
      // },
    },
    {
      key: "ip_address",
      title: "登录IP",
      dataKey: "ip_address",
      align: "center",
      width: 120
    },
    {
      key: "ip_source",
      title: "登录地址",
      dataKey: "ip_source",
      align: "center",
      width: 0
    },
    {
      key: "agent",
      title: "代理浏览器",
      dataKey: "agent",
      align: "center",
      width: 0
    },
    {
      key: "login_time",
      title: "最后登录时间",
      dataKey: "login_time",
      align: "center",
      width: 231
    }
  ];
}

// 搜索条件
function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Select,
      label: "登录方式",
      field: "login_type",
      options: loginOption,
      searchRules: {
        flag: "and",
        rule: "="
      }
    },
    {
      type: RenderType.Input,
      label: "登录ip",
      field: "ip_address",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    }
  ];
}

// 表单字段
function getFormFields(model: UserLoginHistory): FormField[] {
  return [];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "list":
      return findUserLoginHistoryListApi(data);
    case "deleteByIds":
      return;
    default:
      ElMessage.error("未知事件");
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
