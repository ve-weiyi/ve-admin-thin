import { VNode } from "vue"
import { FormRules } from "element-plus"

/** 表格分页参数 */
export interface Pagination {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 默认的分页参数 */
export const defaultPaginationData: Pagination = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper",
}

// 表单字段类型
export enum RenderType {
  Textarea = "textarea",
  Input = "input",
  Select = "select",
  Tag = "tag",
  Radio = "radio",
  Number = "number",
  MultiSelect = "multi-select",
}

/** 搜索校验规则 */
interface SearchRules {
  field?: string
  rule?: "like" | "=" | ">" | "<" | string
  flag?: string
}

// 表单字段定义
export interface FormField {
  /** 表单类型 */
  type?: RenderType
  /** 自定义渲染方法 */
  render?: (field: FormField, model: any) => VNode

  /** 字段展示名称 name */
  label: string
  /** 字段名称 key */
  field: string
  /** 字段默认值 */
  default?: any
  /** 是否隐藏表单项 */
  hidden?: boolean
  /** 提示信息 */
  placeholder?: string
  /** 可选项 */
  options?: Option[]

  /** 表单校验规则 */
  formRules?: FormRules
  /** 列表搜索规则 */
  searchRules?: SearchRules
}

// 表单字段的选项
interface Option {
  // 展示的标签
  label: string
  // 选择后的值，也做key使用
  value: string | number
}

export function builderFormRender(field: FormField, model: any): VNode {
  if (field.render) {
    return field.render(field, model)
  }

  return formRender(field, model)
}

export function formRender(field: FormField, model: any): VNode {
  switch (field.type) {
    case RenderType.Input:
      return (
        <el-input v-model={model[field.field]} clearable placeholder={`请输入${field.label}`} />
      )
    case RenderType.Textarea:
      return (
        <el-input
          v-model={model[field.field]}
          type="textarea"
          placeholder={`请输入${field.label}`}
        />
      )
    case RenderType.Select:
      return (
        <el-select v-model={model[field.field]} placeholder={`请选择${field.label}`}>
          {field.options.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    case RenderType.MultiSelect:
      return (
        <el-select
          v-model={model[field.field]}
          placeholder={`请选择${field.label}`}
          multiple
          clearable
          style={"width: 90%"}
        >
          {field.options.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    case RenderType.Tag:
      return <el-tag type={model[field.field]}>{model[field.field]}</el-tag>
    case RenderType.Radio:
      return (
        <el-radio-group v-model={model[field.field]}>
          {field.options.map((item) => (
            <el-radio key={item.value} label={item.value} value={item.value}>
              {item.label}
            </el-radio>
          ))}
        </el-radio-group>
      )
    case RenderType.Number:
      return (
        <el-input-number
          v-model={model[field.field]}
          model-value={field.default}
          controls-position="right"
          placeholder={`${field.label}`}
        />
      )
    default:
      return <div style="width: 100%">{model[field.field]}</div>
  }
}
