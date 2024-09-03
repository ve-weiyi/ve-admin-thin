import request from "@/utils/request";
import { TagQuery, PageResp, TagNewReq, TagBackDTO, IdsReq, BatchResp, IdReq } from "./types";

/** "分页获取标签列表" */
export function findTagListApi(data?: TagQuery): Promise<IApiResponse<PageResp>> {
  return request({
    url: "/api/v1/tag/find_tag_list",
    method: "post",
    data: data,
  });
}

/** "创建标签" */
export function addTagApi(data?: TagNewReq): Promise<IApiResponse<TagBackDTO>> {
  return request({
    url: "/api/v1/tag/add_tag",
    method: "post",
    data: data,
  });
}

/** "批量删除标签" */
export function batchDeleteTagApi(data?: IdsReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/api/v1/tag/batch_delete_tag",
    method: "delete",
    data: data,
  });
}

/** "删除标签" */
export function deleteTagApi(data?: IdReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/api/v1/tag/delete_tag",
    method: "delete",
    data: data,
  });
}

/** "更新标签" */
export function updateTagApi(data?: TagNewReq): Promise<IApiResponse<TagBackDTO>> {
  return request({
    url: "/api/v1/tag/update_tag",
    method: "put",
    data: data,
  });
}
