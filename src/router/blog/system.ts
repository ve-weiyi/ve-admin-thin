const Layout = () => import("@/layout/index.vue")

export default {
  path: "/system",
  name: "system-management",
  component: Layout,
  redirect: "/system/state",
  meta: {
    title: "系统管理",
    icon: "system",
    rank: 90,
  },
  children: [
    {
      path: "/website/state",
      component: () => import("@/views/blog/system/State.vue"),
      name: "/website/state",
      meta: { title: "网站设置" },
    },
  ],
} satisfies RouteConfigsTable
