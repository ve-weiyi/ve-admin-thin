import http from "@/utils/request"
import { LoginHistory, MenuDetails, ApiDetails, UserInfo, UserInformation, Upload, UserAccount, UpdateUserRoles, Role } from "./types"

/** 获取用户列表 */
export function findUserListApi(page: PageQuery): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/user/list`,
    method: "post",
    data: page,
  })
}

/** 获取用户地区 */
export function findUserListAreasApi(page: PageQuery): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/user/list/areas`,
    method: "post",
    data: page,
  })
}

/** 获取用户登录历史 */
export function findUserLoginHistoryApi(page: PageQuery): Promise<IApiResponseData<PageResult<LoginHistory>>> {
  return http.request<IApiResponseData<PageResult<LoginHistory>>>({
    url: `/api/v1/user/login_history`,
    method: "post",
    data: page,
  })
}

/** 获取用户菜单权限 */
export function getUserMenusApi(): Promise<IApiResponseData<MenuDetails>> {
  return http.request<IApiResponseData<MenuDetails>>({
    url: `/api/v1/user/menus`,
    method: "get",
  })
}

/** 获取用户接口权限 */
export function getUserApisApi(): Promise<IApiResponseData<ApiDetails>> {
  return http.request<IApiResponseData<ApiDetails>>({
    url: `/api/v1/user/apis`,
    method: "get",
  })
}

/** 获取用户信息 */
export function getUserInfoApi(): Promise<IApiResponseData<UserInfo>> {
  return http.request<IApiResponseData<UserInfo>>({
    url: `/api/v1/user/info`,
    method: "get",
  })
}

/** 修改用户信息 */
export function updateUserInfoApi(data: UserInformation): Promise<IApiResponseData<Upload>> {
  return http.request<IApiResponseData<Upload>>({
    url: `/api/v1/user/info`,
    method: "post",
    data: data,
  })
}

/** 更换用户头像 */
export function updateUserAvatarApi(data: Upload): Promise<IApiResponseData<Upload>> {
  return http.request<IApiResponseData<Upload>>({
    url: `/api/v1/user/avatar`,
    method: "post",
    data: data,
  })
}

/** 修改用户状态 */
export function updateUserStatusApi(data: UserAccount): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/user/update_status`,
    method: "post",
    data: data,
  })
}

/** 修改用户角色 */
export function updateUserRolesApi(data: UpdateUserRoles): Promise<IApiResponseData<Role>> {
  return http.request<IApiResponseData<Role>>({
    url: `/api/v1/user/update_roles`,
    method: "post",
    data: data,
  })
}
