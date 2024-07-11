import { $t } from "@/plugins/i18n.ts";

const Layout = () => import("@/layout/index.vue");

export const routes = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      rank: 9,
      title: "重定向",
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/blog/redirect/index.vue")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/blog/error/404.vue"),
    meta: {
      rank: 9,
      title: "404",
      hidden: true
    }
  },
  {
    path: "/login",
    name: "登录",
    meta: {
      title: $t("status.pureLoad"),
      showLink: false,
      rank: 102
    },
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "",
    component: Layout,
    redirect: "/index",
    meta: {
      title: $t("status.pureLoad"),
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/index",
        component: () => import("@/views/blog/home/Home.vue"),
        name: "Index",
        meta: {
          title: "首页",
          icon: "dashboard",
          affix: true
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
