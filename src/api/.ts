import http from "@/utils/request";
import type { PingReq, PingResp } from "./types";

/** "ping" */
export function pingApi(data?: PingReq): Promise<IApiResponseData<PingResp>> {
  return http.request<IApiResponseData<PingResp>>({
    url: `/blog/v1/ping`,
    method: "get",
    data: data
  });
}
