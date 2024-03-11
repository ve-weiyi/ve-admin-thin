<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 文章状态 -->
      <div class="status-menu">
        <span>状态</span>
        <span :class="isActive(null)" @click="changeStatus(null)">全部</span>
        <span :class="isActive(1)" @click="changeStatus(1)"> 公开 </span>
        <span :class="isActive(2)" @click="changeStatus(2)"> 私密 </span>
      </div>
      <el-empty v-if="tableData == null" description="暂无说说" />
      <!-- 说说列表 -->
      <div v-for="item of tableData" :key="item.id" class="talk-item">
        <!-- 用户信息 -->
        <div class="user-info-wrapper">
          <el-avatar :size="36" :src="item.avatar" class="user-avatar" />
          <div class="user-detail-wrapper">
            <div class="user-nickname">
              <div>{{ item.nickname || "未知用户" }}</div>
              <!-- 操作 -->
              <el-dropdown trigger="click" @command="handleCommand">
                <el-icon style="color: #333; cursor: pointer">
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="'1,' + item.id">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item :command="'2,' + item.id">
                      <el-icon>
                        <Delete />
                      </el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <!-- 发表时间 -->
            <div class="time">
              {{ item.created_at }}
              <span v-if="item.is_top === 1" class="top">
                <i class="iconfont icon-upload-fill" /> 置顶
              </span>
              <span v-if="item.status === 2" class="secret">
                <i class="iconfont icon-password-fill" /> 私密
              </span>
            </div>
            <!-- 说说信息 -->
            <div class="talk-content" v-html="item.content" />
            <!-- 图片列表 -->
            <el-row v-if="item.img_list" :gutter="4" class="talk-images">
              <el-col v-for="(img, index) of item.img_list" :key="index" :cols="6" :md="8">
                <el-image :preview-src-list="previewList" :src="img" class="images-items" />
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        :current-page="pagination.currentPage"
        :hide-on-single-page="false"
        :layout="pagination.layout"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 删除对话框 -->
      <el-dialog v-model="isDelete" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <WarningFilled />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除该说说？</div>
        <template #footer>
          <el-button @click="isDelete = false">取 消</el-button>
          <el-button type="primary" @click="handDelete"> 确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useTableHook } from "./talk_list"
import router from "@/router"

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

const status = ref(1)
const isDelete = ref(false)
const previewList = ref([])
const talkId = ref(0)

onMounted(() => {
  refreshList()
})

function handleCommand(command) {
  const arr = command.split(",")
  talkId.value = parseInt(arr[1])
  console.log("type", arr[0], "talkId", talkId.value)
  switch (arr[0]) {
    case "1":
      router.push({ path: "/talk/edit/" + talkId.value })
      break
    case "2":
      isDelete.value = true
      break
  }
}

function handDelete() {
  confirmDelete(talkId.value)
  isDelete.value = false
}

function changeStatus(status) {
  searchData.value.status = status
  refreshList()
}

const isActive = computed(() => {
  return function(status) {
    return status === searchData.value.status ? "active-status" : "status"
  }
})
</script>

<style scoped>
.status-menu {
  font-size: 14px;
  margin-top: 20px;
  color: #999;
}

.status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.talk-item:not(:first-child) {
  margin-top: 20px;
}

.talk-item {
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px 6px rgb(7 17 27 / 6%);
  transition: all 0.3s ease 0s;
}

.talk-item:hover {
  box-shadow: 0 5px 10px 8px rgb(7 17 27 / 16%);
  transform: translateY(-3px);
}

.user-info-wrapper {
  width: 100%;
  display: flex;
}

.user-avatar {
  border-radius: 50%;
}

.user-avatar {
  transition: all 0.5s;
}

.user-avatar:hover {
  transform: rotate(360deg);
}

.user-detail-wrapper {
  margin-left: 10px;
  width: 100%;
}

.user-nickname {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.user-sign {
  margin-left: 4px;
}

.time {
  color: #999;
  margin-top: 2px;
  font-size: 12px;
}

.top {
  color: #ff7242;
  margin-left: 10px;
}

.secret {
  color: #999;
  margin-left: 10px;
}

.talk-content {
  margin-top: 8px;
  font-size: 14px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.talk-images {
  margin-top: 8px;
}

.images-items {
  cursor: pointer;
  object-fit: cover;
  height: 200px;
  width: 100%;
  border-radius: 4px;
}
</style>
