import Layout from "@/layout/index.vue"

export default {
  path: "/mine",
  name: "mine",
  component: Layout,
  redirect: "/mine/userinfo",
  meta: { title: "个人中心", icon: "user" },
  children: [
    {
      path: "/mine/userinfo",
      component: () => import("@/views/blog/mine/Mine.vue"),
      name: "userinfo",
      meta: { title: "个人信息", keepAlive: true },
    },
    {
      path: "/mine/identity",
      component: () => import("@/views/blog/mine/Identity.vue"),
      name: "identity",
      meta: { title: "个人认证", keepAlive: true },
    },
  ],
}
