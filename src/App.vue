<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ElConfigProvider } from "element-plus"
import en from "element-plus/dist/locale/en.mjs";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { ReDialog } from "@/components/ReDialog"
import { usePermissionStoreHook } from "@/store/modules/permission"

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh" ? zhCn : en
    },
  },
  mounted() {
    console.log("App mounted")
    // 刷新页面时，缓存会失效。需要拉取用户菜单
    usePermissionStoreHook().handleWholeMenus([])
  },
})
</script>
