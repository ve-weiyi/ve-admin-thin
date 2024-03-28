const Layout = () => import("@/layout/index.vue");

export default {
  path: "/talk",
  name: "talk-management",
  component: Layout,
  redirect: "/talk/publish",
  meta: {
    title: "说说管理",
    icon: "ChatDotSquare",
    rank: 30
  },
  children: [
    {
      path: "/talk/publish",
      component: () => import("@/views/blog/talk/Talk.vue"),
      name: "talk_publish",
      meta: { title: "发布说说" }
    },
    {
      path: "/talk/edit/:talkId",
      component: () => import("@/views/blog/talk/Talk.vue"),
      name: "talk_edit",
      meta: { title: "编辑说说", showLink: false }
    },
    {
      path: "/talk/list",
      component: () => import("@/views/blog/talk/TalkList.vue"),
      name: "talk_list",
      meta: { title: "说说列表" }
    }
  ]
} satisfies RouteConfigsTable;
