import { computed, onMounted, reactive, ref, toRefs } from "vue";
import {
  type Column,
  ElMessage,
  type FormInstance,
  type FormRules,
  type TableInstance
} from "element-plus";
import type { FormField } from "@/utils/render";
import cloneDeep from "lodash/cloneDeep";

export function useTablePageHook<T>(
  getSearchFields: () => FormField[],
  getColumnFields: () => Column[],
  getFormFields: (formData: any) => FormField[],
  handleApi: (event: string, data: any) => any,
  defaultOrder: any = { id: "desc" }
) {
  return {};
}
