import request from "@/utils/request";
import type { EmptyReq, EmptyResp, LoginReq, LoginResp } from "./types";

/** "登录" */
export function loginApi(
  data?: LoginReq
): Promise<IApiResponseData<LoginResp>> {
  return request({
    url: "/api/v1/login",
    method: "post",
    data: data
  });
}
/** "登出" */
export function logoutApi(
  data?: EmptyReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/logout",
    method: "post",
    data: data
  });
}
