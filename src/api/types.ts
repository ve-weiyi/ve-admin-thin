export interface PingReq {}

export interface PingResp {
  env?: string;
  name?: string;
  version?: string;
  runtime?: string;
  description?: string;
  rpc_status?: Record<string, any>;
}

export interface UserArea {
  name?: string;
  value?: number;
}

export interface User {
  id?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
  intro?: string;
  website?: string;
  email?: string;
  status?: number;
  register_type?: string;
  ip_address?: string; // ip host
  ip_source?: string; // ip 源
  created_at?: number;
  updated_at?: number;
  roles?: RoleLabel[];
}

export interface RoleLabel {
  role_name?: string;
  role_comment?: string;
}

export interface UpdateUserStatusReq {
  user_id?: number;
  status?: number; // 状态: -1删除 0正常 1禁用
}

export interface UpdateUserRolesReq {
  user_id?: number;
  role_ids?: number[];
}

export interface RestHeader {
  header_country?: string;
  header_language?: string;
  header_timezone?: string;
  header_app_name?: string;
  header_x_user_id?: string;
  header_x_auth_token?: string;
  header_terminal_i_d?: string;
}

export interface EmptyReq {}

export interface IdReq {
  id?: number;
}

export interface IdsReq {
  i_d_s?: number[];
}

export interface PageQuery {
  limit?: PageLimit;
  sorts?: PageSort[];
  conditions?: PageCondition[];
}

export interface PageLimit {
  page?: number;
  page_size?: number;
}

export interface PageSort {
  field?: string;
  order?: string;
}

export interface PageCondition {
  field?: string; // 字段
  value?: any; // 值
  logic?: string; // and | or
  operator?: string; // = | >= | < | in | not in |....
}

export interface EmptyResp {}

export interface BatchResp {
  success_count?: number;
}

export interface PageResp {
  page?: number;
  page_size?: number;
  total?: number;
  list?: any;
}

export interface Response {
  code?: number;
  message?: string;
  data?: any;
  trace_i_d?: string;
}

export interface LoginHistory {
  id?: number;
  login_type?: string; // 登录类型
  agent?: string; // 代理
  ip_address?: string; // ip host
  ip_source?: string; // ip 源
  login_time?: string; // 创建时间
}

export interface UserApi {
  id?: number; // 主键id
  name?: string; // api名称
  path?: string; // api路径
  method?: string; // api请求方法
  parent_id?: number; // 分组id
  traceable?: number; // 是否追溯操作记录 0需要，1是
  status?: number; // 状态 1开，2关
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
  children?: UserApi[];
}

export interface UserMenu {
  id?: number; // 主键
  parent_id?: number; // 父id
  title?: string; // 菜单标题
  type?: number; // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string; // 路由地址
  name?: string; // 路由名字
  component?: string; // Layout组件
  redirect?: string; // 路由重定向
  meta?: any; // meta配置
  children?: UserMenu[];
}

export interface UserRole {
  id?: number; // 主键id
  role_p_id?: number; // 父角色id
  role_domain?: string; // 角色域
  role_name?: string; // 角色名
  role_comment?: string; // 角色备注
  is_disable?: number; // 是否禁用  0否 1是
  is_default?: number; // 是否默认角色 0否 1是
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
  menu_id_list?: number[];
  resource_id_list?: number[];
}

export interface UserApisResp {
  list?: UserApi[];
}

export interface UserMenusResp {
  list?: UserMenu[];
}

export interface UserRolesResp {
  list?: UserRole[];
}

export interface UserInfoReq {
  nickname?: string; // 昵称
  website?: string; // 网站
  intro?: string; // 简介
  avatar?: string; // 头像
}

export interface UserInfoResp {
  id?: number; // id
  user_id?: number; // 用户id
  email?: string; // 用户邮箱
  nickname?: string; // 用户昵称
  avatar?: string; // 用户头像
  phone?: string; // 用户手机号
  intro?: string; // 个人简介
  website?: string; // 个人网站
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
}

export interface LoginReq {
  username?: string;
  password?: string;
  code?: string;
}

export interface LoginResp {
  token?: Token;
  user_info?: UserInfo;
}

export interface Token {
  user_id?: number; // 用户id
  token_type?: string; // token类型,Bearer
  access_token?: string; // 访问token,过期时间较短。2h
  expires_in?: number; // 访问token过期时间
  refresh_token?: string; // 刷新token,过期时间较长。30d
  refresh_expires_in?: number; // 刷新token过期时间
  scope?: string; // 作用域
}

export interface UserInfo {
  user_id?: number; // 用户id
  username?: string; // 用户名
  nickname?: string; // 昵称
  avatar?: string; // 头像
  intro?: string; // 个人简介
  website?: string; // 个人网站
  email?: string; // 邮箱
}

export interface UserEmailReq {
  username?: string;
}

export interface ResetPasswordReq {
  username?: string;
  password?: string;
  code?: string;
}

export interface OauthLoginReq {
  platform?: string; // 平台
  code?: string; // 授权码
  state?: string; // 状态
}

export interface OauthLoginUrl {
  url?: string; // 授权地址
}

export interface Api {
  id?: number; // 主键id
  name?: string; // api名称
  path?: string; // api路径
  method?: string; // api请求方法
  parent_id?: number; // 分组id
  traceable?: number; // 是否追溯操作记录 0需要，1是
  status?: number; // 状态 1开，2关
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
}

export interface ApiDetails {
  id?: number; // 主键id
  name?: string; // api名称
  path?: string; // api路径
  method?: string; // api请求方法
  parent_id?: number; // 分组id
  traceable?: number; // 是否追溯操作记录 0需要，1是
  status?: number; // 状态 1开，2关
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
  children?: ApiDetails[];
}

export interface MenuDetails {
  id?: number; // 主键
  parent_id?: number; // 父id
  title?: string; // 菜单标题
  type?: number; // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string; // 路由地址
  name?: string; // 路由名字
  component?: string; // Layout组件
  redirect?: string; // 路由重定向
  meta?: Meta; // meta配置
  children?: MenuDetails[];
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
}

export interface Meta {
  title?: string; // 菜单名称
  icon?: string; // 菜单图标
  show_link?: boolean; // 是否在菜单中显示
  rank?: number; // 菜单升序排序
  extra_icon?: string; // 菜单名称右侧的额外图标
  show_parent?: boolean; // 是否显示父级菜单
  roles?: string[]; // 页面级别权限设置
  auths?: string[]; // 按钮级别权限设置
  keep_alive?: boolean; // 路由组件缓存
  frame_src?: string; // 内嵌的iframe链接
  frame_loading?: boolean; // iframe页是否开启首次加载动画
  transition?: Transition; // 页面加载动画
  hidden_tag?: boolean; // 是否不添加信息到标签页
  dynamic_level?: number; // 动态路由可打开的最大数量
  active_path?: string; // 将某个菜单激活
}

export interface Transition {
  name?: string; // 当前路由动画效果
  enter_transition?: string; // 进场动画
  leave_transition?: string; // 离场动画
}

export interface RouteConfigsTable {
  type?: number; // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string; // 路由地址
  name?: string; // 路由名字
  component?: string; // Layout组件
  redirect?: string; // 路由重定向
  meta?: Meta; // meta配置
  children?: RouteConfigsTable[]; // 子路由配置项
}

export interface SyncMenuRequest {
  menus?: RouteConfigsTable[];
}

// 角色
export interface Role {
  id?: number; // 主键id
  role_pid?: number; // 父角色id
  role_domain?: string; // 角色域
  role_name?: string; // 角色名
  role_comment?: string; // 角色备注
  is_disable?: number; // 是否禁用  0否 1是
  is_default?: number; // 是否默认角色 0否 1是
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
}

export interface RoleDetails {
  id?: number; // 主键id
  role_pid?: number; // 父角色id
  role_domain?: string; // 角色域
  role_name?: string; // 角色名
  role_comment?: string; // 角色备注
  is_disable?: number; // 是否禁用  0否 1是
  is_default?: number; // 是否默认角色 0否 1是
  created_at?: number; // 创建时间
  updated_at?: number; // 更新时间
  menu_id_list?: number[];
  api_id_list?: number[];
}

export interface RoleResourcesResp {
  role_id?: number;
  api_ids?: number[];
  menu_ids?: number[];
}

export interface UpdateRoleApisReq {
  role_id?: number;
  api_ids?: number[];
}

export interface UpdateRoleMenusReq {
  role_id?: number;
  menu_ids?: number[];
}
