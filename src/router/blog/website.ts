import Layout from "@/layout/index.vue"

export default {
  path: "/website",
  name: "website-management",
  component: Layout,
  redirect: "/website/config",
  meta: {
    title: "网站管理",
    icon: "setting",
    rank: 80,
  },
  children: [
    {
      path: "/website/config",
      component: () => import("@/views/blog/website/config/Config.vue"),
      name: "Config",
      meta: { title: "网站设置" },
    },
    {
      path: "/website/page",
      component: () => import("@/views/blog/website/page/Page.vue"),
      name: "Page",
      meta: { title: "页面管理" },
    },
    {
      path: "/website/about",
      component: () => import("@/views/blog/website/about/About.vue"),
      name: "About",
      meta: { title: "关于我" },
    },
  ],
}
