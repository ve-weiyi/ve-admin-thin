const Layout = () => import("@/layout/index.vue");

export default {
  path: "/authority",
  name: "authority-management",
  component: Layout,
  redirect: "/authority/role",
  meta: {
    title: "权限管理",
    icon: "lock",
    rank: 60
  },
  children: [
    {
      path: "/authority/role",
      component: () => import("@/views/blog/authority/role/Role.vue"),
      name: "Role",
      meta: { title: "角色管理" }
    },
    {
      path: "/authority/menu",
      component: () => import("@/views/blog/authority/menu/Menu.vue"),
      name: "Menu",
      meta: { title: "菜单管理" }
    },
    {
      path: "/authority/api",
      component: () => import("@/views/blog/authority/api/Api.vue"),
      name: "Api",
      meta: { title: "接口管理" }
    }
  ]
} satisfies RouteConfigsTable;
