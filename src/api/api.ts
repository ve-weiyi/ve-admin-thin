import http from "@/utils/request";
import type {
  Api,
  ApiDetailsDTO,
  BatchResult,
  EmptyReq,
  EmptyResp,
  IdReq,
  IdsReq
} from "./types";

/** 创建接口 */
export function createApiApi(data: Api): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: `/api/v1/api/create_api`,
    method: "post",
    data: data
  });
}

/** 更新接口 */
export function updateApiApi(data: Api): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: `/api/v1/api/update_api`,
    method: "put",
    data: data
  });
}

/** 删除接口 */
export function deleteApiApi(req: IdReq): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/api/delete_api`,
    method: "delete",
    data: req
  });
}

/** 查询接口 */
export function findApiApi(req: IdReq): Promise<IApiResponseData<Api>> {
  return http.request<IApiResponseData<Api>>({
    url: `/api/v1/api/find_api`,
    method: "post",
    data: req
  });
}

/** 批量删除接口 */
export function deleteApiListApi(
  req: IdsReq
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/api/delete_api_list`,
    method: "delete",
    data: req
  });
}

/** 分页获取接口列表 */
export function findApiListApi(
  page: PageQuery
): Promise<IApiResponseData<PageResult<Api[]>>> {
  return http.request<IApiResponseData<PageResult<Api[]>>>({
    url: `/api/v1/api/find_api_list`,
    method: "post",
    data: page
  });
}

/** 获取接口列表 */
export function findApiDetailsListApi(
  page: PageQuery
): Promise<IApiResponseData<PageResult<ApiDetailsDTO[]>>> {
  return http.request<IApiResponseData<PageResult<ApiDetailsDTO[]>>>({
    url: `/api/v1/api/find_api_details_list`,
    method: "post",
    data: page
  });
}

/** 同步接口列表 */
export function syncApiListApi(
  data: EmptyReq
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/api/sync_api_list`,
    method: "post",
    data: data
  });
}

/** 清空接口列表 */
export function cleanApiListApi(
  data: EmptyReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/api/clean_api_list`,
    method: "post",
    data: data
  });
}
