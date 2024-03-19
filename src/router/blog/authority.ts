const Layout = () => import("@/layout/index.vue")

export default {
  path: "/authority",
  name: "authority-management",
  component: Layout,
  redirect: "/authority/role",
  meta: {
    title: "权限管理",
    icon: "lock",
    rank: 60,
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
      path: "/authority/menuv2",
      component: () => import("@/views/blog/authority/menuv2/index.vue"),
      name: "Menuv2",
      meta: { title: "菜单管理v2" },
    },
    {
      path: "/authority/resource",
      component: () => import("@/views/blog/authority/resource/Resource.vue"),
      name: "Resource",
      meta: { title: "接口管理" },
    },
  ],
} satisfies RouteConfigsTable
