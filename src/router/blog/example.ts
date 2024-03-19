const Layout = () => import("@/layout/index.vue")

export default {
  path: "/example",
  name: "/example",
  component: Layout,
  redirect: "/example",
  meta: {
    icon: "homeFilled",
    title: "示例",
    rank: 100,
  },
  children: [
    {
      path: "/example1",
      name: "example1",
      component: () => import("@/views/blog/example/Example.vue"),
      meta: {
        title: "测试",
        showLink: true,
      },
    },
  ],
} satisfies RouteConfigsTable
