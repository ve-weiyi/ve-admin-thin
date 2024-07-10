import { defineStore } from "pinia";
import { store } from "@/store";
import type { LoginResp, Token, UserInfoResp } from "@/api/types";
import cookies from "@/utils/cookies";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { routerArrays } from "@/layout/types";
import { resetRouter, router } from "@/router";

const useAdminStore = defineStore({
  id: "admin",
  state: (): {
    verifyCode: string;
    userInfo: UserInfoResp;
  } => ({
    verifyCode: "",
    userInfo: cookies.getItem<UserInfoResp>("user_info") || {}
  }),
  actions: {
    login(login: LoginResp) {
      cookies.setItem("token", login.token);
      console.log("token", cookies.getItem<Token>("token"));
    },
    logout() {
      cookies.clear();
      this.userInfo = {};
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    isLogin(): boolean {
      return this.getToken() != undefined;
    },
    getToken(): Token {
      return cookies.getItem<Token>("token");
    },
    getUserInfo(): UserInfoResp {
      return cookies.getItem<UserInfoResp>("user_info");
    },
    setUserInfo(user: UserInfoResp) {
      cookies.setItem("user_info", user);
    }
  }
});

export function useAdminStoreHook() {
  return useAdminStore(store);
}
