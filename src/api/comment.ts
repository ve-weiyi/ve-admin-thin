import http from "@/utils/request"
import { Comment } from './types'

/** 创建评论 */
export function createCommentApi(data: Comment): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment`,
    method: "post",
    data: data,
  })
}

/** 更新评论 */
export function updateCommentApi(data: Comment): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment`,
    method: "put",
    data: data,
  })
}

/** 删除评论 */
export function deleteCommentApi(id: number): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/comment/${id}`,
    method: "delete",
  })
}

/** 查询评论 */
export function findCommentApi(id: number): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment/${id}`,
    method: "get",
  })
}

/** 批量删除评论 */
export function deleteCommentByIdsApi(data: number[]): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/comment/batch_delete`,
    method: "delete",
    data: data,
  })
}

/** 分页获取评论列表 */
export function findCommentListApi(page: PageQuery): Promise<IApiResponseData<PageResult<Comment>>> {
  return http.request<IApiResponseData<PageResult<Comment>>>({
    url: `/api/v1/comment/list`,
    method: "post",
    data: page,
  })
}

/** 分页获取评论列表 */
export function findCommentListDetailsApi(page: PageQuery): Promise<IApiResponseData<PageResult<Comment>>> {
  return http.request<IApiResponseData<PageResult<Comment>>>({
    url: `/api/v1/comment/list/details`,
    method: "post",
    data: page,
  })
}

/** 获取用户评论列表 */
export function findCommentListBackApi(page: PageQuery): Promise<IApiResponseData<any>> {
  return http.request<IApiResponseData<any>>({
    url: `/api/v1/comment/list/back`,
    method: "post",
    data: page,
  })
}

/** 查询评论回复列表 */
export function findCommentReplyListApi(id: number, page: PageQuery): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment/${id}/reply_list`,
    method: "post",
    data: page,
  })
}

/** 点赞评论 */
export function likeCommentApi(id: number): Promise<IApiResponseData<Comment>> {
  return http.request<IApiResponseData<Comment>>({
    url: `/api/v1/comment/${id}/like`,
    method: "post",
  })
}