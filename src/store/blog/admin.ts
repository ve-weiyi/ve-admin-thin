import { defineStore } from "pinia";
import { store } from "@/store";
import type { LoginResp, Token, UserInfoResp } from "@/api/types.ts";
import cookies from "@/utils/cookies.ts";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags.ts";
import { routerArrays } from "@/layout/types.ts";
import { resetRouter, router } from "@/router";

const useAdminStore = defineStore({
  id: "admin",
  state: (): {
    verifyCode: string;
  } => ({
    verifyCode: ""
  }),
  actions: {
    login(login: LoginResp) {
      this.setToken(login.token);
    },
    logout() {
      cookies.clear();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    setToken(token: Token) {
      cookies.setItem("token", token);
    },
    // return null or Token
    getToken(): Token {
      return cookies.getItem<Token>("token");
    },
    setUserInfo(user: UserInfoResp) {
      cookies.setItem("user_info", user);
    },
    getUserInfo(): UserInfoResp {
      return cookies.getItem<UserInfoResp>("user_info");
    }
  }
});

export function useAdminStoreHook() {
  return useAdminStore(store);
}
