const Layout = () => import("@/layout/index.vue");

export default {
  path: "/user",
  name: "monitor",
  component: Layout,
  redirect: "/user/list",
  meta: {
    title: "系统监控",
    icon: "user",
    rank: 50
  },
  children: [
    {
      path: "/user/online",
      component: () => import("@/views/blog/monitor/online/index.vue"),
      name: "online",
      meta: { title: "在线用户", icon: "user-filled" }
    }
  ]
} satisfies RouteConfigsTable;
