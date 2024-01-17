// import "@/utils/sso";
import { getConfig } from "@/config"
import NProgress from "@/utils/progress"
import { transformI18n } from "@/plugins/i18n"
import { useMultiTagsStoreHook } from "@/store/modules/multiTags"
import { usePermissionStoreHook } from "@/store/modules/permission"
import {
  Router,
  createRouter,
  RouteRecordRaw,
  RouteComponent,
} from "vue-router"
import {
  ascending,
  getTopMenu,
  initRouter,
  isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
} from "./utils"
import { buildHierarchyTree } from "@/utils/tree"
import { isUrl, openLink, storageSession, isAllEmpty } from "@pureadmin/utils"

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
export const asyncRoutes: Array<RouteRecordRaw> = []

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
)

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(
  routes.flat(Infinity)
).concat(...remainingRouter)

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
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop
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
        formatFlatteningRoutes(
          buildHierarchyTree(ascending(routes.flat(Infinity)))
        )
      )
    }
  })
  usePermissionStoreHook().clearAllCachePage()
}

/** 路由白名单 */
const whiteList = ["/login"]

router.beforeEach((to: ToRouteType, _from, next) => {
  console.log("to", to)
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
