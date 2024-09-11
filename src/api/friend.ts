import request from "@/utils/request";
import { IdReq, FriendQuery, PageResp, FriendNewReq, FriendBackDTO, IdsReq, BatchResp } from "./types";

/** "分页获取友链列表" */
export function findFriendListApi(data?: FriendQuery): Promise<IApiResponse<PageResp>> {
  return request({
    url: "/admin_api/v1/friend/find_friend_list",
    method: "post",
    data: data,
  });
}

/** "创建友链" */
export function addFriendApi(data?: FriendNewReq): Promise<IApiResponse<FriendBackDTO>> {
  return request({
    url: "/admin_api/v1/friend/add_friend",
    method: "post",
    data: data,
  });
}

/** "批量删除友链" */
export function batchDeleteFriendApi(data?: IdsReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/admin_api/v1/friend/batch_delete_friend",
    method: "delete",
    data: data,
  });
}

/** "删除友链" */
export function deleteFriendApi(data?: IdReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/admin_api/v1/friend/delete_friend",
    method: "delete",
    data: data,
  });
}

/** "更新友链" */
export function updateFriendApi(data?: FriendNewReq): Promise<IApiResponse<FriendBackDTO>> {
  return request({
    url: "/admin_api/v1/friend/update_friend",
    method: "put",
    data: data,
  });
}
