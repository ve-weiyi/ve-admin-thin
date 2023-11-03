import { FormField, RenderType } from "@/utils/render"
import { Column, ElMessage } from "element-plus"
import { Timer } from "@element-plus/icons-vue"
import {
  createArticleApi,
  deleteArticleApi,
  findArticleDetailsListApi,
  updateArticleApi,
} from "@/api/article"
import { getCurrentInstance } from "vue"

const align = "center"

function getColumnFields(): Column[] {
  const instance = getCurrentInstance()
  const exposed = instance.exposed
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 100,
      align: align,
      sortable: true,
    },
    {
      key: "article_cover",
      title: "文章封面",
      dataKey: "article_cover",
      width: 120,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-image class="article-cover" src={scope.row.article_cover} />
          </div>
        )
      },
    },
    {
      key: "article_title",
      title: "标题",
      dataKey: "article_title",
      width: 0,
      align: align,
    },
    {
      key: "category_name",
      title: "分类",
      dataKey: "category_name",
      width: 0,
      align: align,
    },
    {
      key: "article_tag_list",
      title: "标签",
      dataKey: "article_tag_list",
      width: 180,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {scope.row.article_tag_list.map((item: any) => {
              return <el-tag class="table-tag">{item.tag_name}</el-tag>
            })}
          </div>
        )
      },
    },
    {
      key: "views_count",
      title: "浏览量",
      dataKey: "views_count",
      width: 0,
      align: align,
    },
    {
      key: "like_count",
      title: "点赞量",
      dataKey: "like_count",
      width: 120,
      align: align,
    },
    {
      key: "type",
      title: "路径",
      dataKey: "type",
      width: 0,
      align: align,
    },
    {
      key: "is_top",
      title: "置顶",
      dataKey: "is_top",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>
        }
        return (
          <el-switch
            v-model={scope.row.is_top}
            active-value={1}
            inactive-value={0}
            active-color="#13ce66"
            inactive-color="#888888"
            active-text="置顶"
            inactive-text="普通"
            inline-prompt
            onChange={() => {
              updateArticleApi(scope.row).then((res) => {
                ElMessage.success("更新状态成功")
              })
            }}
          />
        )
      },
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 0,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-icon class="table-icon">
              <Timer />
            </el-icon>
            <span>{new Date(scope.row.created_at).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      key: "operation",
      title: "操作",
      dataKey: "operation",
      width: 170,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-button
              class="table-text-button"
              text
              type="primary"
              size="small"
              icon="Plus"
              onClick={() => exposed.openForm(scope.row, "add")}
            >
              新增
            </el-button>
            <el-button
              class="table-text-button"
              text
              type="primary"
              size="small"
              icon="editPen"
              onClick={() => exposed.openForm(scope.row, "edit")}
            >
              修改
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => exposed.confirmDelete(scope.row.id)}
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
                ),
              }}
            </el-popconfirm>
          </div>
        )
      },
    },
  ]
}

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "文章标题",
      field: "article_title",
      searchRules: {
        flag: "and",
        rule: "like",
      },
    },
    {
      type: RenderType.Input,
      label: "文章分类",
      field: "category_name",
      searchRules: {
        flag: "and",
        rule: "=",
      },
    },
    {
      type: RenderType.Input,
      label: "文章标签",
      field: "tag_name",
      searchRules: {
        flag: "and",
        rule: "=",
      },
    },
  ]
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
          value: 1,
        },
        {
          label: "一级菜单",
          value: 0,
        },
      ],
    },
    {
      type: RenderType.Input,
      field: "name",
      label: "菜单名称",
    },
    {
      type: RenderType.Input,
      field: "icon",
      label: "菜单图标",
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "菜单路径",
    },
    {
      type: RenderType.Number,
      field: "rank",
      label: "显示排序",
      default: 1,
    },
    {
      type: RenderType.Radio,
      field: "is_hidden",
      label: "显示状态",
      default: "1",
      options: [
        {
          label: "显示",
          value: 1,
        },
        {
          label: "隐藏",
          value: 0,
        },
      ],
    },
  ]
}

function handleApi(event: string, data: any) {
  switch (event) {
    case "add":
      return createArticleApi(data)
    case "edit":
      return updateArticleApi(data)
    case "delete":
      return deleteArticleApi(data)
    case "list":
      console.log("list")
      return findArticleDetailsListApi(data)
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
