import request from "@/utils/request";
import type {
  BatchResp,
  FriendLink,
  IdReq,
  IdsReq,
  PageQuery,
  PageResp
} from "./types";

/** "分页获取友链列表" */
export function findFriendLinkListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/friend_link/find_friend_link_list",
    method: "post",
    data: data
  });
}
/** "创建友链" */
export function createFriendLinkApi(
  data?: FriendLink
): Promise<IApiResponseData<FriendLink>> {
  return request({
    url: "/api/v1/friend_link/create_friend_link",
    method: "post",
    data: data
  });
}
/** "删除友链" */
export function deleteFriendLinkApi(
  data?: IdReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/friend_link/delete_friend_link",
    method: "delete",
    data: data
  });
}
/** "批量删除友链" */
export function deleteFriendLinkListApi(
  data?: IdsReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/friend_link/delete_friend_link_list",
    method: "delete",
    data: data
  });
}
/** "查询友链" */
export function findFriendLinkApi(
  data?: IdReq
): Promise<IApiResponseData<FriendLink>> {
  return request({
    url: "/api/v1/friend_link/find_friend_link",
    method: "post",
    data: data
  });
}
/** "更新友链" */
export function updateFriendLinkApi(
  data?: FriendLink
): Promise<IApiResponseData<FriendLink>> {
  return request({
    url: "/api/v1/friend_link/update_friend_link",
    method: "put",
    data: data
  });
}
