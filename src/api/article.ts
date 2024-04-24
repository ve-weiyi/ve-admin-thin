import http from "@/utils/request";
import type {
  Article,
  ArticleBack,
  ArticleConditionDTO,
  ArticleConditionReq,
  ArticleDeleteReq,
  ArticleDetailsDTOReq,
  ArticleHome,
  ArticlePageDetailsDTO,
  ArticlePreviewDTO,
  ArticleTopReq,
  EmptyResp,
  IdReq,
  PageQuery
} from "./types";

/** "保存文章" */
export function saveArticleApi(
  data?: ArticleDetailsDTOReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/admin/article`,
    method: "post",
    data: data
  });
}

/** "删除文章" */
export function deleteArticleApi(
  data?: IdReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/admin/article`,
    method: "delete",
    data: data
  });
}

/** "查询文章" */
export function findArticleApi(
  data?: IdReq
): Promise<IApiResponseData<ArticleBack>> {
  return http.request<IApiResponseData<ArticleBack>>({
    url: `/api/v1/admin/article`,
    method: "get",
    data: data
  });
}

/** "分页获取文章列表" */
export function findArticleListApi(
  data?: PageQuery
): Promise<IApiResponseData<ArticleBack[]>> {
  return http.request<IApiResponseData<ArticleBack[]>>({
    url: `/api/v1/admin/find_article_list`,
    method: "post",
    data: data
  });
}

/** "删除文章-逻辑删除" */
export function updateArticleDeleteApi(
  data?: ArticleDeleteReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/admin/article/delete`,
    method: "put",
    data: data
  });
}

/** "更新文章" */
export function updateArticleTopApi(
  data?: ArticleTopReq
): Promise<IApiResponseData<EmptyResp>> {
  return http.request<IApiResponseData<EmptyResp>>({
    url: `/api/v1/admin/article/top`,
    method: "put",
    data: data
  });
}

/** "文章归档(时间轴)" */
export function findArticleArchivesApi(
  data?: PageQuery
): Promise<IApiResponseData<ArticlePreviewDTO[]>> {
  return http.request<IApiResponseData<ArticlePreviewDTO[]>>({
    url: `/api/v1/article/archives`,
    method: "post",
    data: data
  });
}

/** "通过标签或者id获取文章列表" */
export function findArticleSeriesApi(
  data?: ArticleConditionReq
): Promise<IApiResponseData<ArticleConditionDTO>> {
  return http.request<IApiResponseData<ArticleConditionDTO>>({
    url: `/api/v1/article/series`,
    method: "post",
    data: data
  });
}

/** "文章相关推荐" */
export function findArticleDetailsApi(
  data?: IdReq
): Promise<IApiResponseData<ArticlePageDetailsDTO>> {
  return http.request<IApiResponseData<ArticlePageDetailsDTO>>({
    url: `/api/v1/article/:id/details`,
    method: "get",
    data: data
  });
}

/** "分页获取文章列表" */
export function findArticleHomeListApi(
  data?: PageQuery
): Promise<IApiResponseData<ArticleHome[]>> {
  return http.request<IApiResponseData<ArticleHome[]>>({
    url: `/api/v1/article/list`,
    method: "post",
    data: data
  });
}

/** "点赞文章" */
export function likeArticleApi(
  data?: IdReq
): Promise<IApiResponseData<Article>> {
  return http.request<IApiResponseData<Article>>({
    url: `/api/v1/article/:id/like`,
    method: "put",
    data: data
  });
}
