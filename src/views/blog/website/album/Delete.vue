<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 相册操作 -->
      <div class="operation">
        <div class="all-check">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllPhotoChange"
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
          @click="updatePhotoDelete(null)"
        >
          批量恢复
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
      <!-- 空状态 -->
      <el-empty
        v-if="tableData.length === 0"
        description="暂无照片"
        style="width: 100%"
      />
      <el-checkbox-group
        v-model="selectionIds"
        @change="handleCheckedPhotoChange"
      >
        <!-- 照片列表 -->
        <el-row v-loading="loading" :gutter="10" class="picture-list">
          <el-col v-for="item in tableData" :key="item.id" :md="4">
            <el-checkbox :label="item.id" :value="item.id">
              <div class="photo-item">
                <el-image
                  :preview-src-list="tableData.map(photo => photo.photo_src)"
                  :src="item.photo_src"
                  class="photo-img"
                  fit="cover"
                />
                <div class="photo-name">{{ item.photo_name }}</div>
              </div>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <!-- 分页 -->
      <VeTablePagination
        v-if="pageData.total > 0"
        v-model="pageData"
        @pagination="refreshList"
      />
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
          <el-button type="primary" @click="confirmBatchDelete(selectionIds)">
            确 定
          </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from "vue";
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
    total: 10
  },
  tableData: [],
  formData: {} as any
});

const {
  loading,
  batchDeleteVisibility,
  selectionIds,
  pageData,
  tableData,
  formData
} = toRefs(data);

function refreshList() {
  findPhotoListApi({}).then(res => {
    tableData.value = res.data.list;
  });
}

onMounted(() => {
  refreshList();
});

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

const handleCheckAllPhotoChange = val => {
  // selectionIds.value = val ? tableData.value.map((photo) => photo.id) : []
  checkAll.value = val;
};

const handleCheckedPhotoChange = val => {
  checkAll.value = val.length === tableData.value.length;
};

const updatePhotoDelete = item => {
  if (item) {
    Object.assign(formData, JSON.parse(item));
  } else {
    Object.assign(formData, {
      id: null,
      photo_name: "",
      photo_src: "",
      photo_album_id: null
    });
  }
};

onMounted(() => {
  loading.value = false;
  // refreshList()
});
</script>

<style scoped>
.operation {
  display: flex;
  justify-content: flex-end;
  margin-top: 2.25rem;
  margin-bottom: 2rem;
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

.photo-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}

.photo-img {
  width: 100%;
  height: 7rem;
  border-radius: 4px;
}

.photo-name {
  font-size: 14px;
  margin-top: 0.3rem;
  text-align: center;
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
