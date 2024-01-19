<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref, toRaw } from "vue"
import { useI18n } from "vue-i18n"
import Motion from "./utils/motion"
import { useRouter } from "vue-router"
import { message } from "@/utils/message"
import { loginRules } from "./utils/rule"
import phone from "./components/phone.vue"
import qrCode from "./components/qrCode.vue"
import regist from "./components/regist.vue"
import update from "./components/update.vue"
import { useNav } from "@/layout/hooks/useNav"
import type { FormInstance } from "element-plus"
import { $t, transformI18n } from "@/plugins/i18n"
import { operates, thirdParty } from "./utils/enums"
import { useLayout } from "@/layout/hooks/useLayout"
import { avatar, bg, illustration } from "./utils/static"
import TypeIt from "@/components/ReTypeit"
import { ReImageVerify } from "@/components/ReImageVerify"
import { useRenderIcon } from "@/components/ReIcon/src/hooks"
import { useTranslationLang } from "@/layout/hooks/useTranslationLang"
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange"

import dayIcon from "@/assets/svg/day.svg?component"
import darkIcon from "@/assets/svg/dark.svg?component"
import globalization from "@/assets/svg/globalization.svg?component"
import Lock from "@iconify-icons/ri/lock-fill"
import Check from "@iconify-icons/ep/check"
import User from "@iconify-icons/ri/user-3-fill"
import { loginApi } from "@/api/auth"
import { useAdminStoreHook } from "@/store/modules/admin"
import { getUserMenusApi } from "@/api/user"
import { usePermissionStoreHook } from "@/store/modules/permission"

defineOptions({
  name: "Login",
})

const imgCode = ref("")
const router = useRouter()
const loading = ref(false)
const checked = ref(false)
const ruleFormRef = ref<FormInstance>()
const currentPage = ref(0)

const { t } = useI18n()
const { initStorage } = useLayout()
initStorage()
const { dataTheme, dataThemeChange } = useDataThemeChange()
dataThemeChange()
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav()
const { locale, translationCh, translationEn } = useTranslationLang()

const ruleForm = reactive({
  username: "admin@qq.com",
  password: "admin@qq.com",
  verifyCode: "",
})

const onLogin = async(formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loginApi(ruleForm)
        .then((res) => {
          loading.value = false
          console.log("res", res)
          message("登录成功", { type: "success" })
          // 保存token
          useAdminStoreHook().login(res.data)
          // 拉取用户菜单
          getUserMenusApi().then((res) => {
            console.log("getUserMenusApi res", res)
          })
          // handleAsyncRoutes(asyncRoutes)
          usePermissionStoreHook().handleWholeMenus([])
          // 跳转到首页
          router.push({ path: "/welcome" })
          // useUserStoreHook().loginByUser(res.data)
          // 获取后端路由
          // initRouter().then(() => {
          //   router.push(getTopMenu(true).path)
          //   message("登录成功", { type: "success" })
          // })
        })
        .catch((err) => {
          loading.value = false
          message(err.message, { type: "error" })
        })
    } else {
      loading.value = false
      return fields
    }
  })
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value)
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress)
})

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress)
})
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        inline-prompt
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization
          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              :style="getDropdownItemStyle(locale, 'zh')"
              @click="translationCh"
            >
              <IconifyIconOffline v-show="locale === 'zh'" :icon="Check" class="check-zh" />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              :style="getDropdownItemStyle(locale, 'en')"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">
              <TypeIt :cursor="false" :speed="150" :values="[title]" />
            </h2>
          </Motion>

          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: transformI18n($t('login.usernameReg')),
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  :placeholder="t('login.username')"
                  :prefix-icon="useRenderIcon(User)"
                  clearable
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  :placeholder="t('login.password')"
                  :prefix-icon="useRenderIcon(Lock)"
                  clearable
                  show-password
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.verifyCode"
                  :placeholder="t('login.verifyCode')"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                  clearable
                >
                  <template v-slot:append>
                    <ReImageVerify v-model:code="imgCode" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="checked">
                    {{ t("login.remember") }}
                  </el-checkbox>
                  <el-button link type="primary" @click="currentPage = 4">
                    {{ t("login.forget") }}
                  </el-button>
                </div>
                <el-button
                  :loading="loading"
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  @click="onLogin(ruleFormRef)"
                >
                  {{ t("login.login") }}
                </el-button>
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="currentPage = index + 1"
                  >
                    {{ t(item.title) }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>

          <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-gray-500 text-xs">{{ t("login.thirdLogin") }}</p>
              </el-divider>
              <div class="w-full flex justify-evenly">
                <span v-for="(item, index) in thirdParty" :key="index" :title="t(item.title)">
                  <IconifyIconOnline
                    :icon="`ri:${item.icon}-fill`"
                    class="cursor-pointer text-gray-500 hover:text-blue-400"
                    width="20"
                  />
                </span>
              </div>
            </el-form-item>
          </Motion>
          <!-- 手机号登录 -->
          <phone v-if="currentPage === 1" @onBack="() => (currentPage = 0)" />
          <!-- 二维码登录 -->
          <qrCode v-if="currentPage === 2" @onBack="() => (currentPage = 0)" />
          <!-- 注册 -->
          <regist v-if="currentPage === 3" @onBack="() => (currentPage = 0)" />
          <!-- 忘记密码 -->
          <update v-if="currentPage === 4" @onBack="() => (currentPage = 0)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
