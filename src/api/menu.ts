import http from "@/utils/request";
import type {
  BatchResult,
  EmptyReq,
  EmptyResp,
  IdReq,
  IdsReq,
  Menu,
  MenuDetailsDTO,
  SyncMenuRequest
} from "./types";

/** 创建菜单 */
export function createMenuApi(data: Menu): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: `/api/v1/menu/create_menu`,
    method: "post",
    data: data
  });
}

/** 更新菜单 */
export function updateMenuApi(data: Menu): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: `/api/v1/menu/update_menu`,
    method: "put",
    data: data
  });
}

/** 删除菜单 */
export function deleteMenuApi(
  req: IdReq
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/menu/delete_menu`,
    method: "delete",
    data: req
  });
}

/** 批量删除菜单 */
export function deleteMenuListApi(
  req: IdsReq
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/menu/delete_menu_list`,
    method: "delete",
    data: req
  });
}

/** 查询菜单 */
export function findMenuApi(req: IdReq): Promise<IApiResponseData<Menu>> {
  return http.request<IApiResponseData<Menu>>({
    url: `/api/v1/menu/find_menu`,
    method: "post",
    data: req
  });
}

/** 分页获取菜单列表 */
export function findMenuListApi(
  page: PageQuery
): Promise<IApiResponseData<PageResult<MenuDetailsDTO[]>>> {
  return http.request<IApiResponseData<PageResult<MenuDetailsDTO[]>>>({
    url: `/api/v1/menu/find_menu_list`,
    method: "post",
    data: page
  });
}

/** 获取菜单列表 */
export function findMenuDetailsListApi(
  page: PageQuery
): Promise<IApiResponseData<PageResult<MenuDetailsDTO[]>>> {
  return http.request<IApiResponseData<PageResult<MenuDetailsDTO[]>>>({
    url: `/api/v1/menu/find_menu_details_list`,
    method: "post",
    data: page
  });
}

/** 同步菜单列表 */
export function syncMenuListApi(
  data: SyncMenuRequest
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/menu/sync_menu_list`,
    method: "post",
    data: data
  });
}

/** 清空菜单列表 */
export function cleanMenuListApi(
  data: EmptyReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/menu/clean_menu_list`,
    method: "post",
    data: data
  });
}
