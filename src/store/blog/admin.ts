import { defineStore } from "pinia";
import { store } from "@/store";
import type { LoginReq, LoginResp, Token, UserInfoResp } from "@/api/types.ts";
import cookies from "@/utils/cookies.ts";
import { getLogin } from "@/api/user.ts";
import { setToken } from "@/utils/auth.ts";
import { loginApi } from "@/api/auth.ts";

const useAdminStore = defineStore({
  id: "admin",
  state: (): {
    verifyCode: string;
    userInfo: UserInfoResp;
  } => ({
    verifyCode: "",
    userInfo: null
  }),
  actions: {
    /** 登入 */
    async loginByUsername(data: LoginReq) {
      return new Promise<LoginResp>((resolve, reject) => {
        loginApi(data)
          .then(res => {
            console.log("res", res);
            cookies.setItem("token", res.data.token.access_token);
            cookies.setItem("uid", res.data.token.user_id);
            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // return null or Token
    getToken(): string {
      return cookies.getItem<string>("token");
    },
    getUid(): string {
      return cookies.getItem<string>("uid");
    },
    removeToken() {
      cookies.clear();
    },
    setUserInfo(user: UserInfoResp) {
      this.userInfo = user;
    },
    getUserInfo(): UserInfoResp {
      return this.userInfo;
    }
  }
});

export function useAdminStoreHook() {
  return useAdminStore(store);
}
