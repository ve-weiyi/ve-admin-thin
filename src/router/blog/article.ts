import Layout from "@/layout/index.vue"

export default {
  path: "/article",
  name: "article",
  component: Layout,
  redirect: "article/publish",
  meta: { title: "文章管理", icon: "document" },
  children: [
    {
      path: "/publish",
      name: "article/publish",
      component: () => import("@/views/blog/article/Article.vue"),
      meta: { title: "发布文章" },
    },
    {
      path: "/list",
      name: "article/list",
      component: () => import("@/views/blog/article/ArticleList.vue"),
      meta: { title: "文章列表" },
    },
    {
      path: "/category",
      name: "article/category",
      component: () => import("@/views/blog/article/category/Category.vue"),
      meta: { title: "分类管理" },
    },
    {
      path: "/tag",
      name: "article/tag",
      component: () => import("@/views/blog/article/tag/Tag.vue"),
      meta: { title: "标签管理" },
    },
  ],
}
