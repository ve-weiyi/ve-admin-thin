<!--<script setup lang="ts">-->
<!--import { nextTick, onMounted, reactive, ref, toRefs } from "vue";-->
<!--import { FormInstance, FormRules } from "element-plus";-->
<!--import { MenuBackDTO } from "@/api/types.ts";-->

<!--const props = defineProps({-->
<!--  menuFormRules: {-->
<!--    type: Object as () => FormRules,-->
<!--    default: () => ({})-->
<!--  },-->
<!--  menuOptions: {-->
<!--    type: Array as () => MenuBackDTO[],-->
<!--    default: () => []-->
<!--  }-->
<!--});-->

<!--const menuFormRef = ref<FormInstance>();-->
<!--const menuForm = defineModel<MenuBackDTO>({});-->

<!--const data = reactive({-->
<!--  showSearch: true,-->
<!--  loading: false,-->
<!--  title: "",-->
<!--  addOrUpdate: false,-->
<!--  isDisable: [-->
<!--    {-->
<!--      value: 0,-->
<!--      label: "正常"-->
<!--    },-->
<!--    {-->
<!--      value: 1,-->
<!--      label: "禁用"-->
<!--    }-->
<!--  ],-->
<!--  isHidden: [-->
<!--    {-->
<!--      value: 0,-->
<!--      label: "显示"-->
<!--    },-->
<!--    {-->
<!--      value: 1,-->
<!--      label: "隐藏"-->
<!--    }-->
<!--  ],-->
<!--  showChooseIcon: false,-->
<!--  refreshTable: true,-->
<!--  isExpandAll: false-->
<!--});-->
<!--const { isDisable, isHidden, showChooseIcon } = toRefs(data);-->

<!--/** 选择图标 */-->
<!--const selected = (name: string) => {-->
<!--  menuForm.value.meta.icon = name;-->
<!--  showChooseIcon.value = false;-->
<!--};-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    <el-form-->
<!--      ref="menuFormRef"-->
<!--      :model="menuForm"-->
<!--      :rules="menuFormRules"-->
<!--      label-width="100px"-->
<!--    >-->
<!--      <el-row>-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="上级菜单">-->
<!--            <el-tree-select-->
<!--              v-model="menuForm.parent_id"-->
<!--              :data="menuOptions"-->
<!--              placeholder="选择上级菜单"-->
<!--              filterable-->
<!--              check-strictly-->
<!--              :render-after-expand="false"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="菜单类型" prop="menuType">-->
<!--            <el-radio-group v-model="menuForm.type">-->
<!--              <el-radio label="M">目录</el-radio>-->
<!--              <el-radio label="C">菜单</el-radio>-->
<!--              <el-radio label="B">按钮</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type != 3" :span="24">-->
<!--          <el-form-item label="菜单图标" prop="icon">-->
<!--            <el-popover placement="bottom-start" :width="540" trigger="click">-->
<!--              <template #reference>-->
<!--                <el-input-->
<!--                  v-model="menuForm.meta.icon"-->
<!--                  placeholder="点击选择图标"-->
<!--                  readonly-->
<!--                  @click="showChooseIcon = true"-->
<!--                >-->
<!--                  <template #prefix>-->
<!--                    <svg-icon-->
<!--                      v-if="menuForm.meta.icon"-->
<!--                      :icon-class="menuForm.meta.icon"-->
<!--                    />-->
<!--                    <el-icon v-else style="height: 32px; width: 16px">-->
<!--                      <search />-->
<!--                    </el-icon>-->
<!--                  </template>-->
<!--                </el-input>-->
<!--              </template>-->
<!--              <icon-select @selected="selected" />-->
<!--            </el-popover>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="菜单名称" prop="menuName">-->
<!--            <el-input-->
<!--              v-model="menuForm.meta.title"-->
<!--              placeholder="请输入菜单名称"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="显示排序" prop="orderNum">-->
<!--            <el-input-number-->
<!--              v-model="menuForm.meta.rank"-->
<!--              controls-position="right"-->
<!--              :min="1"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type != 3" :span="12">-->
<!--          <el-form-item prop="path">-->
<!--            <template #label>-->
<!--              <span>-->
<!--                <el-tooltip content="访问的路由地址，如：user" placement="top">-->
<!--                  <el-icon><question-filled /></el-icon>-->
<!--                </el-tooltip>-->
<!--                路由地址-->
<!--              </span>-->
<!--            </template>-->
<!--            <el-input v-model="menuForm.path" placeholder="请输入路由地址" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type == 3" :span="12">-->
<!--          <el-form-item prop="component">-->
<!--            <template #label>-->
<!--              <span>-->
<!--                <el-tooltip-->
<!--                  content="访问的组件路径，如：/user/index，默认在views目录下"-->
<!--                  placement="top"-->
<!--                >-->
<!--                  <el-icon><question-filled /></el-icon>-->
<!--                </el-tooltip>-->
<!--                组件路径-->
<!--              </span>-->
<!--            </template>-->
<!--            <el-input-->
<!--              v-model="menuForm.component"-->
<!--              placeholder="请输入组件路径"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type != 4" :span="12">-->
<!--          <el-form-item>-->
<!--            <template #label>-->
<!--              <span>-->
<!--                <el-tooltip-->
<!--                  content="控制器中定义的权限字符，如：system:user:list"-->
<!--                  placement="top"-->
<!--                >-->
<!--                  <el-icon><question-filled /></el-icon>-->
<!--                </el-tooltip>-->
<!--                权限字符-->
<!--              </span>-->
<!--            </template>-->
<!--            <el-input-->
<!--              v-model="menuForm.perms"-->
<!--              placeholder="请输入权限标识"-->
<!--              maxlength="100"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type != 3" :span="12">-->
<!--          <el-form-item>-->
<!--            <template #label>-->
<!--              <span>-->
<!--                <el-tooltip-->
<!--                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"-->
<!--                  placement="top"-->
<!--                >-->
<!--                  <el-icon><question-filled /></el-icon>-->
<!--                </el-tooltip>-->
<!--                显示状态-->
<!--              </span>-->
<!--            </template>-->
<!--            <el-radio-group v-model="menuForm.meta.show_link">-->
<!--              <el-radio-->
<!--                v-for="dict in isHidden"-->
<!--                :key="dict.value"-->
<!--                :label="dict.value"-->
<!--              >-->
<!--                {{ dict.label }}-->
<!--              </el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col v-if="menuForm.type != 2" :span="12">-->
<!--          <el-form-item>-->
<!--            <template #label>-->
<!--              <span>-->
<!--                <el-tooltip-->
<!--                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"-->
<!--                  placement="top"-->
<!--                >-->
<!--                  <el-icon><question-filled /></el-icon>-->
<!--                </el-tooltip>-->
<!--                菜单状态-->
<!--              </span>-->
<!--            </template>-->
<!--            <el-radio-group v-model="menuForm.status">-->
<!--              <el-radio-->
<!--                v-for="dict in isDisable"-->
<!--                :key="dict.value"-->
<!--                :label="dict.value"-->
<!--              >-->
<!--                {{ dict.label }}-->
<!--              </el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="scss"></style>-->
