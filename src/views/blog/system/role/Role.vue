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
        table-title="角色列表"
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
                tableRef.openForm(value);
              }
            "
          >
            修改
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="
              (evt: MouseEvent) => {
                console.log('delete', value);
                tableRef.onDelete({ id: value.id });
              }
            "
          >
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
          <el-button
            class="table-text-button"
            text
            type="primary"
            size="small"
            icon="edit"
            @click="
              (evt: MouseEvent) => {
                openDrawer(record, value);
              }
            "
          >
            权限
          </el-button>
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
        <h5 style="font-size: 20px; font-weight: bold">权限设置</h5>
      </template>
      <el-tabs type="border-card" style="height: 80%">
        <el-tab-pane label="角色菜单权限">
          <Tree
            ref="menuTree"
            :tree-data="menuList"
            :default-check-ids="formData.menu_ids"
            @on-node-check="onMenusChange"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }} {{ data.path }}</span>
            </template>
          </Tree>
        </el-tab-pane>
        <el-tab-pane label="角色接口权限">
          <Tree
            ref="apiTree"
            :tree-data="apiList"
            :default-check-ids="formData.api_ids"
            @on-node-check="onApiChange"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }} {{ data.path }}</span>
            </template>
          </Tree>
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

<script setup lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useTableHook } from "./hook.tsx";
import TablePage from "@/components/TablePage/TablePage.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  findRoleResourcesApi,
  updateRoleApisApi,
  updateRoleMenusApi
} from "@/api/role.ts";
import Tree from "./components/tree.vue";
import { findApiListApi } from "@/api/api.ts";
import { findMenuListApi } from "@/api/menu.ts";

const defaultOrder = { id: "desc" };

const { getSearchFields, getColumnFields, getFormFields, handleApi } =
  useTableHook();

const tableRef = ref<InstanceType<typeof TablePage>>();
const menuList = ref([]);
const apiList = ref([]);

const drawer = ref(false);
const formData = ref<any>();
const menuTree = ref();
const apiTree = ref();

const onMenusChange = (value: any) => {
  console.log("onMenusChange", value);
};
const onApiChange = (value: any) => {
  console.log("onApiChange", value);
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
  const ids = menuTree.value.getCheckedKeys();

  const v1 = ids ? JSON.stringify(ids.sort(fun)) : "[]";
  const v2 = formData.value.menu_ids
    ? JSON.stringify(formData.value.menu_ids.sort(fun))
    : "[]";

  const isEqual = v1 === v2;
  console.log("check", v1, isEqual, v1 != "[]" && !isEqual);

  if (!isEqual) {
    updateRoleMenusApi({
      role_id: formData.value.role_id,
      menu_ids: ids
    }).then(res => {
      ElMessage.success("操作成功");
      tableRef.value.refreshList();
    });
  }
}

function updateApis() {
  const ids = apiTree.value.getCheckedKeys();

  const v1 = ids ? JSON.stringify(ids.sort(fun)) : "[]";
  const v2 = formData.value.api_ids
    ? JSON.stringify(formData.value.api_ids.sort(fun))
    : "[]";

  const isEqual = v1 === v2;
  console.log("check", v1, v2, isEqual, v1 != "[]" && !isEqual);

  if (!isEqual) {
    updateRoleApisApi({
      role_id: formData.value.role_id,
      api_ids: ids
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
