import { App, Component } from "vue"
import {
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTable,
  ElTableColumn,
  ElLink,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElTimeline,
  ElTimelineItem,
  ElResult,
  ElSteps,
  ElStep,
  ElTree,
  ElTreeV2,
  ElPopconfirm,
  ElCheckbox,
  ElCheckboxGroup,
  // 指令
  ElLoading,
  ElInfiniteScroll,
} from "element-plus"

// Directives
const plugins = [ElLoading, ElInfiniteScroll]

const components = [
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTree,
  ElTreeV2,
  ElPopconfirm,
  ElCheckbox,
  ElCheckboxGroup,
  ElTable,
  ElTableColumn,
  ElLink,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElTimeline,
  ElTimelineItem,
  ElResult,
  ElSteps,
  ElStep,
]

export function useElementPlus(app: App) {
  // 注册组件
  components.forEach((component: Component) => {
    app.component(component.name, component)
  })
  // 注册指令
  plugins.forEach((plugin) => {
    app.use(plugin)
  })
}
