import request from "@/utils/request";
import type {
  BatchResp,
  EmptyReq,
  IdReq,
  IdsReq,
  MenuDetails,
  PageQuery,
  PageResp,
  SyncMenuReq
} from "./types";

/** "清空菜单列表" */
export function cleanMenuListApi(
  data?: EmptyReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/menu/clean_menu_list",
    method: "post",
    data: data
  });
}
/** "创建菜单" */
export function createMenuApi(
  data?: MenuDetails
): Promise<IApiResponseData<MenuDetails>> {
  return request({
    url: "/api/v1/menu/create_menu",
    method: "post",
    data: data
  });
}
/** "删除菜单" */
export function deleteMenuApi(
  data?: IdReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/menu/delete_menu",
    method: "delete",
    data: data
  });
}
/** "批量删除菜单" */
export function deleteMenuListApi(
  data?: IdsReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/menu/delete_menu_list",
    method: "delete",
    data: data
  });
}
/** "查询菜单" */
export function findMenuApi(
  data?: IdReq
): Promise<IApiResponseData<MenuDetails>> {
  return request({
    url: "/api/v1/menu/find_menu",
    method: "post",
    data: data
  });
}
/** "分页获取菜单列表" */
export function findMenuListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/menu/find_menu_list",
    method: "post",
    data: data
  });
}
/** "同步菜单列表" */
export function syncMenuListApi(
  data?: SyncMenuReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/menu/sync_menu_list",
    method: "post",
    data: data
  });
}
/** "更新菜单" */
export function updateMenuApi(
  data?: MenuDetails
): Promise<IApiResponseData<MenuDetails>> {
  return request({
    url: "/api/v1/menu/update_menu",
    method: "put",
    data: data
  });
}
