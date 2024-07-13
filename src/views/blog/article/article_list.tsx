import { type FormField, RenderType } from "@/utils/render";
import { type Column, ElMessage } from "element-plus";
import {
  deleteArticleApi,
  findArticleListApi,
  recycleArticleApi,
  topArticleApi
} from "@/api/article";
import { getCurrentInstance } from "vue";
import { formatDate } from "@/utils/formatDate.ts";
import router from "@/router";

const align = "center";

const typeOptions = (type: number) => {
  switch (type) {
    case 1:
      return { value: "success", label: "原创" };
    case 2:
      return { value: "warning", label: "转载" };
    case 3:
      return { value: "danger", label: "翻译" };
    default:
      return { value: "info", label: "未知" };
  }
};

function getColumnFields(): Column[] {
  const instance = getCurrentInstance();
  return [
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 100,
      align: align,
      sortable: true
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
        );
      }
    },
    {
      key: "article_title",
      title: "标题",
      dataKey: "article_title",
      width: 0,
      align: align
    },
    {
      key: "category_name",
      title: "分类",
      dataKey: "category_name",
      width: 90,
      align: align
    },
    {
      key: "tag_name_list",
      title: "标签",
      dataKey: "tag_name_list",
      width: 160,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {scope.row.tag_name_list?.map((item: any) => {
              return <el-tag class="table-tag">{item}</el-tag>;
            })}
          </div>
        );
      }
    },
    {
      key: "views_count",
      title: "浏览量",
      dataKey: "views_count",
      width: 70,
      align: align
    },
    {
      key: "like_count",
      title: "点赞量",
      dataKey: "like_count",
      width: 70,
      align: align
    },
    {
      key: "type",
      title: "类型",
      dataKey: "type",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <el-tag type={typeOptions(scope.row.type).value}>
            {typeOptions(scope.row.type).label}
          </el-tag>
        );
      }
    },
    {
      key: "is_top",
      title: "置顶",
      dataKey: "is_top",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        if (scope.row.path === "") {
          return <div></div>;
        }
        return (
          <el-switch
            v-model={scope.row.is_top}
            active-value={1}
            inactive-value={0}
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-text="置顶"
            inactive-text="普通"
            inline-prompt
            onChange={() => {
              topArticleApi(scope.row).then(res => {
                ElMessage.success("更新置顶状态成功");
              });
            }}
          />
        );
      }
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
      dataKey: "operation",
      width: 160,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {scope.row.is_delete === 0 && (
              <div>
                <el-button
                  text
                  class="table-text-button"
                  icon="edit"
                  type="primary"
                  size="default"
                  onClick={() => {
                    router.push({ path: `/article/edit/${scope.row.id}` });
                  }}
                >
                  编辑
                </el-button>
                <el-button
                  text
                  class="table-text-button"
                  icon="delete"
                  type="danger"
                  size="default"
                  onClick={() => {
                    // 逻辑删除
                    recycleArticleApi({
                      id: scope.row.id,
                      is_delete: 1
                    }).then(res => {
                      ElMessage.success("删除成功,文章可在回收站恢复");
                      instance.exposed.refreshList();
                    });
                  }}
                >
                  删除
                </el-button>
              </div>
            )}
            {scope.row.is_delete === 1 && (
              <div>
                <el-button
                  text
                  class="table-text-button"
                  icon="delete"
                  type="danger"
                  size="default"
                  onClick={() => {
                    // 物理删除
                    deleteArticleApi(scope.row.id).then(res => {
                      ElMessage.success("删除成功");
                      instance.exposed.refreshList();
                    });
                  }}
                >
                  销毁
                </el-button>

                <el-button
                  text
                  class="table-text-button"
                  icon="finished"
                  type="success"
                  size="default"
                  onClick={() => {
                    // 逻辑删除
                    recycleArticleApi({
                      id: scope.row.id,
                      is_delete: 0
                    }).then(res => {
                      ElMessage.success("恢复成功,可在文章列表查看");
                      instance.exposed.refreshList();
                    });
                  }}
                >
                  恢复
                </el-button>
              </div>
            )}
          </div>
        );
      }
    }
  ];
}

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "文章标题",
      field: "article_title",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    },
    {
      type: RenderType.Input,
      label: "文章分类",
      field: "category_name",
      searchRules: {
        flag: "and",
        rule: "="
      }
    },
    {
      type: RenderType.Input,
      label: "文章标签",
      field: "tag_name",
      searchRules: {
        flag: "and",
        rule: "="
      }
    }
  ];
}

function getFormFields(row: any): FormField[] {
  return [];
}

function handleApi(event: string, data: any) {
  switch (event) {
    case "list":
      return findArticleListApi(data);
    default:
      return;
  }
}

const statusList = [
  { value: "all", label: "全部", condition: { is_delete: 0 } },
  { value: "public", label: "公开", condition: { is_delete: 0, status: 0 } },
  { value: "private", label: "私密", condition: { is_delete: 0, status: 1 } },
  { value: "draft", label: "草稿", condition: { is_delete: 0, status: 2 } },
  { value: "delete", label: "回收站", condition: { is_delete: 1 } }
];

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi,
    statusList
  };
}
