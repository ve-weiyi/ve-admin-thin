import Layout from "@/layout/index.vue"

export default {
  path: "/talk",
  name: "talk-management",
  component: Layout,
  redirect: "/talk/publish",
  meta: {
    title: "说说管理",
    icon: "ChatDotSquare",
    rank: 30,
  },
  children: [
    {
      path: "/talk/publish",
      component: () => import("@/views/blog/talk/Talk.vue"),
      name: "publish",
      meta: { title: "发布说说" },
    },
    {
      path: "/talk/list",
      component: () => import("@/views/blog/talk/TalkList.vue"),
      name: "TalkList",
      meta: { title: "说说列表" },
    },
  ],
}
