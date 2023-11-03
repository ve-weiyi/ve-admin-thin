<template>
  <div class="app-container">
    <div>
      <TablePage
        :default-order="defaultOrder"
        :get-column-fields="getColumnFields"
        :get-form-fields="getFormFields"
        :get-search-fields="getSearchFields"
        :handle-api="handleApi"
        model-name="菜单"
      />
    </div>

    <!-- 角色权限设置对话框 -->
    <!--    <el-drawer-->
    <!--      v-if="drawer"-->
    <!--      v-model="drawer"-->
    <!--      :before-close="handleClose"-->
    <!--      :show-close="false"-->
    <!--      size="40%"-->
    <!--    >-->
    <!--      <template #header>-->
    <!--        <h4 style="font-size: 20px; font-weight: bold">权限设置</h4>-->
    <!--      </template>-->
    <!--      <el-tabs type="border-card">-->
    <!--        <el-tab-pane label="角色菜单权限">-->
    <!--          <Menus ref="menus" :row="formData.menuIdList" @changeRow="onMenusChange" />-->
    <!--        </el-tab-pane>-->
    <!--        <el-tab-pane label="角色接口权限">-->
    <!--          <Resource ref="apis" :row="formData.resourceIdList" @changeRow="onResourceChange" />-->
    <!--        </el-tab-pane>-->
    <!--      </el-tabs>-->
    <!--      <template #footer>-->
    <!--        <div style="flex: auto">-->
    <!--          <el-button @click="cancelClick">cancel</el-button>-->
    <!--          <el-button type="primary" @click="confirmClick">confirm</el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-drawer>-->
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted } from "vue"
import { useTableHook } from "./hook"
import TablePage from "@/components/TablePage/TablePage.vue"

const defaultOrder = { id: "desc" }

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

onMounted(() => {})

const fun = (a, b) => {
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
