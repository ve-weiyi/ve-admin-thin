import type {
  TableColumn,
  TableColumnFilterPlacement,
  TableColumnFixed,
  TableColumnRenderer,
  TableColumns,
  TableColumnScope,
  TableColumnSortable,
  TableColumnSortOrders,
  TableColumnType
} from "./table-column";
import type { AdaptiveConfig, PureTableProps, TableProps } from "./table-props";
import type { DefaultLanguage, Language, TranslatePair } from "./locale";
import type { LoadingConfig } from "./loading-config";
import type { PaginationProps } from "./pagination";
import type { I18n } from "vue-i18n";

type Size = "large" | "default" | "small";
type Align = "left" | "center" | "right";
type Effect = "dark" | "light";
type Layout = "fixed" | "auto";
type PureTableInstallOptions = {
  /** 国际化配置。简体中文：`zhCn`、繁体中文：`zhTw`、英语: `en`，也可以传入自定义国际化语言 https://element-plus.org/zh-CN/guide/i18n.html */
  locale?: DefaultLanguage | Language;
  /** 自适应国际化语言。如果不想使用 [ConfigProvider](https://element-plus.org/zh-CN/guide/i18n.html#configprovider) 提供的响应式`locale`根据当前语言环境自适应表格国际化，那么可以安装并初始化 [vue-i18n](https://vue-i18n.intlify.dev/guide/installation.html#package-managers)，然后传入到`i18n`中，`@pureadmin/table`就会根据当前语言环境自适应表格国际化 */
  i18n?: I18n;
  /** 是否是服务端渲染 */
  ssr?: boolean;
};

export type {
  TableColumnFilterPlacement,
  PureTableInstallOptions,
  TableColumnSortOrders,
  TableColumnSortable,
  TableColumnRenderer,
  TableColumnScope,
  TableColumnFixed,
  TableColumnType,
  PaginationProps,
  DefaultLanguage,
  PureTableProps,
  AdaptiveConfig,
  TranslatePair,
  LoadingConfig,
  TableColumns,
  TableColumn,
  TableProps,
  Language,
  Layout,
  Effect,
  Align,
  Size
};
