import http from "@/utils/request";
import type {
  BatchResult,
  EmptyResp,
  IdReq,
  IdsReq,
  Role,
  RoleDetailsDTO,
  UpdateRoleApisReq,
  UpdateRoleMenusReq
} from "./types";

/** 创建角色 */
export function createRoleApi(data: Role): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/role/create_role`,
    method: "post",
    data: data
  });
}

/** 更新角色 */
export function updateRoleApi(data: Role): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/role/update_role`,
    method: "put",
    data: data
  });
}

/** 删除角色 */
export function deleteRoleApi(req: IdReq): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/role/delete_role`,
    method: "delete",
    data: req
  });
}

/** 查询角色 */
export function findRoleApi(req: IdReq): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/role/find_role`,
    method: "post",
    data: req
  });
}

/** 批量删除角色 */
export function deleteRoleListApi(
  req: IdsReq
): Promise<IApiResponseData<BatchResult>> {
  return http.request<IApiResponseData<BatchResult>>({
    url: `/api/v1/role/delete_role_list`,
    method: "delete",
    data: req
  });
}

/** 分页获取角色列表 */
export function findRoleListApi(
  page: PageQuery
): Promise<IApiResponseData<PageResult<Role[]>>> {
  return http.request<IApiResponseData<PageResult<Role[]>>>({
    url: `/api/v1/role/find_role_list`,
    method: "post",
    data: page
  });
}

/** 获取角色列表 */
export function findRoleResourcesApi(
  data: IdReq
): Promise<IApiResponseData<PageResult<RoleDetailsDTO[]>>> {
  return http.request<IApiResponseData<PageResult<RoleDetailsDTO[]>>>({
    url: `/api/v1/role/find_role_resources`,
    method: "post",
    data: data
  });
}

/** 更新角色菜单 */
export function updateRoleMenusApi(
  data: UpdateRoleMenusReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/role/update_role_menus`,
    method: "post",
    data: data
  });
}

/** 更新角色资源 */
export function updateRoleApisApi(
  data: UpdateRoleApisReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/role/update_role_apis`,
    method: "post",
    data: data
  });
}
