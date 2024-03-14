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
          @click="batchDeletePhoto = true"
        >
          批量删除
        </el-button>
      </div>
      <!-- 照片列表 -->
      <el-row v-loading="loading" :gutter="10" class="photo-container">
        <!-- 空状态 -->
        <el-empty v-if="tableData.length === 0" description="暂无照片" style="width: 100%" />
        <el-checkbox-group v-model="selectionIds" @change="handleCheckedPhotoChange">
          <el-col v-for="item in tableData" :key="item.id" :md="4">
            <el-checkbox :label="item.id" :value="item.id">
              <div class="photo-item">
                <el-image
                  :preview-src-list="tableData.map((photo) => photo.photo_src)"
                  :src="item.photo_src"
                  class="photo-img"
                  fit="cover"
                />
                <div class="photo-name">{{ item.photo_name }}</div>
              </div>
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
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
          <el-button @click="cancelBatchDelete">取 消</el-button>
          <el-button type="primary" @click="confirmBatchDelete(selectionIds)"> 确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { useTableHook } from "./delete"

const {
  onFindList,
  onCreate,
  onUpdate,
  onDelete,
  onDeleteByIds,
  resetSearch,
  resetTable,
  refreshList,
  handleSortChange,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  resetForm,
  openForm,
  closeForm,
  submitForm,
  confirmDelete,
  cancelBatchDelete,
  confirmBatchDelete,
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
  selectionIds,
} = useTableHook()

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

const isIndeterminate = computed(() => {
  return selectionIds.length > 0 && selectionIds.length < tableData.value.length
})

const checkAll = ref(false)

const handleCheckAllPhotoChange = (val) => {
  // selectionIds.value = val ? tableData.value.map((photo) => photo.id) : []
  checkAll.value = val
}

const handleCheckedPhotoChange = (val) => {
  checkAll.value = val.length === tableData.value.length
}

const updatePhotoDelete = (item) => {
  if (item) {
    Object.assign(formData, JSON.parse(item))
  } else {
    Object.assign(formData, {
      id: null,
      photo_name: "",
      photo_src: "",
      photo_album_id: null,
    })
  }
}

const batchDeletePhoto = ref(false)

onMounted(() => {
  loading.value = false
  // refreshList()
})
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
</style>
