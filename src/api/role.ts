import request from "@/utils/request";
import { EmptyResp, UpdateRoleMenusReq, RoleBackDTO, IdsReq, IdReq, RoleQuery, RoleResourcesResp, RoleNewReq, BatchResp, PageResp, UpdateRoleApisReq } from "./types";

/** "创建角色" */
export function addRoleApi(data?: RoleNewReq): Promise<IApiResponse<RoleBackDTO>> {
  return request({
    url: "/admin_api/v1/role/add_role",
    method: "post",
    data: data,
  });
}

/** "批量删除角色" */
export function batchDeleteRoleApi(data?: IdsReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/admin_api/v1/role/batch_delete_role",
    method: "post",
    data: data,
  });
}

/** "删除角色" */
export function deleteRoleApi(data?: IdReq): Promise<IApiResponse<BatchResp>> {
  return request({
    url: "/admin_api/v1/role/delete_role",
    method: "delete",
    data: data,
  });
}

/** "分页获取角色列表" */
export function findRoleListApi(data?: RoleQuery): Promise<IApiResponse<PageResp>> {
  return request({
    url: "/admin_api/v1/role/find_role_list",
    method: "post",
    data: data,
  });
}

/** "获取角色资源列表" */
export function findRoleResourcesApi(data?: IdReq): Promise<IApiResponse<RoleResourcesResp>> {
  return request({
    url: "/admin_api/v1/role/find_role_resources",
    method: "post",
    data: data,
  });
}

/** "更新角色" */
export function updateRoleApi(data?: RoleNewReq): Promise<IApiResponse<RoleBackDTO>> {
  return request({
    url: "/admin_api/v1/role/update_role",
    method: "put",
    data: data,
  });
}

/** "更新角色接口权限" */
export function updateRoleApisApi(data?: UpdateRoleApisReq): Promise<IApiResponse<EmptyResp>> {
  return request({
    url: "/admin_api/v1/role/update_role_apis",
    method: "post",
    data: data,
  });
}

/** "更新角色菜单权限" */
export function updateRoleMenusApi(data?: UpdateRoleMenusReq): Promise<IApiResponse<EmptyResp>> {
  return request({
    url: "/admin_api/v1/role/update_role_menus",
    method: "post",
    data: data,
  });
}
