import { type FormField, RenderType } from "@/utils/render";
import { type Column, ElMessage } from "element-plus";
import {
  deleteArticleApi,
  findArticleListApi,
  recycleArticleApi,
  topArticleApi
} from "@/api/article";
import { getCurrentInstance } from "vue";
import { formatDate } from "@/utils/date.ts";
import router from "@/router";
import { FixedDir } from "element-plus/es/components/table-v2/src/constants";

const align = "center";

const options = [
  {
    value: 1,
    label: "原创",
    style: "success"
  },
  {
    value: 2,
    label: "转载",
    style: "warning"
  },
  {
    value: 3,
    label: "翻译",
    style: "danger"
  }
];

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
      width: 80,
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
      width: 180,
      align: align
    },
    {
      key: "article_type",
      title: "类型",
      dataKey: "article_type",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        const articleType = options.find(
          item => item.value === scope.row.article_type
        );
        if (!articleType) {
          return <el-tag type="info">未知</el-tag>;
        }
        return <el-tag type={articleType.style}>{articleType.label}</el-tag>;
      }
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
      width: 140,
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
      fixed: FixedDir.RIGHT,
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
      field: "article_title"
    },
    {
      type: RenderType.Select,
      label: "文章类型",
      field: "article_type",
      options: options
    },
    {
      type: RenderType.Input,
      label: "文章分类",
      field: "category_name"
    },
    {
      type: RenderType.Input,
      label: "文章标签",
      field: "tag_name"
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

function onAction(event: string, data: any) {
  const instance = getCurrentInstance();
  switch (event) {
    case "list":
      return function () {};
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
