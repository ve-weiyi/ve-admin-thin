import request from "@/utils/request";
import type {
  BatchResp,
  IdReq,
  IdsReq,
  PageQuery,
  PageResp,
  Tag
} from "./types";

/** "分页获取标签列表" */
export function findTagListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/tag/find_tag_list",
    method: "post",
    data: data
  });
}
/** "创建标签" */
export function createTagApi(data?: Tag): Promise<IApiResponseData<Tag>> {
  return request({
    url: "/api/v1/tag/create_tag",
    method: "post",
    data: data
  });
}
/** "删除标签" */
export function deleteTagApi(
  data?: IdReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/tag/delete_tag",
    method: "delete",
    data: data
  });
}
/** "批量删除标签" */
export function deleteTagListApi(
  data?: IdsReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/tag/delete_tag_list",
    method: "delete",
    data: data
  });
}
/** "查询标签" */
export function findTagApi(data?: IdReq): Promise<IApiResponseData<Tag>> {
  return request({
    url: "/api/v1/tag/find_tag",
    method: "post",
    data: data
  });
}
/** "更新标签" */
export function updateTagApi(data?: Tag): Promise<IApiResponseData<Tag>> {
  return request({
    url: "/api/v1/tag/update_tag",
    method: "put",
    data: data
  });
}
