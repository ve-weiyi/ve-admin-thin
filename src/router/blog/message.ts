import Layout from "@/layout/index.vue"

export default {
  path: "/message",
  name: "message-management",
  component: Layout,
  redirect: "/message/comment",
  meta: {
    title: "消息管理",
    icon: "message",
    rank: 20,
  },
  children: [
    {
      path: "/message/comment",
      component: () => import("@/views/blog/message/comment/Comment.vue"),
      name: "comment",
      meta: { title: "评论管理", keepAlive: true },
    },
    {
      path: "/message/remark",
      component: () => import("@/views/blog/message/remark/Remark.vue"),
      name: "remark",
      meta: { title: "留言管理", keepAlive: true },
    },
    {
      path: "/message/links",
      component: () => import("@/views/blog/message/link/FriendLink.vue"),
      name: "links",
      meta: { title: "友链管理", keepAlive: true },
    },
  ],
} satisfies RouteConfigsTable
