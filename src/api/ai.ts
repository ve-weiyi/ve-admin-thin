import http from "@/utils/request"
import { ChatMessage } from "./types"

/** 和Chatgpt聊天 */
export function chatAIApi(data: ChatMessage[]): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/ai/chat`,
    method: "post",
    data: data,
  })
}

/** Chatgpt扮演角色 */
export function chatCosApi(data: string): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/ai/cos`,
    method: "post",
    data: data,
  })
}
