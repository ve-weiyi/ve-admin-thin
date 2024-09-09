<template>
  <div class="app-container">
    <el-card class="main-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 修改信息 -->
        <el-tab-pane label="修改信息" name="info">
          <div class="info-container">
            <AvatarCropper
              :src="infoForm.avatar"
              :fixed-number="[1, 1]"
              @on-confirm="confirmUpload"
            />
            <el-form
              :model="infoForm"
              label-width="70px"
              style="width: 320px; margin-left: 3rem"
            >
              <el-form-item label="昵称">
                <el-input v-model="infoForm.nickname" size="default" />
              </el-form-item>
              <!--              <el-form-item label="邮箱">-->
              <!--                <el-input v-model="infoForm.email" size="default" />-->
              <!--              </el-form-item>-->
              <el-form-item label="个人简介">
                <el-input v-model="infoForm.intro" size="default" />
              </el-form-item>
              <el-form-item label="个人网站">
                <el-input v-model="infoForm.website" size="default" />
              </el-form-item>
              <el-button
                size="default"
                style="margin-left: 4.375rem"
                type="primary"
                @click="updateInfo"
              >
                修改
              </el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <!-- 修改密码 -->
        <el-tab-pane label="修改密码" name="password">
          <el-form
            :model="passwordForm"
            label-width="70px"
            style="width: 320px"
          >
            <el-form-item label="旧密码">
              <el-input
                v-model="passwordForm.oldPassword"
                show-password
                size="small"
                @keyup.enter="updatePassword"
              />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                v-model="passwordForm.newPassword"
                show-password
                size="small"
                @keyup.enter="updatePassword"
              />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input
                v-model="passwordForm.confirmPassword"
                show-password
                size="small"
                @keyup.enter="updatePassword"
              />
            </el-form-item>
            <el-button
              size="default"
              style="margin-left: 4.4rem"
              type="primary"
              @click="updatePassword"
            >
              修改
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { useAdminStoreHook } from "@/store/blog/admin.ts";
import { uploadFileApi } from "@/api/file";
import { UserInfoReq } from "@/api/types";
import { getUserInfoApi, updateUserInfoApi } from "@/api/account";
import AvatarCropper from "./AvatarCropper.vue";

// 获取缓存信息
const store = useAdminStoreHook();

const activeName = ref("info");
const infoForm = ref<UserInfoReq>({});
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const notice = ref("");

const handleClick = tab => {
  if (tab.index === 2 && notice.value === "") {
    axios.get("/api/admin/notice").then(({ data }) => {
      notice.value = data.data;
    });
  }
};

function confirmUpload(file: Blob) {
  const data = {
    label: "avatar",
    file: file,
    file_size: file.size,
    file_md5: ""
  };
  uploadFileApi(data).then(response => {
    console.log("confirmUpload", response);
    ElMessage.success(response.message);
    infoForm.value.avatar = response.data.file_url;
  });
}

const getUserInfo = () => {
  getUserInfoApi().then(res => {
    store.setUserInfo(res.data);
    infoForm.value = res.data;
  });
};

const updateInfo = () => {
  if (infoForm.value.nickname.trim() === "") {
    ElMessage.error("昵称不能为空");
    return false;
  }

  // 更新用户信息
  updateUserInfoApi(infoForm.value).then(res => {
    ElMessage.success(res.message);
    getUserInfo();
  });
};

const updatePassword = () => {
  if (passwordForm.value.oldPassword.trim() === "") {
    ElMessage.error("旧密码不能为空");
    return false;
  }
  if (passwordForm.value.newPassword.trim() === "") {
    ElMessage.error("新密码不能为空");
    return false;
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.error("新密码不能少于6位");
    return false;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error("两次密码输入不一致");
    return false;
  }
  axios
    .put("/api/admin/users/password", passwordForm.value)
    .then(({ data }) => {
      if (data.logic) {
        passwordForm.value.oldPassword = "";
        passwordForm.value.newPassword = "";
        passwordForm.value.confirmPassword = "";
        ElMessage.success(data.message);
      } else {
        ElMessage.error(data.message);
      }
    });
};

onMounted(() => {
  console.log("mounted", store);
  getUserInfo();
});
</script>

<style scoped>
.info-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 1rem;
}
</style>
