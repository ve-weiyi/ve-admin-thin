<template>
  <div class="app-container">
    <div>
      <TablePage
        ref="tableRef"
        :default-order="defaultOrder"
        :get-column-fields="getColumnFields"
        :get-form-fields="getFormFields"
        :get-search-fields="getSearchFields"
        :handle-api="handleApi"
        table-name="角色"
      >
        <template #operation="{ record, value }">
          <el-button
            class="table-text-button"
            text
            type="primary"
            size="small"
            icon="editPen"
            @click="
              (evt: MouseEvent) => {
                openDrawer(record, value);
              }
            "
          >
            重置权限
          </el-button>
          <el-button
            class="table-text-button"
            text
            type="primary"
            size="small"
            icon="editPen"
          >
            修改
          </el-button>
          <el-popconfirm title="确定删除吗？">
            <template #reference>
              <el-button
                text
                type="danger"
                size="small"
                class="table-text-button"
                icon="delete"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </TablePage>
    </div>

    <!-- 角色权限设置对话框 -->
    <el-drawer
      v-if="drawer"
      v-model="drawer"
      :before-close="handleClose"
      :show-close="false"
      size="40%"
    >
      <template #header>
        <h4 style="font-size: 20px; font-weight: bold">权限设置</h4>
      </template>
      <el-tabs type="border-card">
        <el-tab-pane label="角色菜单权限">
          <Menus
            ref="menus"
            :row="formData.menu_ids"
            :tree-data="menuList"
            @changeRow="onMenusChange"
          />
        </el-tab-pane>
        <el-tab-pane label="角色接口权限">
          <Api
            ref="apis"
            :row="formData.api_ids"
            :tree-data="apiList"
            @changeRow="onApiChange"
          />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick">confirm</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from "vue";
import { useTableHook } from "./hook";
import TablePage from "@/components/TablePage2/TablePage.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  findRoleResourcesApi,
  updateRoleApisApi,
  updateRoleMenusApi
} from "@/api/role";
import Menus from "./components/menus.vue";
import Api from "./components/api.vue";
import { findApiListApi } from "@/api/api.ts";
import { findMenuListApi } from "@/api/menu.ts";

const defaultOrder = { id: "desc" };

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

const tableRef = ref<InstanceType<typeof TablePage>>();

const drawer = ref(false);
const menuList = ref([]);
const apiList = ref([]);
const activeMenus = ref([]);
const activeApis = ref([]);
const formData = ref<any>();

const onMenusChange = (key: any, value: any) => {
  console.log("onMenusChange", key, value);
  activeMenus.value = value;
};
const onApiChange = (key: any, value: any) => {
  console.log("onApiChange", key, value);
  activeApis.value = value;
};

const handleClose = (done: () => void) => {
  drawer.value = false;
};

function cancelClick() {
  drawer.value = false;
}

function confirmClick() {
  ElMessageBox.confirm(`是否要更新角色权限?`)
    .then(() => {
      updateMenus();
      updateApis();

      drawer.value = false;
    })
    .catch(() => {
      // catch error
    });
}

const openDrawer = (r, v) => {
  console.log("row", r, v);

  findRoleResourcesApi({
    id: v.id
  }).then(res => {
    formData.value = res.data;
    drawer.value = true;
  });
};

function updateMenus() {
  const v1 = activeMenus.value
    ? JSON.stringify(activeMenus.value.sort(fun))
    : "[]";
  const v2 = formData.value.menu_ids
    ? JSON.stringify(formData.value.menu_ids.sort(fun))
    : "[]";

  const isEqual = v1 === v2;
  console.log("check", v1, isEqual, v1 != "[]" && !isEqual);

  if (!isEqual) {
    updateRoleMenusApi({
      role_id: formData.value.role_id,
      menu_ids: activeMenus.value
    }).then(res => {
      ElMessage.success("操作成功");
      tableRef.value.refreshList();
    });
  }
}

function updateApis() {
  const v1 = activeApis.value
    ? JSON.stringify(activeApis.value.sort(fun))
    : "[]";
  const v2 = formData.value.api_ids
    ? JSON.stringify(formData.value.api_ids.sort(fun))
    : "[]";

  const isEqual = v1 === v2;
  console.log("check", v1, v2, isEqual, v1 != "[]" && !isEqual);

  if (!isEqual) {
    updateRoleApisApi({
      role_id: formData.value.role_id,
      api_ids: activeApis.value
    }).then(res => {
      ElMessage.success("操作成功");
      tableRef.value.refreshList();
    });
  }
}

const fun = (a: number, b: number) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

onMounted(() => {
  findApiListApi({}).then(res => {
    apiList.value = res.data.list;
  });

  findMenuListApi({}).then(res => {
    menuList.value = res.data.list;
  });
});

defineComponent({
  name: "Role"
});
</script>
