<template>
  <div>
    <div class="clearfix sticky-button">
      <el-input v-model="filterText" class="filter" placeholder="筛选" />
      <el-checkbox class="fl-right" @change="(value) => checkAll(value)">全选</el-checkbox>
    </div>
    <div class="tree-content">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :default-checked-keys="defaultCheckIds"
        :filter-node-method="filterNode"
        :props="treeProps"
        default-expand-all
        highlight-current
        node-key="id"
        show-checkbox
        @check="nodeChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.name }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from "vue"
import { CheckboxValueType, ElTree } from "element-plus"
import { findMenuDetailsListApi } from "@/api/menu"
import { MenuDetailsDTO } from "@/api/types"

// 父组件向子组件传输的数据
const props = defineProps({
  row: {
    type: Array,
    required: false,
    default: function () {
      return []
    },
  },
})

// 子组件向父组件通讯
const emit = defineEmits(["changeRow"])

const filterText = ref("")
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<MenuDetailsDTO[]>([])
const defaultCheckIds = ref([])
const treeProps = ref({
  children: "children",
  label: function (data) {
    return data.name
  },
})

const checkAll = (value: CheckboxValueType) => {
  defaultCheckIds.value = []
  if (value == true) {
    treeData.value.forEach((item) => {
      defaultCheckIds.value.push(item.id)
      if (item.children) {
        item.children.forEach((item) => {
          defaultCheckIds.value.push(item.id)
        })
      }
    })
  }
  treeRef.value.setCheckedKeys(defaultCheckIds.value)
  emit("changeRow", "resourceTreeRef", treeRef.value.getCheckedKeys())
}

const getTableData = () => {
  defaultCheckIds.value = props.row
  findMenuDetailsListApi({}).then((res) => {
    treeData.value = res.data.list
  })
}
getTableData()

const needConfirm = ref(false)
const nodeChange = () => {
  emit("changeRow", "treeRef", treeRef.value.getCheckedKeys())
  needConfirm.value = true
}

// 暴露给外层使用的切换拦截统一方法
const enterAndNext = () => {
  // relation()
}
// 关联树 确认方法

defineExpose({ enterAndNext, needConfirm })

const filterNode = (value, data) => {
  if (!data) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

defineComponent({
  name: "Menus",
})
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.sticky-button {
  position: sticky;
  top: 2px;
  z-index: 2;
  background-color: #fff;
}

.filter {
  width: 60%;
}

.custom-tree-node {
  span + span {
    margin-left: 12px;
  }
}

.tree-content {
  margin-top: 10px;
  height: calc(100vh - 148px);
  overflow: auto;
}

.fl-right {
  float: right;
}
</style>
