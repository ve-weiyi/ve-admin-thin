import http from "@/utils/request";
import type { UploadFileReq, UploadFileResp } from "@/api/types.ts";

export function uploadFileApi(
  data?: UploadFileReq
): Promise<IApiResponseData<UploadFileResp>> {
  const formData = new FormData();
  formData.append("label", data.label);
  formData.append("file", data.file);
  formData.append("file_size", data.file_size);
  formData.append("file_md5", data.file_md5);

  return http.request<IApiResponseData<any>>({
    url: `/api/v1/upload/upload_file`,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
