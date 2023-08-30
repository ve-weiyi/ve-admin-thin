import { defineStore } from "pinia"
import { store } from "@/store"
import { userType } from "./types"
import { routerArrays } from "@/layout/types"
import { router, resetRouter } from "@/router"
import { storageSession } from "@pureadmin/utils"
import { useMultiTagsStoreHook } from "@/store/modules/multiTags"
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth"
import { getUserInfoApi } from "@/api/user"
import { Login, User, UserDetail } from "@/api/types"

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    // 页面级别权限
    roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? [],
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
      setToken({
        expires: undefined,
        refreshToken: "",
        roles: undefined,
        username: "",
        accessToken: data.token,
      })
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
