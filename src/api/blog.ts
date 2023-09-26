import http from "@/utils/request"
import { WebsiteConfigRequest, BlogBackInfoDTO, ChatRecord } from "./types"

/** 查询聊天记录 */
export function webSocketApi(): Promise<any> {
  return http.request<any>({
    url: `/api/v1/ws`,
    method: "get",
  })
}

/** 关于我 */
export function getAboutMeApi(): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/about`,
    method: "get",
  })
}

/** 更新我的信息 */
export function updateAboutMeApi(data: string): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/about`,
    method: "post",
    data: data,
  })
}

/** 获取网站配置 */
export function getWebsiteConfigApi(data: WebsiteConfigRequest): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/admin/website/config`,
    method: "post",
    data: data,
  })
}

/** 更新网站配置 */
export function updateWebsiteConfigApi(data: WebsiteConfigRequest): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/admin/website/config`,
    method: "put",
    data: data,
  })
}

/** 获取后台首页信息 */
export function getHomeInfoApi(): Promise<IApiResponseData<BlogBackInfoDTO>> {
  return http.request<IApiResponseData<BlogBackInfoDTO>>({
    url: `/api/v1/home`,
    method: "get",
  })
}

/** 查询聊天记录 */
export function findChatRecordsApi(page: PageQuery): Promise<IApiResponseData<ChatRecord>> {
  return http.request<IApiResponseData<ChatRecord>>({
    url: `/api/v1/chat/records`,
    method: "post",
    data: page,
  })
}
