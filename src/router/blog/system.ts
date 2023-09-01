import Layout from "@/layout/index.vue"

export default {
  path: "/system",
  name: "system",
  component: Layout,
  redirect: "/system/website",
  meta: {
    title: "网站管理",
    icon: "setting",
    rank: 3,
  },
  children: [
    {
      path: "/system/website",
      component: () => import("@/views/blog/system/website/Website.vue"),
      name: "Website",
      meta: { title: "网站设置" },
    },
    {
      path: "/system/page",
      component: () => import("@/views/blog/system/page/Page.vue"),
      name: "Page",
      meta: { title: "页面管理" },
    },
    {
      path: "/system/about",
      component: () => import("@/views/blog/system/about/About.vue"),
      name: "About",
      meta: { title: "关于我" },
    },
  ],
}
