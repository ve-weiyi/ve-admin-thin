import { defineStore } from "pinia"
import { store } from "@/store"
import { Login, Token, UserInfo } from "@/api/types"
import cookies from "@/utils/cookies"
import { useMultiTagsStoreHook } from "@/store/modules/multiTags"
import { routerArrays } from "@/layout/types"
import { resetRouter, router } from "@/router"

const useAdminStore = defineStore({
  id: "admin",
  state: (): {
    verifyCode: string
    userInfo: UserInfo
  } => ({
    verifyCode: "",
    userInfo: cookies.getItem<UserInfo>("user_info") || {},
  }),
  actions: {
    login(login: Login) {
      cookies.setItem("token", login.token)
      cookies.setItem("user_info", login.user_info)
      console.log("token", cookies.getItem<Token>("token"))
      console.log("user_info", cookies.getItem<UserInfo>("user_info"))
    },
    logout() {
      cookies.clear()
      this.userInfo = {}
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays])
      resetRouter()
      router.push("/login")
    },
    isLogin(): boolean {
      return this.getToken() != undefined
    },
    getToken(): Token {
      return cookies.getItem<Token>("token")
    },
    getUserInfo(): UserInfo {
      return cookies.getItem<UserInfo>("user_info")
    },
    updateAvatar(avatar) {
      this.avatar = avatar
    },
    updateUserInfo(user: UserInfo) {
      cookies.setItem("user_info", user)
    },
  },
})

export function useAdminStoreHook() {
  return useAdminStore(store)
}
