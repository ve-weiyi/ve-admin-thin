import { defineStore } from "pinia"
import { store } from "@/store"
import { userType } from "./types"
import { routerArrays } from "@/layout/types"
import { router, resetRouter } from "@/router"
import { storageSession } from "@pureadmin/utils"
import { useMultiTagsStoreHook } from "@/store/modules/multiTags"
import { setToken, removeToken, sessionKey } from "@/utils/token"
import { getUserInfoApi } from "@/api/user"
import { Login } from "@/api/types"

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username: storageSession().getItem<any>(sessionKey)?.username ?? "",
    // 页面级别权限
    roles: storageSession().getItem<any>(sessionKey)?.roles ?? [],
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles
    },
    /** 登入 */
    loginByUser(data: Login) {
      setToken(null)
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = ""
      this.roles = []
      removeToken()
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays])
      resetRouter()
      router.push("/login")
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return getUserInfoApi()
    },
  },
})

export function useUserStoreHook() {
  return useUserStore(store)
}
