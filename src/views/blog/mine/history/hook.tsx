import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox } from "element-plus"
import { FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { ElTag } from "element-plus"
import { Timer } from "@element-plus/icons-vue"

import { findUserLoginHistoryApi } from "@/api/user"
import { LoginHistory } from "@/api/types"

const align = "center"

const options = [
  {
    value: 1,
    label: "文章",
  },
  {
    value: 2,
    label: "友链",
  },
  {
    value: 3,
    label: "说说",
  },
]
const LoginMethod = {
  0: "未知",
  1: "密码登录",
  2: "验证码登录",
  3: "第三方登录",
}

// 表格展示列信息
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
      width: 106,
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
      width: 120,
    },
    {
      key: "ip_source",
      title: "登录地址",
      dataKey: "ip_source",
      align: "center",
      width: 0,
    },
    {
      key: "agent",
      title: "代理浏览器",
      dataKey: "agent",
      align: "center",
      width: 0,
    },
    {
      key: "login_time",
      title: "最后登录时间",
      dataKey: "login_time",
      align: "center",
      width: 231,
    },
  ]
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
        rule: "=",
      },
    },
    {
      type: RenderType.Input,
      label: "用户昵称",
      field: "nickname",
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
  ]
}

// 表单字段
function getFormFields(model: LoginHistory): FormField[] {
  return []
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "list":
      return findUserLoginHistoryApi(data)
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
