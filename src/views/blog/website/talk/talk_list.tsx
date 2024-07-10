import type { Column } from "element-plus";
import type { FormField } from "@/utils/render.tsx";
import {
  createTalkApi,
  deleteTalkApi,
  deleteTalkListApi,
  findTalkListApi,
  updateTalkApi
} from "@/api/talk.ts";

import type { TalkDetails } from "@/api/types.ts";
import { useTablePageHook } from "@/components/TablePage2/hook.tsx";

const align = "center";

const defaultOrder = { id: "desc" };

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
      return createTalkApi(data);
    case "update":
      return updateTalkApi(data);
    case "delete":
      return deleteTalkApi(data);
    case "deleteByIds":
      return deleteTalkListApi(data);
    case "list":
      return findTalkListApi(data);
    default:
      return;
  }
}

export function useTableHook() {
  return useTablePageHook<TalkDetails>(
    getSearchFields,
    getColumnFields,
    getFormFields,
    handleApi,
    defaultOrder
  );
}
