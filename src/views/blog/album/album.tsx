import type { Column } from "element-plus";
import type { FormField } from "@/utils/render";
import {
  createPhotoAlbumApi,
  deletePhotoAlbumApi,
  deletePhotoAlbumListApi,
  findPhotoAlbumListApi,
  updatePhotoAlbumApi
} from "@/api/photo_album";
import type { PhotoAlbum } from "@/api/types";
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
      return createPhotoAlbumApi(data);
    case "update":
      return updatePhotoAlbumApi(data);
    case "delete":
      return deletePhotoAlbumApi(data);
    case "deleteByIds":
      return deletePhotoAlbumListApi(data);
    case "list":
      return findPhotoAlbumListApi(data);
    default:
      return;
  }
}

const defaultOrder = { id: "desc" };

export function useTableHook() {
  return useTablePageHook<PhotoAlbum>(
    getSearchFields,
    getColumnFields,
    getFormFields,
    handleApi,
    defaultOrder
  );
}
