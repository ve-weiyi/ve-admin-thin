<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="operation-container">
        <el-button
          icon="plus"
          size="default"
          type="primary"
          @click="openForm(null)"
        >
          新建相册
        </el-button>
        <div style="margin-left: auto">
          <el-button
            icon="delete"
            size="default"
            style="margin-right: 1rem"
            text
            type="primary"
            @click="batchDeleteVisibility == true"
          >
            回收站
          </el-button>
          <el-input
            v-model="searchData.albumName"
            placeholder="请输入相册名"
            prefix-icon="search"
            size="default"
            style="width: 200px"
            @keyup.enter="refreshList"
          />
          <el-button
            icon="search"
            size="default"
            style="margin-left: 1rem"
            type="primary"
            @click="refreshList"
          >
            搜索
          </el-button>
        </div>
      </div>
      <!-- 相册列表 -->
      <el-row v-loading="loading" :gutter="12" class="album-container">
        <!-- 空状态 -->
        <el-empty v-if="!tableData" description="暂无相册" />
        <el-col v-for="item in tableData" :key="item.id" :md="6">
          <div class="album-item" @click="checkPhoto(item)">
            <!-- 相册操作 -->
            <div class="album-operation">
              <el-dropdown @command="handleCommand">
                <i class="more" style="color: #fff" />
                <el-dropdown-menu v-slot="dropdown">
                  <el-dropdown-item :command="'update' + JSON.stringify(item)">
                    <i class="el-icon-edit" />编辑
                  </el-dropdown-item>
                  <el-dropdown-item :command="'delete' + item.id">
                    <i class="delete" />删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="album-photo-count">
              <div>{{ item.photo_count }}</div>
              <el-icon v-if="item.status === 2">
                <Lock />
              </el-icon>
            </div>
            <el-image :src="item.album_cover" class="album-cover" fit="cover" />
            <div class="album-name">{{ item.album_name }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        :current-page="pagination.currentPage"
        :hide-on-single-page="true"
        :layout="pagination.layout"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 新增模态框 -->
      <el-dialog v-model="formVisibility" top="10vh" width="35%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon>
              <MoreFilled />
            </el-icon>
            {{ dialogTitle }}}
          </div>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          label-width="80px"
          size="default"
        >
          <el-form-item label="相册名称">
            <el-input v-model="formData.albumName" style="width: 220px" />
          </el-form-item>
          <el-form-item label="相册描述">
            <el-input v-model="formData.albumDesc" style="width: 220px" />
          </el-form-item>
          <el-form-item label="相册封面">
            <el-upload
              :before-upload="beforeUpload"
              :http-request="uploadImage"
              :on-success="uploadCover"
              :show-file-list="false"
              class="upload-cover"
              drag
              multiple
            >
              <i v-if="!formData.albumCover" class="el-icon-upload" />
              <div v-if="!formData.albumCover" class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <img
                v-else
                :src="formData.albumCover"
                height="180px"
                width="360px"
              />
            </el-upload>
          </el-form-item>
          <el-form-item label="发布形式">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">公开</el-radio>
              <el-radio :label="2">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeForm">取 消</el-button>
          <el-button type="primary" @click="submitForm(formData)">
            确 定
          </el-button>
        </template>
      </el-dialog>
      <!-- 删除对话框 -->
      <el-dialog v-model="batchDeleteVisibility" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <Warning />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除该相册？</div>
        <template #footer>
          <el-button @click="batchDeleteVisibility = false">取 消</el-button>
          <el-button type="primary" @click="onDelete(formData)">
            确 定
          </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTableHook } from "./album";
import { useRouter } from "vue-router";
import * as imageConversion from "image-conversion";
import { UploadRequestOptions } from "element-plus";
import { uploadFileApi } from "@/api/file";

const {
  onDelete,
  onDeleteByIds,
  refreshList,
  handleSortChange,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  openForm,
  closeForm,
  submitForm,
  resetForm,
  resetSearch,
  resetTable,
  pagination,
  loading,
  batchDeleteVisibility,
  formVisibility,
  searchRef,
  searchData,
  tableRef,
  tableData,
  formRef,
  formData,
  selectionIds
} = useTableHook();

// 路由
const router = useRouter();

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链";
  } else {
    return "编辑友链";
  }
});

const handleCommand = command => {
  if (command.includes("update")) {
    openForm(command.slice(6));
  } else if (command.includes("delete")) {
    onDelete(command.slice(6));
  }
};

function uploadImage(options: UploadRequestOptions) {
  return uploadFileApi("album", options.file);
}

function uploadCover(res) {
  console.log("uploadCover", res);
  formData.value.albumCover = res.data.file_url;
}

const beforeUpload = rawFile => {
  if (rawFile.size / 1024 < 200) {
    return true;
  }

  // 压缩到200KB,这里的200就是要压缩的大小,可自定义
  imageConversion.compressAccurately(rawFile, 200).then(res => {
    rawFile = res;
  });
  return true;
};

const checkPhoto = item => {
  router.push({ path: "/albums/" + item.id });
};
</script>

<style scoped>
.album-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 170px;
}

.album-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.album-photo-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  z-index: 1000;
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 0.5rem;
  bottom: 2.6rem;
  color: #fff;
}

.album-name {
  text-align: center;
  margin-top: 0.5rem;
}

.album-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}

.album-operation {
  position: absolute;
  z-index: 1000;
  top: 0.5rem;
  right: 0.8rem;
}
</style>
