import { $t } from "@/plugins/i18n"

const Layout = () => import("@/layout/index.vue")

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/home",
  meta: {
    icon: "homeFilled",
    title: $t("menus.hshome"),
    rank: 0,
  },
  children: [
    {
      path: "/home",
      name: "Home",
      component: () => import("@/views/blog/home/Home.vue"),
      meta: {
        title: "首页",
        showLink: true,
      },
    },
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: $t("menus.hshome"),
        showLink: false,
      },
    },
  ],
} as RouteConfigsTable
