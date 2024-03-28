<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import Motion from "../utils/motion";
import ReQrcode from "@/components/ReQrcode";
import { useVerifyCode } from "@/views/login/utils/verifyCode";

const { t } = useI18n();
const emit = defineEmits(["onBack"]);

function onBack() {
  useVerifyCode().end();
  emit("onBack");
}
</script>

<template>
  <Motion class="-mt-2 -mb-2">
    <ReQrcode :text="t('login.test')" />
  </Motion>
  <Motion :delay="100">
    <el-divider>
      <p class="text-gray-500 text-xs">{{ t("login.tip") }}</p>
    </el-divider>
  </Motion>
  <Motion :delay="150">
    <el-button class="w-full mt-4" @click="onBack">
      {{ t("login.back") }}
    </el-button>
  </Motion>
</template>
