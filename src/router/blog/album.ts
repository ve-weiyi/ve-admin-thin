import Layout from "@/layout/index.vue"

export default {
  path: "/albums",
  name: "album-management",
  component: Layout,
  redirect: "/albums/list",
  meta: {
    title: "相册管理",
    icon: "picture",
    rank: 40,
  },
  children: [
    {
      path: "/albums/list",
      name: "Albums",
      component: () => import("@/views/blog/album/Album.vue"),
      meta: { title: "相册列表" },
    },
    {
      path: "/albums/:id",
      name: "Photo",
      component: () => import("@/views/blog/album/Photo.vue"),
      meta: { title: "照片管理", showLink: false },
    },
    {
      path: "/albums/photo/delete",
      name: "Delete",
      component: () => import("@/views/blog/album/Delete.vue"),
      meta: { title: "照片回收站" },
    },
  ],
}
