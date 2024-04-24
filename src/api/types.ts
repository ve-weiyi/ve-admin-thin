export interface PingReq {
}

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
  ip_address?: string;// ip host
  ip_source?: string;// ip 源
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
  status?: number;// 状态: -1删除 0正常 1禁用
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

export interface EmptyReq {
}

export interface IdReq {
  id?: number;
}

export interface IdsReq {
  i_d_s?: number[];
}

export interface PageQuery {
  ?: PageLimit;
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
  field?: string;// 字段
  value?: any;// 值
  logic?: string;// and | or
  operator?: string;// = | >= | < | in | not in |....
}

export interface EmptyResp {
}

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
  login_type?: string;// 登录类型
  agent?: string;// 代理
  ip_address?: string;// ip host
  ip_source?: string;// ip 源
  login_time?: string;// 创建时间
}

export interface UserApi {
  id?: number;// 主键id
  name?: string;// api名称
  path?: string;// api路径
  method?: string;// api请求方法
  parent_id?: number;// 分组id
  traceable?: number;// 是否追溯操作记录 0需要，1是
  status?: number;// 状态 1开，2关
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
  children?: UserApi[];
}

export interface UserMenu {
  id?: number;// 主键
  parent_id?: number;// 父id
  title?: string;// 菜单标题
  type?: number;// 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string;// 路由地址
  name?: string;// 路由名字
  component?: string;// Layout组件
  redirect?: string;// 路由重定向
  meta?: UserMenuMeta;// meta配置
  children?: UserMenu[];
}

export interface UserMenuMeta {
  title?: string;// 菜单名称
  icon?: string;// 菜单图标
  show_link?: boolean;// 是否在菜单中显示
  rank?: number;// 菜单升序排序
  extra_icon?: string;// 菜单名称右侧的额外图标
  show_parent?: boolean;// 是否显示父级菜单
  roles?: string[];// 页面级别权限设置
  auths?: string[];// 按钮级别权限设置
  keep_alive?: boolean;// 路由组件缓存
  frame_src?: string;// 内嵌的iframe链接
  frame_loading?: boolean;// iframe页是否开启首次加载动画
  transition?: any;// 页面加载动画
  hidden_tag?: boolean;// 是否不添加信息到标签页
  dynamic_level?: number;// 动态路由可打开的最大数量
  active_path?: string;// 将某个菜单激活
}

export interface UserRole {
  id?: number;// 主键id
  role_p_id?: number;// 父角色id
  role_domain?: string;// 角色域
  role_name?: string;// 角色名
  role_comment?: string;// 角色备注
  is_disable?: number;// 是否禁用  0否 1是
  is_default?: number;// 是否默认角色 0否 1是
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
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
  nickname?: string;// 昵称
  website?: string;// 网站
  intro?: string;// 简介
  avatar?: string;// 头像
}

export interface UserInfoResp {
  id?: number;// id
  user_id?: number;// 用户id
  email?: string;// 用户邮箱
  nickname?: string;// 用户昵称
  avatar?: string;// 用户头像
  phone?: string;// 用户手机号
  intro?: string;// 个人简介
  website?: string;// 个人网站
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
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
  user_id?: number;// 用户id
  token_type?: string;// token类型,Bearer
  access_token?: string;// 访问token,过期时间较短。2h
  expires_in?: number;// 访问token过期时间
  refresh_token?: string;// 刷新token,过期时间较长。30d
  refresh_expires_in?: number;// 刷新token过期时间
  scope?: string;// 作用域
}

export interface UserInfo {
  user_id?: number;// 用户id
  username?: string;// 用户名
  nickname?: string;// 昵称
  avatar?: string;// 头像
  intro?: string;// 个人简介
  website?: string;// 个人网站
  email?: string;// 邮箱
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
  platform?: string;// 平台
  code?: string;// 授权码
  state?: string;// 状态
}

export interface OauthLoginUrl {
  url?: string;// 授权地址
}

export interface Api {
  id?: number;// 主键id
  name?: string;// api名称
  path?: string;// api路径
  method?: string;// api请求方法
  parent_id?: number;// 分组id
  traceable?: number;// 是否追溯操作记录 0需要，1是
  status?: number;// 状态 1开，2关
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface ApiDetails {
  id?: number;// 主键id
  name?: string;// api名称
  path?: string;// api路径
  method?: string;// api请求方法
  parent_id?: number;// 分组id
  traceable?: number;// 是否追溯操作记录 0需要，1是
  status?: number;// 状态 1开，2关
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
  children?: ApiDetails[];
}

export interface MenuDetails {
  id?: number;// 主键
  parent_id?: number;// 父id
  title?: string;// 菜单标题
  type?: number;// 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string;// 路由地址
  name?: string;// 路由名字
  component?: string;// Layout组件
  redirect?: string;// 路由重定向
  meta?: Meta;// meta配置
  children?: MenuDetails[];
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface Meta {
  title?: string;// 菜单名称
  icon?: string;// 菜单图标
  show_link?: boolean;// 是否在菜单中显示
  rank?: number;// 菜单升序排序
  extra_icon?: string;// 菜单名称右侧的额外图标
  show_parent?: boolean;// 是否显示父级菜单
  roles?: string[];// 页面级别权限设置
  auths?: string[];// 按钮级别权限设置
  keep_alive?: boolean;// 路由组件缓存
  frame_src?: string;// 内嵌的iframe链接
  frame_loading?: boolean;// iframe页是否开启首次加载动画
  transition?: Transition;// 页面加载动画
  hidden_tag?: boolean;// 是否不添加信息到标签页
  dynamic_level?: number;// 动态路由可打开的最大数量
  active_path?: string;// 将某个菜单激活
}

export interface Transition {
  name?: string;// 当前路由动画效果
  enter_transition?: string;// 进场动画
  leave_transition?: string;// 离场动画
}

export interface RouteConfigsTable {
  type?: number;// 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  path?: string;// 路由地址
  name?: string;// 路由名字
  component?: string;// Layout组件
  redirect?: string;// 路由重定向
  meta?: Meta;// meta配置
  children?: RouteConfigsTable[];// 子路由配置项
}

export interface SyncMenuRequest {
  menus?: RouteConfigsTable[];
}

// 角色
export interface Role {
  id?: number;// 主键id
  role_pid?: number;// 父角色id
  role_domain?: string;// 角色域
  role_name?: string;// 角色名
  role_comment?: string;// 角色备注
  is_disable?: number;// 是否禁用  0否 1是
  is_default?: number;// 是否默认角色 0否 1是
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface RoleDetails {
  id?: number;// 主键id
  role_pid?: number;// 父角色id
  role_domain?: string;// 角色域
  role_name?: string;// 角色名
  role_comment?: string;// 角色备注
  is_disable?: number;// 是否禁用  0否 1是
  is_default?: number;// 是否默认角色 0否 1是
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
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

export interface BlogHomeInfo {
  article_count?: number;// 文章数量
  category_count?: number;// 分类数量
  tag_count?: number;// 标签数量
  views_count?: string;// 访问量
  website_config?: WebsiteConfig;// 网站配置
  page_list?: PageDTO[];// 页面列表
}

export interface WebsiteConfig {
  admin_url?: string;// 后台地址
  alipay_qr_code?: string;// 支付宝二维码
  gitee?: string;// Gitee
  github?: string;// Github
  is_chat_room?: number;// 是否开启聊天室
  is_comment_review?: number;// 是否开启评论审核
  is_email_notice?: number;// 是否开启邮件通知
  is_message_review?: number;// 是否开启留言审核
  is_music_player?: number;// 是否开启音乐播放器
  is_reward?: number;// 是否开启打赏
  qq?: string;// QQ
  social_login_list?: string[];// 社交登录列表
  social_url_list?: string[];// 社交地址列表
  tourist_avatar?: string;// 游客头像
  user_avatar?: string;// 用户头像
  website_author?: string;// 网站作者
  website_avatar?: any;// 网站头像
  website_create_time?: string;// 网站创建时间
  website_intro?: string;// 网站介绍
  website_name?: string;// 网站名称
  website_notice?: string;// 网站公告
  website_record_no?: string;// 网站备案号
  websocket_url?: string;// websocket地址
  weixin_qr_code?: string;// 微信二维码
}

export interface PageDTO {
  id?: number;// 页面ID
  page_name?: string;// 页面名称
  page_label?: string;// 页面标签
  page_cover?: string;// 页面封面
}

export interface AdminHomeInfo {
  views_count?: number;// 访问量
  message_count?: number;// 留言量
  user_count?: number;// 用户量
  article_count?: number;// 文章量
  category_list?: CategoryDTO[];// 分类列表
  tag_list?: TagDTO[];// 标签列表
  article_view_rank_list?: ArticleViewRankDTO[];// 文章浏览量排行
  article_statistics_list?: ArticleStatisticsDTO[];// 每日文章生产量
  unique_view_list?: UniqueViewDTO[];// 每日用户访问量
}

export interface CategoryDTO {
  id?: number;
  category_name?: string;// 分类名
}

export interface TagDTO {
  id?: number;// 标签ID
  tag_name?: string;// 标签名
}

export interface ArticleViewRankDTO {
  id?: number;// 文章ID
  article_title?: string;// 文章标题
  count?: number;// 数量
}

export interface ArticleStatisticsDTO {
  day?: string;// 日期
  count?: number;// 数量
}

export interface UniqueViewDTO {
  day?: string;// 日期
  count?: number;// 数量
}

export interface AboutMe {
  content?: string;
}

export interface Article {
  id?: number;// id
  user_id?: number;// 作者
  category_id?: number;// 文章分类
  article_cover?: string;// 文章缩略图
  article_title?: string;// 标题
  article_content?: string;// 内容
  type?: number;// 文章类型 1原创 2转载 3翻译
  original_u_r_l?: string;// 原文链接
  is_top?: number;// 是否置顶 0否 1是
  is_delete?: number;// 是否删除  0否 1是
  status?: number;// 状态值 1公开 2私密 3评论可见
  created_at?: number;// 发表时间
  updated_at?: number;// 更新时间
}

export interface ArticleBack {
  category_name?: string;// 文章分类名
  tag_name_list?: string[];// 文章标签列表
}

export interface ArticleConditionDTO {
  article_d_t_o_list?: ArticleHome[];// 文章列表
  condition_name?: string;// 条件名
}

export interface ArticleConditionReq {
  tag_id?: number;// 文章标签ID
  category_id?: number;// 文章分类ID
}

export interface ArticleDeleteReq {
  id?: number;// 文章ID
  is_delete?: number;// 是否删除
}

export interface ArticleDetailsDTOReq {
  id?: number;// 文章ID
  article_cover?: string;// 文章缩略图
  article_title?: string;// 标题
  article_content?: string;// 内容
  like_count?: number;// 点赞量
  views_count?: number;// 浏览量
  type?: number;// 文章类型
  original_u_r_l?: string;// 原文链接
  is_top?: number;// 是否置顶
  status?: number;// 状态值 1 公开 2 私密 3 评论可见
  created_at?: number;// 发表时间
  updated_at?: number;// 更新时间
  category_name?: string;// 文章分类名
  tag_name_list?: string[];// 文章标签列表
}

export interface ArticleHome {
}

export interface ArticlePageDetailsDTO {
  last_article?: ArticlePreviewDTO;// 上一篇文章
  next_article?: ArticlePreviewDTO;// 下一篇文章
  recommend_article_list?: ArticlePreviewDTO[];// 推荐文章列表
  newest_article_list?: ArticlePreviewDTO[];// 最新文章列表
}

export interface ArticlePreviewDTO {
  id?: number;// 文章ID
  article_cover?: string;// 文章缩略图
  article_title?: string;// 标题
  created_at?: number;// 创建时间
}

export interface ArticleTopReq {
  id?: number;// 文章ID
  is_top?: number;// 是否置顶
}

export interface Category {
  id?: number;// id
  category_name?: string;// 分类名
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface CategoryDetailsDTO {
  id?: number;
  category_name?: string;// 分类名
  article_count?: number;
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface Tag {
  id?: number;// id
  tag_name?: string;// 标签名
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

export interface TagDetailsDTO {
  id?: number;// 标签ID
  tag_name?: string;// 标签名
  article_count?: number;// 文章数量
  created_at?: number;// 创建时间
  updated_at?: number;// 更新时间
}

