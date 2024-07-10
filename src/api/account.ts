import request from "@/utils/request";
import type {
  BatchResp,
  EmptyReq,
  EmptyResp,
  IdsReq,
  PageQuery,
  PageResp,
  UpdateUserRolesReq,
  UpdateUserStatusReq,
  UserApisResp,
  UserInfoReq,
  UserInfoResp,
  UserMenusResp,
  UserRolesResp
} from "./types";

/** "批量删除登录历史" */
export function deleteUserLoginHistoryListApi(
  data?: IdsReq
): Promise<IApiResponseData<BatchResp>> {
  return request({
    url: "/api/v1/user/delete_login_history_list",
    method: "delete",
    data: data
  });
}
/** "查询在线用户列表" */
export function findOnlineUserListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/user/find_online_user_list",
    method: "post",
    data: data
  });
}
/** "获取用户分布地区" */
export function findUserAreasApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/user/find_user_areas",
    method: "post",
    data: data
  });
}
/** "查询用户列表" */
export function findUserListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/user/find_user_list",
    method: "post",
    data: data
  });
}
/** "获取用户接口权限" */
export function getUserApisApi(
  data?: EmptyReq
): Promise<IApiResponseData<UserApisResp>> {
  return request({
    url: "/api/v1/user/get_user_apis",
    method: "get",
    data: data
  });
}
/** "获取用户信息" */
export function getUserInfoApi(
  data?: EmptyReq
): Promise<IApiResponseData<UserInfoResp>> {
  return request({
    url: "/api/v1/user/get_user_info",
    method: "get",
    data: data
  });
}
/** "获取用户菜单权限" */
export function getUserMenusApi(
  data?: EmptyReq
): Promise<IApiResponseData<UserMenusResp>> {
  return request({
    url: "/api/v1/user/get_user_menus",
    method: "get",
    data: data
  });
}
/** "获取用户角色" */
export function getUserRoleApi(
  data?: EmptyReq
): Promise<IApiResponseData<UserRolesResp>> {
  return request({
    url: "/api/v1/user/get_user_roles",
    method: "get",
    data: data
  });
}
/** "查询用户登录历史" */
export function findUserLoginHistoryListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/user/login_history",
    method: "post",
    data: data
  });
}
/** "修改用户信息" */
export function updateUserInfoApi(
  data?: UserInfoReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/user/update_user_info",
    method: "post",
    data: data
  });
}
/** "修改用户角色" */
export function updateUserRolesApi(
  data?: UpdateUserRolesReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/user/update_user_roles",
    method: "post",
    data: data
  });
}
/** "修改用户状态" */
export function updateUserStatusApi(
  data?: UpdateUserStatusReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/user/update_user_status",
    method: "post",
    data: data
  });
}
