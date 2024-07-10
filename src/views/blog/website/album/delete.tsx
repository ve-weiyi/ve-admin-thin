import type { Column } from "element-plus";
import type { FormField } from "@/utils/render.tsx";
import {
  createPhotoApi,
  deletePhotoApi,
  deletePhotoListApi,
  findPhotoListApi,
  updatePhotoApi
} from "@/api/photo.ts";
import type { Photo } from "@/api/types.ts";
import { useTablePageHook } from "@/components/TablePage2/hook.tsx";

const align = "center";

function getSearchFields(): FormField[] {
  return [];
}

function getColumnFields(): Column[] {
  return [];
}

function getFormFields(formData: any): FormField[] {
  return [];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return createPhotoApi(data);
    case "update":
      return updatePhotoApi(data);
    case "delete":
      return deletePhotoApi(data);
    case "deleteByIds":
      return deletePhotoListApi(data);
    case "list":
      return findPhotoListApi(data);
    default:
      return;
  }
}

const defaultOrder = { id: "desc" };

export function useTableHook() {
  return useTablePageHook<Photo>(
    getSearchFields,
    getColumnFields,
    getFormFields,
    handleApi,
    defaultOrder
  );
}
