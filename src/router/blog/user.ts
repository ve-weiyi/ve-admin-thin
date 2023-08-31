import Layout from "@/layout/index.vue"

export default {
  path: "/user",
  name: "user",
  component: Layout,
  redirect: "/user/list",
  meta: { title: "用户管理", icon: "user" },
  children: [
    {
      path: "/list",
      component: () => import("@/views/blog/user/list/UserList.vue"),
      name: "list",
      meta: { title: "用户列表", icon: "user-filled" },
    },
    {
      path: "/online",
      component: () => import("@/views/blog/user/online/index.vue"),
      name: "online",
      meta: { title: "在线用户", icon: "user-filled" },
    },
  ],
}
