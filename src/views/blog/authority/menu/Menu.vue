<template>
  <div>
    <TablePage
      ref="tableRef"
      table-title="菜单管理"
      table-name="菜单"
      :add-enable="true"
      :edit-enable="true"
      :default-order="defaultOrder"
      :handle-api="handleApi"
      :get-column-fields="getColumnFields"
      :get-form-fields="getFormFields"
      :get-search-fields="getSearchFields"
    >
      <template #toolbar>
        <el-button icon="check" size="default" type="success" @click="Sync">
          同步菜单
        </el-button>
        <el-button icon="delete" size="default" type="danger" @click="Clean">
          重置菜单
        </el-button>
      </template>
      <template #form-component="{ formData, formFields }">
        <MenuForm
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :menu-options="parentOptions"
        />
      </template>
    </TablePage>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useTableHook } from "./hook";
import MenuForm from "./form.vue";
import { formRules } from "./utils/rule.ts";

import TablePage from "@/components/TablePage2/TablePage.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { constantMenus } from "@/router";
import { cleanMenuListApi, syncMenuListApi } from "@/api/menu.ts";
import { RouteConfigsTable } from "@/api/types.ts";

const defaultOrder = { id: "asc" };

const {
  getSearchFields,
  getColumnFields,
  getFormFields,
  handleApi,
  parentOptions
} = useTableHook();

function Clean(evt: MouseEvent) {
  ElMessageBox.confirm(
    `确认要<strong>清空菜单列表并重置数据库吗</strong>`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      cleanMenuListApi({}).then(res => {
        ElMessage.success("清空成功");
      });
    })
    .catch(() => {
      ElMessage.warning("清空取消");
    });
}

function Sync(evt: MouseEvent) {
  ElMessageBox.confirm(
    `确认要<strong>同步菜单列表到数据库吗</strong>`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      const menus = constantMenus as RouteConfigsTable[];
      syncMenuListApi({ menus: convertMenu(menus) }).then(res => {
        ElMessage.success("同步成功");
      });
    })
    .catch(() => {
      ElMessage.warning("同步取消");
    });

  console.log("menu-->", constantMenus);
}

function convertMenu(menus: RouteConfigsTable[]) {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].component) {
      menus[i].component = menus[i].component.toString();
    }
    if (menus[i].children) {
      menus[i].children = convertMenu(menus[i].children);
    }
  }

  return menus;
}

const formRef = ref(null);
onMounted(() => {
  console.log("menu-->", formRef.value);
  // resetTable()
  // refreshList()
});
</script>

<style lang="scss" scoped></style>
