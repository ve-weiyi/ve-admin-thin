import Layout from "@/layout/index.vue"

export default {
  path: "/authority",
  name: "Authority",
  component: Layout,
  redirect: "/authority/role",
  meta: {
    title: "权限管理",
    icon: "lock",
    rank: 2,
  },
  children: [
    {
      path: "/authority/role",
      component: () => import("@/views/blog/authority/role/Role.vue"),
      name: "Role",
      meta: { title: "角色管理" },
    },
    {
      path: "/authority/menu",
      component: () => import("@/views/blog/authority/menu/Menu.vue"),
      name: "Menu",
      meta: { title: "菜单管理" },
    },
    {
      path: "/authority/resource",
      component: () => import("@/views/blog/authority/resource/Resource.vue"),
      name: "Resource",
      meta: { title: "接口管理" },
    },
  ],
}
