// import "@/utils/sso";
import { getConfig } from "@/config"
import NProgress from "@/utils/progress"
import { transformI18n } from "@/plugins/i18n"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { createRouter, RouteComponent, Router, RouteRecordRaw } from "vue-router"
import {
  ascending,
  formatFlatteningRoutes,
  formatTwoStageRoutes,
  getHistoryMode,
  handleAliveRoute,
} from "./utils"
import { buildHierarchyTree } from "@/utils/tree"
import { isUrl } from "@pureadmin/utils"

import remainingRouter from "./modules/remaining"
import { useAdminStoreHook } from "@/store/modules/admin"

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
  ["./blog/**/*.ts", "./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true,
  }
)

/** 原始静态路由（未做任何处理） */
const routes = []

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default)
})

/** 动态路由 */
const asyncModules: Record<string, any> = import.meta.glob(["./blog/**/*.ts"], {
  eager: true,
})

const dynamicRoutes = []

Object.keys(asyncModules).forEach((key) => {
  dynamicRoutes.push(asyncModules[key].default)
})

export const asyncRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
)

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
)
// console.log("modules", modules)
// console.log("asyncModules", asyncModules)
//
// console.log("routes", routes)
// console.log("dynamicRoutes", dynamicRoutes)
//
// console.log("constantRoutes", constantRoutes)
// console.log("asyncRoutes", asyncRoutes)
/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(routes.flat(Infinity)).concat(
  ...remainingRouter
)

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v].path
})

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  },
})

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name, meta } = route
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name)
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
      )
    }
  })
  console.log("resetRouter", router.getRoutes())
  usePermissionStoreHook().clearAllCachePage()
}

/** 路由白名单 */
const whiteList = ["/login", "/error/403", "/error/404"]

router.beforeEach((to: ToRouteType, _from, next) => {
  console.log("router.before", to, _from)
  NProgress.start()
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add")
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to)
    }
  }
  const externalLink = isUrl(to?.name as string)
  if (!externalLink) {
    to.matched.some((item) => {
      if (!item.meta.title) return ""
      const Title = getConfig().Title
      if (Title) {
        document.title = `${transformI18n(item.meta.title)} | ${Title}`
      } else {
        document.title = transformI18n(item.meta.title)
      }
    })
  }

  // 无此页面的路由
  // if (router.getRoutes().filter((item) => item.path == to.path).length == 0) {
  //   next({ path: "/error/404" })
  //   return
  // }

  const tk = useAdminStoreHook().getToken()
  if (tk) {
    console.log("用户已登录")
    if (to.path === "/login") {
      // 如果已经登录，并准备进入 Login 页面，则重定向到主页
      next({ path: "/" })
    } else {
      next()
    }
  } else {
    // 用户未登录
    console.log("用户未登录")
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next({ path: "/login" })
      }
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
