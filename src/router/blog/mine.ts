import Layout from "@/layout/index.vue"

export default {
  path: "/mine",
  name: "mine-management",
  component: Layout,
  redirect: "/mine/userinfo",
  meta: {
    title: "个人中心",
    icon: "user",
    rank: 90,
  },
  children: [
    {
      path: "/mine/userinfo",
      component: () => import("@/views/blog/mine/me/Me.vue"),
      name: "userinfo",
      meta: { title: "个人信息", keepAlive: true },
    },
    {
      path: "/mine/history",
      component: () => import("@/views/blog/mine/history/History.vue"),
      name: "history",
      meta: { title: "登录历史", keepAlive: true },
    },
  ],
}
