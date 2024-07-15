<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 相册信息 -->
      <div class="album-info">
        <el-image
          :src="albumInfo.album_cover"
          class="album-cover"
          fit="cover"
        />
        <div class="album-detail">
          <div style="margin-bottom: 0.6rem">
            <span class="album-name">{{ albumInfo.album_name }}</span>
            <span class="photo-count">{{ albumInfo.photo_count || 10 }}张</span>
          </div>
          <div>
            <span v-if="albumInfo.album_desc" class="album-desc">
              {{ albumInfo.album_desc }}
            </span>
            <el-button
              icon="picture"
              size="default"
              type="primary"
              @click="uploadPhoto = true"
            >
              上传照片
            </el-button>
          </div>
        </div>
        <!-- 相册操作 -->
        <div class="operation">
          <div class="all-check">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <div class="check-count">已选择{{ selectionIds.length }}张</div>
          </div>
          <el-button
            :disabled="selectionIds.length === 0"
            icon="deleteItem"
            size="default"
            type="success"
            @click="movePhoto = true"
          >
            移动到
          </el-button>
          <el-button
            :disabled="selectionIds.length === 0"
            icon="deleteItem"
            size="default"
            type="danger"
            @click="batchDeleteVisibility = true"
          >
            批量删除
          </el-button>
        </div>
      </div>
      <!-- 照片列表 -->
      <el-row v-loading="loading" :gutter="10" class="photo-container">
        <!-- 空状态 -->
        <el-empty v-if="tableData.length === 0" description="暂无照片" />
        <el-checkbox-group
          v-model="selectionIds"
          @change="handleCheckedPhotoChange"
        >
          <el-row class="picture-list" :gutter="10">
            <el-col
              v-for="photo of tableData"
              :key="photo.id"
              :xs="12"
              :sm="6"
              :lg="4"
              style="margin-bottom: 1rem"
            >
              <el-checkbox :label="photo.id">
                <template #default>
                  <div class="photo-item">
                    <div class="photo-operation">
                      <el-dropdown @command="handleCommand">
                        <el-icon style="color: #fff">
                          <MoreFilled />
                        </el-icon>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item :command="photo"
                              >编辑
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                    <el-image
                      class="photo-cover"
                      fit="cover"
                      :src="photo.photo_src"
                      :preview-src-list="[photo.photo_src]"
                    />
                    <div class="photo-name">{{ photo.photo_name }}</div>
                  </div>
                </template>
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-row>
      <!-- 分页 -->
      <VeTablePagination
        v-if="pageData.total > 0"
        v-model="pageData"
        @pagination="refreshList"
      />
      <!-- 上传模态框 -->
      <el-dialog v-model="uploadPhoto" top="10vh" width="70%">
        <template #header>
          <div class="dialog-title-container">上传照片</div>
        </template>
        <!-- 上传 -->
        <div class="upload-container">
          <el-upload
            v-show="uploadList.length > 0"
            :before-upload="beforeUpload"
            :file-list="uploadList"
            :on-remove="handleRemove"
            :on-success="afterUpload"
            action="/api/admin/photos/albums/cover"
            list-type="picture-card"
            multiple
          >
            <el-icon>
              <plus />
            </el-icon>
          </el-upload>
          <div class="upload">
            <el-upload
              v-show="uploadList.length === 0"
              :before-upload="beforeUpload"
              :on-success="afterUpload"
              :show-file-list="false"
              action="/api/admin/photos/albums/cover"
              drag
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">支持上传jpg/png文件</div>
              </template>
            </el-upload>
          </div>
        </div>
        <template #footer>
          <div class="upload-footer">
            <div class="upload-count">共上传{{ uploadList.length }}张照片</div>
            <div style="margin-left: auto">
              <el-button @click="uploadPhoto = false">取 消</el-button>
              <el-button
                :disabled="uploadList.length === 0"
                type="primary"
                @click="savePhotos"
              >
                开始上传
              </el-button>
            </div>
          </div>
        </template>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog v-model="addFormVisibility" width="30%">
        <template #header>
          <div class="dialog-title-container">修改信息</div>
        </template>
        <el-form :model="formData" label-width="80px" size="default">
          <el-form-item label="照片名称">
            <el-input v-model="formData.photoName" style="width: 220px" />
          </el-form-item>
          <el-form-item label="照片描述">
            <el-input v-model="formData.photoDesc" style="width: 220px" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addFormVisibility = false">取 消</el-button>
          <el-button type="primary" @click="submitForm(formData)">
            确 定
          </el-button>
        </template>
      </el-dialog>
      <!-- 批量删除对话框 -->
      <el-dialog v-model="batchDeleteVisibility" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <Warning />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除选中照片？</div>
        <template #footer>
          <el-button @click="batchDeleteVisibility = false">取 消</el-button>
          <el-button type="primary" @click="updatePhotoDelete(null)">
            确 定
          </el-button>
        </template>
      </el-dialog>
      <!-- 移动对话框 -->
      <el-dialog v-model="movePhoto" width="30%">
        <template #header>
          <div class="dialog-title-container">移动照片</div>
        </template>
        <el-empty v-if="albumList.length < 2" description="暂无其他相册" />
        <el-form v-else :model="formData" label-width="80px" size="default">
          <el-radio-group v-model="albumId">
            <div class="album-check-item">
              <template v-for="item in albumList">
                <el-radio
                  v-if="item.id !== albumInfo.id"
                  :key="item.id"
                  :label="item.id"
                  style="margin-bottom: 1rem"
                >
                  <div class="album-check">
                    <el-image
                      :src="item.album_cover"
                      class="album-check-cover"
                      fit="cover"
                    />
                    <div style="margin-left: 0.5rem">{{ item.album_name }}</div>
                  </div>
                </el-radio>
              </template>
            </div>
          </el-radio-group>
        </el-form>
        <template #footer>
          <el-button @click="movePhoto = false">取 消</el-button>
          <el-button
            :disabled="albumId === null"
            type="primary"
            @click="updatePhotoAlbum"
          >
            确 定
          </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import * as imageConversion from "image-conversion";
import { findPhotoAlbumApi } from "@/api/photo_album.ts";
import { PhotoAlbum } from "@/api/types.ts";
import { CheckboxValueType, UploadRawFile } from "element-plus";
import VeTablePagination from "@/components/VeTable/TablePagination.vue";
import { findPhotoListApi } from "@/api/photo.ts";

const data = reactive({
  loading: false,
  batchDeleteVisibility: false,
  addFormVisibility: false,
  selectionIds: [],
  pageData: {
    currentPage: 1,
    pageSize: 10,
    total: 20
  },
  searchData: {} as any,
  orderData: {} as any,
  tableData: [],
  formData: {} as any
});

const {
  loading,
  batchDeleteVisibility,
  addFormVisibility,
  selectionIds,
  pageData,
  searchData,
  orderData,
  tableData,
  formData
} = toRefs(data);

function refreshList() {
  const data: PageQuery = {
    conditions: [{ field: "album_id", value: albumId }]
  };
  findPhotoListApi(data).then(res => {
    tableData.value = res.data.list;
  });
}

onMounted(() => {
  getAlbumInfo(albumId);
});

function submitForm(formData) {
  console.log("submitForm", formData);
}

function confirmBatchDelete(ids) {
  console.log(ids);
}

const isIndeterminate = computed(() => {
  return (
    selectionIds.value.length > 0 &&
    selectionIds.value.length < tableData.value.length
  );
});

const checkAll = ref(false);

function handleCheckAllChange(value: boolean) {
  checkAll.value = value;
  const ids = [];
  if (value) {
    tableData.value.forEach(item => {
      ids.push(item.id);
    });
  }
  selectionIds.value = ids;
  console.log("handleCheckAllChange", value, selectionIds);
}

function handleCheckedPhotoChange(value: CheckboxValueType[]) {
  checkAll.value = value.length === tableData.value.length;

  const ids = [];
  value.forEach(item => {
    ids.push(item as number);
  });

  selectionIds.value = ids;
  console.log("handleCheckedPhotoChange", value, selectionIds);
}

// 上传文件时触发
function beforeUpload(rawFile: UploadRawFile) {
  console.log("beforeUpload", rawFile.name, rawFile.size);

  if (rawFile.size / 1024 < 200) {
    return true;
  }

  return new Promise<Blob>((resolve, reject) => {
    // 压缩到200KB,这里的200就是要压缩的大小,可自定义
    imageConversion.compressAccurately(rawFile, 200).then((res: Blob) => {
      console.log("compressAccurately", res.size);
      resolve(res);
    });
  });
}

function afterUpload(res) {
  console.log("afterUpload", res);
}

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链";
  } else {
    return "编辑友链";
  }
});

// 获取路由参数
const route = useRoute();
const albumId = route.params.id ? parseInt(route.params.id as string) : 0; // 假设路由参数名为 "id"
const albumInfo = ref<PhotoAlbum>({});
const albumList = ref<PhotoAlbum[]>([]);
const movePhoto = ref(false);
const uploadPhoto = ref(false);
const uploadList = ref([]);

function savePhotos() {
  console.log("savePhotos");
}

function getAlbumInfo(id: number) {
  findPhotoAlbumApi({
    id
  }).then(res => {
    console.log("getAlbumInfo", res);
    albumInfo.value = res.data;
    document.title = `${albumInfo.value.album_name} - 相册`;
  });
}

function handleCommand(command) {
  if (command.includes("update")) {
    formData.value = command.slice(6);
    addFormVisibility.value = true;
  } else if (command.includes("delete")) {
    console.log("delete", command);
  }
}

function handleRemove(file, fileList) {
  console.log("handleRemove", file, fileList);
}

function updatePhotoAlbum() {
  console.log("updatePhotoAlbum", albumId);
}

function updatePhotoDelete(id: number | null) {
  console.log("updatePhotoDelete", id);
}
</script>

<style scoped>
.photo-container.el-checkbox__input {
  position: absolute !important;
  top: 0.3rem;
  left: 0.8rem;
}

.album-info {
  display: flex;
  margin-top: 2.25rem;
  margin-bottom: 2rem;
}

.album-cover {
  border-radius: 4px;
  width: 5rem;
  height: 5rem;
}

.album-check-cover {
  border-radius: 4px;
  width: 4rem;
  height: 4rem;
}

.album-detail {
  padding-top: 0.4rem;
  margin-left: 0.8rem;
}

.album-desc {
  font-size: 14px;
  margin-right: 0.8rem;
}

.operation {
  padding-top: 1.5rem;
  margin-left: auto;
}

.all-check {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
}

.check-count {
  margin-left: 1rem;
  font-size: 12px;
}

.album-name {
  font-size: 1.25rem;
}

.photo-count {
  font-size: 12px;
  margin-left: 0.5rem;
}

.photo-item {
  position: relative;
  width: 100%;
  cursor: pointer;

  margin-bottom: 1rem;

  .photo-operation {
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    z-index: 9;
  }

  .photo-cover {
    width: 100%;
    height: 7rem;
    border-radius: 4px;
  }

  .photo-name {
    font-size: 14px;
    margin-top: 0.3rem;
    text-align: center;
  }
}

.upload-container {
  height: 400px;
}

.upload {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-footer {
  display: flex;
  align-items: center;
}

.album-check {
  display: flex;
  align-items: center;
}

.picture-list .el-checkbox {
  display: inline-block !important;
}

.picture-list .el-checkbox__input {
  position: absolute !important;
  top: 0.3rem;
  left: 0.8rem;
}
</style>
