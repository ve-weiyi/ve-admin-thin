import Layout from "@/layout/index.vue"

export default {
  path: "/log",
  name: "log", // router.push
  component: Layout,
  redirect: "/log/operation",
  meta: { title: "日志管理", icon: "document" },
  children: [
    {
      path: "/log/operation",
      component: () => import("@/views/blog/log/Operation.vue"),
      name: "operation",
      meta: { title: "操作日志", showParent: true, keepAlive: true },
    },
  ],
}
