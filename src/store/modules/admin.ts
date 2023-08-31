import { defineStore } from "pinia"
import { getToken, setToken, removeToken, Token } from "@/utils/token"
import { store } from "@/store"
import { Login } from "@/api/types"

export const useAdminStore = defineStore({
  id: "admin",
  state: () => ({
    collapse: false,
    tabList: [{ name: "首页", path: "/" }],
    userInfo: getToken()?.user_info,
  }),
  actions: {
    login(data: Login) {},
    logout() {
      removeToken()
    },
    getToken() {
      return getToken()
    },
    setToken(token) {
      setToken(token)
    },
    removeToken() {
      removeToken()
    },

    saveTab(tab) {
      if (this.tabList.findIndex((item) => item.path === tab.path) === -1) {
        this.tabList.push({ name: tab.name, path: tab.path })
      }
    },
    removeTab(tab) {
      const index = this.tabList.findIndex((item) => item.name === tab.name)
      this.tabList.splice(index, 1)
    },
    resetTab() {
      this.tabList = [{ name: "首页", path: "/" }]
    },
    trigger() {
      this.collapse = !this.collapse
    },
    saveUserMenuList(userMenuList) {
      this.userMenuList = userMenuList
    },
    updateAvatar(avatar) {
      this.avatar = avatar
    },
    updateUserInfo(user) {
      this.nickname = user.nickname
      this.intro = user.intro
      this.webSite = user.webSite
    },
  },
})

export function useAdminStoreHook() {
  return useAdminStore(store)
}
