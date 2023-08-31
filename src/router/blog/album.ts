import Layout from "@/layout/index.vue"

export default {
  path: "/albums",
  name: "album-management",
  component: Layout,
  redirect: "/album/albums",
  meta: { title: "相册管理", icon: "picture" },
  children: [
    {
      path: "/list",
      name: "Albums",
      component: () => import("@/views/blog/album/Album.vue"),
      meta: { title: "相册列表" },
    },
    {
      path: "/:id",
      name: "Photo",
      component: () => import("@/views/blog/album/Photo.vue"),
      meta: { title: "照片管理", hidden: true },
    },
    {
      path: "/photo/delete",
      name: "Delete",
      component: () => import("@/views/blog/album/Delete.vue"),
      meta: { title: "照片回收站" },
    },
  ],
}
