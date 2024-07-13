import { defineStore } from "pinia";
import { store } from "@/store";
import type { Token, UserInfoResp } from "@/api/types.ts";
import cookies from "@/utils/cookies.ts";

const useAdminStore = defineStore({
  id: "admin",
  state: (): {
    verifyCode: string;
    userInfo: UserInfoResp;
  } => ({
    verifyCode: "",
    userInfo: {}
  }),
  actions: {
    setToken(token: Token) {
      cookies.setItem("token", token);
    },
    // return null or Token
    getToken(): Token {
      return cookies.getItem<Token>("token");
    },
    removeToken() {
      cookies.clear();
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
