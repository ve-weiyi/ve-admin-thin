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
        model-name="菜单"
      />
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
          <Menus ref="menus" :row="formData.menu_id_list" @changeRow="onMenusChange" />
        </el-tab-pane>
        <el-tab-pane label="角色接口权限">
          <Resource ref="apis" :row="formData.resource_id_list" @changeRow="onResourceChange" />
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
import { defineComponent, onMounted, ref } from "vue"
import { useTableHook } from "./hook"
import TablePage from "@/components/TablePage/TablePage.vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { updateRoleMenusApi, updateRoleResourcesApi } from "@/api/role"
import Menus from "./components/menus.vue"
import Resource from "./components/resource.vue"

const defaultOrder = { id: "desc" }

const {
  getSearchFields,
  getColumnFields,
  getFormFields,
  handleApi,
  drawer,
  activeMenus,
  activeResources,
  formData,
  openDrawer,
} = useTableHook()

const tableRef = ref<InstanceType<typeof TablePage>>()
onMounted(() => {
})

const onMenusChange = (key: any, value: any) => {
  console.log("onMenusChange", key, value)
  activeMenus.value = value
}
const onResourceChange = (key: any, value: any) => {
  console.log("onResourceChange", key, value)
  activeResources.value = value
}

const handleClose = (done: () => void) => {
  drawer.value = false
}

function cancelClick() {
  drawer.value = false
}

function confirmClick() {
  ElMessageBox.confirm(`是否要更新角色权限?`)
    .then(() => {
      updateMenus()
      updateResources()

      drawer.value = false
    })
    .catch(() => {
      // catch error
    })
}

function updateMenus() {
  const v1 = activeMenus.value ? JSON.stringify(activeMenus.value.sort(fun)) : "[]"
  const v2 = formData.value.menu_id_list
    ? JSON.stringify(formData.value.menu_id_list.sort(fun))
    : "[]"

  const isEqual = v1 === v2
  console.log("check", v1, isEqual, v1 != "[]" && !isEqual)

  if (!isEqual) {
    updateRoleMenusApi({
      role_id: formData.value.id,
      menu_ids: activeMenus.value,
    }).then((res) => {
      ElMessage.success("操作成功")
      tableRef.value.refreshList()
    })
  }
}

function updateResources() {
  const v1 = activeResources.value ? JSON.stringify(activeResources.value.sort(fun)) : "[]"
  const v2 = formData.value.resource_id_list
    ? JSON.stringify(formData.value.resource_id_list.sort(fun))
    : "[]"

  const isEqual = v1 === v2
  console.log("check", v1, v2, isEqual, v1 != "[]" && !isEqual)

  if (!isEqual) {
    updateRoleResourcesApi({
      role_id: formData.value.id,
      resource_ids: activeResources.value,
    }).then((res) => {
      ElMessage.success("操作成功")
      tableRef.value.refreshList()
    })
  }
}

const fun = (a: number, b: number) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

defineComponent({
  name: "Role",
})
</script>
