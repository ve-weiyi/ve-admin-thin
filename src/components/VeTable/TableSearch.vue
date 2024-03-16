<script setup lang="ts">
import { builderFormRender, FormField } from "@/utils/render.tsx"
import { PropType, ref, watchEffect } from "vue"
import { FormInstance } from "element-plus"

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  /** 头部最左边的标题 */
  searchFields: {
    type: Array as PropType<FormField[]>,
    default: () => [],
    required: true,
  },
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  "refresh",
])

const loading = ref(props.loading)
// 表搜素条件定义
const searchRef = ref<FormInstance | null>(null)
const searchFields = ref<FormField[]>(props.searchFields)
// 搜索条件,{k:v}
const searchData = ref<any>({})

function onSearch() {
  console.log("onRefresh: ")
  emit("refresh")
}

function resetSearch() {
  searchData.value = {}
}

function getSearchData() {
  return searchData.value
}

defineExpose({
  getSearchData,
})

watchEffect(() => {
  loading.value = props.loading
})
</script>
<template>
  <div>
    <!-- 表格搜索条件 -->
    <el-card shadow="never" class="search-container">
      <el-form
        ref="searchRef"
        :inline="true"
        :model="searchFields"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item
          v-for="item of searchFields"
          :key="item.field"
          :prop="item.field"
          :label="item.label + '：'"
        >
          <template v-if="item.field">
            <component
              class="!w-[180px]"
              style="display: flex; justify-content: center; align-items: center"
              :is="builderFormRender(item, searchData)"
            />
          </template>
        </el-form-item>
        <!--        <el-form-item label="状态：" prop="status">-->
        <!--          <el-select v-model="searchData" placeholder="请选择" clearable class="!w-[180px]">-->
        <!--            <el-option key="1" label="已开启" value="1" />-->
        <!--            <el-option key="0" label="已关闭" value="0" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item class="align-right">
          <el-button type="primary" :loading="loading" icon="Search" @click="onSearch">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  margin-bottom: 8px;

  :deep(.el-card__body) {
    padding: 2px;
    width: 100%;
  }
}

.search-form {
  :deep(.el-form-item) {
    margin-top: 4px;
    margin-bottom: 12px;
  }
}
</style>
