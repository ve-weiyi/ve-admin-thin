<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="talk-container">
        <!-- 输入框 -->
        <Editor
          ref="editorRef"
          v-model="talk.content"
          class="editor-wrapper"
          placeholder="说点什么吧"
        />
        <!-- 操作菜单 -->
        <div class="operation-wrapper">
          <div class="left-wrapper">
            <!-- 表情 -->
            <el-popover placement="bottom-start" trigger="click" width="460">
              <span
                v-for="(item, key, index) of emojiList"
                :key="index"
                class="emoji-item"
                @click="addEmoji(key, item.active)"
              >
                <img
                  :src="item.normal"
                  :title="item.key"
                  class="emoji"
                  height="24"
                  width="24"
                />
              </span>
              <template #reference>
                <el-icon class="operation-btn">
                  <Avatar />
                </el-icon>
                <!--                <i class="iconfont icon-smile operation-btn" />-->
              </template>
            </el-popover>
            <!-- 图片上传 -->
            <el-upload
              :before-upload="beforeUpload"
              :on-success="upload"
              :show-file-list="false"
              action="/api/admin/talks/images"
              multiple
            >
              <el-icon class="operation-btn">
                <PictureFilled />
              </el-icon>
            </el-upload>
          </div>
          <div class="flex-center">
            <!-- 是否置顶 -->
            <el-switch
              v-model="talk.is_top"
              :active-value="1"
              :inactive-value="0"
              inactive-text="置顶"
              style="margin-right: 16px"
            />
            <!-- 说说状态 -->
            <el-dropdown
              style="margin-right: 16px"
              trigger="click"
              @command="handleCommand"
            >
              <span class="talk-status">
                {{ dropdownTitle }}
                <el-icon><ArrowUp /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) of statusList"
                    :key="index"
                    :command="item.status"
                  >
                    {{ item.desc }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              :disabled="talk.content === ''"
              size="default"
              type="primary"
              @click="saveOrUpdateTalk"
            >
              发布
            </el-button>
          </div>
        </div>
        <!-- 图片上传 -->
        <el-upload
          v-show="uploadList.length > 0"
          :before-upload="beforeUpload"
          :file-list="uploadList"
          :on-remove="handleRemove"
          :on-success="upload"
          action="/api/admin/talks/images"
          class="talk-image-upload"
          list-type="picture-card"
          multiple
        >
          <i class="el-icon-plus" />
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import * as imageConversion from "image-conversion";
import EmojiList from "@/assets/emojis/qq_emoji.json";
import Editor from "@/views/blog/talk/Editor.vue";
import { useRoute } from "vue-router";
import { createTalkApi, findTalkApi, updateTalkApi } from "@/api/talk";
import { Talk } from "@/api/types";
import { ElMessage } from "element-plus";

const route = useRoute();
const emojiList = ref<any>(EmojiList);
const talk = ref<Talk>({
  id: null,
  content: "",
  is_top: 0,
  status: 1,
  images: null
});
const statusList = ref([
  { status: 1, desc: "公开" },
  { status: 2, desc: "私密" }
]);
const uploadList = ref([]);

onMounted(() => {
  console.log("route.params.talkId", route.params.talkId);
  if (route.params.talkId) {
    const tid = parseInt(route.params.talkId as string);
    findTalkApi(tid).then(res => {
      talk.value = res.data;
      if (res.data.images) {
        // res.data.images.forEach((item) => {
        //   uploadList.value.push({ url: item })
        // })
      }
    });
  }
});

function handleCommand(command: any) {
  talk.value.status = command;
}

const editorRef = ref(null);

function addEmoji(key, value) {
  const emojiTag = `<img src="${value}" width="24" height="24" alt="${key}" style="margin: 0 1px;display: inline;vertical-align: text-bottom"/>`;
  editorRef.value.addText(emojiTag);
  console.log("talk.value.content", talk.value.content);
}

function handleRemove(file) {
  const index = uploadList.value.findIndex(item => item.url === file.url);
  if (index !== -1) {
    uploadList.value.splice(index, 1);
  }
}

function upload(response) {
  uploadList.value.push({ url: response.data });
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

function saveOrUpdateTalk() {
  if (talk.value.content.trim() === "") {
    ElMessage.error("说说内容不能为空");
    return false;
  }

  // 转换图片
  if (uploadList.value.length > 0) {
    const imgList = uploadList.value.map(item => item.url);
    talk.value.images = JSON.stringify(imgList);
  }

  console.log("talk.value", talk.value);
  if (talk.value.id) {
    updateTalkApi(talk.value).then(res => {
      editorRef.value.clear();
      uploadList.value = [];
      ElMessage.success("更新说说成功");
    });
  } else {
    createTalkApi(talk.value).then(res => {
      editorRef.value.clear();
      uploadList.value = [];
      ElMessage.success("发布说说成功");
    });
  }
}

const dropdownTitle = computed(() => {
  const currentStatus = talk.value.status;
  const status = statusList.value.find(item => item.status === currentStatus);
  return status ? status.desc : "";
});
</script>

<style scoped>
.talk-container {
  margin-top: 20px;
}

.editor-wrapper {
  min-height: 150px;
}

.operation-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.operation-btn {
  cursor: pointer;
  color: #838383;
  font-size: 20px;
  margin-right: 12px;
}

.talk-status {
  cursor: pointer;
  font-size: 12px;
  color: #999;
}

.emoji {
  user-select: none;
  margin: 0.25rem;
  display: inline-block;
  vertical-align: middle;
}

.emoji-item {
  cursor: pointer;
  display: inline-block;
}

.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: #dddddd;
}

.right-wrapper {
}

.left-wrapper {
  display: flex;
  width: 50%;
}

.talk-image-upload {
  margin-top: 8px;
}
</style>
