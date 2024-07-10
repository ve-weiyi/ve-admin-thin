import request from "@/utils/request";
import type {
  AboutMe,
  AdminHomeInfo,
  EmptyReq,
  EmptyResp,
  WebsiteConfig
} from "./types";

/** "获取后台首页信息" */
export function getAdminHomeInfoApi(
  data?: EmptyReq
): Promise<IApiResponseData<AdminHomeInfo>> {
  return request({
    url: "/api/v1/admin",
    method: "get",
    data: data
  });
}
/** "获取关于我的信息" */
export function getAboutMeApi(
  data?: EmptyReq
): Promise<IApiResponseData<AboutMe>> {
  return request({
    url: "/api/v1/admin/about_me",
    method: "get",
    data: data
  });
}
/** "更新关于我的信息" */
export function updateAboutMeApi(
  data?: AboutMe
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/about_me",
    method: "put",
    data: data
  });
}
/** "获取网站配置" */
export function getWebsiteConfigApi(
  data?: EmptyReq
): Promise<IApiResponseData<WebsiteConfig>> {
  return request({
    url: "/api/v1/admin/get_website_config",
    method: "get",
    data: data
  });
}
/** "获取服务器信息" */
export function getSystemStateApi(
  data?: EmptyReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/system_state",
    method: "get",
    data: data
  });
}
/** "更新网站配置" */
export function updateWebsiteConfigApi(
  data?: WebsiteConfig
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/update_website_config",
    method: "put",
    data: data
  });
}
