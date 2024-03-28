<template>
  <div class="app-container">
    <el-card class="main-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 修改信息 -->
        <el-tab-pane label="修改信息" name="info">
          <div class="info-container">
            <el-upload
              :http-request="onUpload"
              :before-upload="beforeUpload"
              :on-success="afterUpload"
              :show-file-list="false"
              class="avatar-uploader"
            >
              <img
                v-if="infoForm.avatar"
                :src="infoForm.avatar"
                alt="avatar"
                class="avatar"
              />
              <i v-else class="plus avatar-uploader-icon" />
            </el-upload>
            <el-form
              :model="infoForm"
              label-width="70px"
              style="width: 320px; margin-left: 3rem"
            >
              <el-form-item label="昵称">
                <el-input v-model="infoForm.nickname" size="default" />
              </el-form-item>
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

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElTabPane,
  ElTabs,
  ElUpload,
  UploadRawFile,
  UploadRequestOptions
} from "element-plus";
import axios from "axios";
import { useAdminStoreHook } from "@/store/modules/admin";
import { uploadFileApi } from "@/api/file";
import * as imageConversion from "image-conversion";
import { UserInfo } from "@/api/types";
import { updateUserInfoApi } from "@/api/account";

// 获取缓存信息
const store = useAdminStoreHook();

const activeName = ref("info");
const infoForm = ref<UserInfo>(store.getUserInfo());
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

function onUpload(options: UploadRequestOptions) {
  console.log("onUpload", options.filename);
  return uploadFileApi("article/cover", options.file);
}

function beforeUpload(rawFile: UploadRawFile) {
  console.log("beforeUpload", rawFile.size);
  if (rawFile.size / 1024 < 500) {
    return rawFile;
  }

  // 压缩到200KB,这里的200就是要压缩的大小,可自定义
  imageConversion.compressAccurately(rawFile, 200).then((res: Blob) => {
    console.log("compressAccurately", res.size);
    return res;
  });
}

function afterUpload(response: any) {
  console.log("afterUpload", response);
  ElMessage.success(response.message);
  // store.updateAvatar(response.data.file_url)
  infoForm.value.avatar = response.data.file_url;
}

// const uploadImage = (options: UploadRequestOptions) => {
//   return updateUserAvatarApi(options.file)
// }

const updateInfo = () => {
  if (infoForm.value.nickname.trim() === "") {
    ElMessage.error("昵称不能为空");
    return false;
  }

  // 更新用户信息
  updateUserInfoApi(infoForm.value).then(res => {
    ElMessage.success(res.message);
    store.updateUserInfo(res.data);
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
      if (data.flag) {
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
});
</script>

<style scoped>
.info-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 1rem;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  width: 100px;
  height: 100px;
  margin-right: 1rem;
}

.avatar {
  width: 100%;
  height: 100%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>
