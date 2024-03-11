import { $t } from "@/plugins/i18n"

const Layout = () => import("@/layout/index.vue")

export default {
  path: "/example",
  name: "/example",
  component: Layout,
  redirect: "/example",
  meta: {
    icon: "homeFilled",
    title: $t("menus.hshome"),
    rank: 0,
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
  ]
} as RouteConfigsTable
