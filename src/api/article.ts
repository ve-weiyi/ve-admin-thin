import request from "@/utils/request";
import type {
  ArticleBackDTO,
  ArticleNewReq,
  ArticleRecycleReq,
  ArticleTopReq,
  EmptyResp,
  IdReq,
  IdsReq,
  PageQuery,
  PageResp
} from "./types";

/** "删除文章" */
export function deleteArticleApi(
  data?: IdReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/article/delete_article",
    method: "post",
    data: data
  });
}
/** "导出文章列表" */
export function exportArticleListApi(
  data?: IdsReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/article/export_article_list",
    method: "post",
    data: data
  });
}
/** "查询文章" */
export function findArticleApi(
  data?: IdReq
): Promise<IApiResponseData<ArticleBackDTO>> {
  return request({
    url: "/api/v1/admin/article/find_article",
    method: "post",
    data: data
  });
}
/** "查询文章列表" */
export function findArticleListApi(
  data?: PageQuery
): Promise<IApiResponseData<PageResp>> {
  return request({
    url: "/api/v1/admin/article/find_article_list",
    method: "post",
    data: data
  });
}
/** "回收文章" */
export function recycleArticleApi(
  data?: ArticleRecycleReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/article/recycle_article",
    method: "post",
    data: data
  });
}
/** "保存文章" */
export function saveArticleApi(
  data?: ArticleNewReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/article/save_article",
    method: "post",
    data: data
  });
}
/** "置顶文章" */
export function topArticleApi(
  data?: ArticleTopReq
): Promise<IApiResponseData<EmptyResp>> {
  return request({
    url: "/api/v1/admin/article/top_article",
    method: "post",
    data: data
  });
}
