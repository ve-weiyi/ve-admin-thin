import request from "@/utils/request";
import type {
  BatchResp,
  IdReq,
  IdsReq,
  PageQuery,
  PageResp,
  TalkDetails
} from "./types";

/** "分页获取说说列表" */
export function findTalkListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/talk/find_talk_list",
    method: "post",
    data: data
  });
}
/** "创建说说" */
export function createTalkApi(
  data?: TalkDetails
): Promise<IApiResponseData<TalkDetails>> {
  return request({
    url: "/api/v1/talk/create_talk",
    method: "post",
    data: data
  });
}
/** "删除说说" */
export function deleteTalkApi(
  data?: IdReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/talk/delete_talk",
    method: "delete",
    data: data
  });
}
/** "批量删除说说" */
export function deleteTalkListApi(
  data?: IdsReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/talk/delete_talk_list",
    method: "delete",
    data: data
  });
}
/** "查询说说" */
export function findTalkApi(
  data?: IdReq
): Promise<IApiResponseData<TalkDetails>> {
  return request({
    url: "/api/v1/talk/find_talk",
    method: "post",
    data: data
  });
}
/** "更新说说" */
export function updateTalkApi(
  data?: TalkDetails
): Promise<IApiResponseData<TalkDetails>> {
  return request({
    url: "/api/v1/talk/update_talk",
    method: "put",
    data: data
  });
}
