import { $t } from "@/plugins/i18n"

export default {
  path: "/about",
  redirect: "/about/index",
  meta: {
    icon: "ri:file-info-line",
    title: $t("menus.hsAbout"),
    rank: 999,
  },
  children: [
    {
      path: "/about/index",
      name: "About",
      component: () => import("@/views/about/index.vue"),
      meta: {
        title: $t("menus.hsAbout"),
      },
    },
  ],
} satisfies RouteConfigsTable
