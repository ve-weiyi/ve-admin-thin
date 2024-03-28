import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";

export interface Token {
  /** token类型 Bearer */
  token_type: string;
  /** token */
  access_token: string;
  /** `accessToken`的过期时间（时间戳） */
  expire_in: number;
  /** 用于调用刷新accessToken的接口时所需的token */
  refresh_token: string;
  /** `refreshToken`的过期时间（时间戳） */
  refresh_expires_in: number;
  /** 用户`uid` */
  uid: string;
  /** 用户信息 */
  user_info: any;
  /** 用户登录历史 */
  login_history: any;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): Token {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  const cookieString = Cookies.get(TokenKey)
    ? Cookies.get(TokenKey)
    : storageSession().getItem<string>(sessionKey);
  // console.log("cookieString", cookieString)

  return JSON.parse(cookieString);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: Token) {
  const cookieString = JSON.stringify(data);
  Cookies.set(TokenKey, cookieString);
  storageSession().setItem(sessionKey, cookieString);
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
