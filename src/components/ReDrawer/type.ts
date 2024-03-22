import type { Component, VNode } from "vue";

type DoneFn = (cancel?: boolean) => void;
type EventType = "open" | "close" | "openAutoFocus" | "closeAutoFocus";
type ArgsType = {
  /** `cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了esc键 */
  command: "cancel" | "sure" | "close";
};
type BtnClickDrawer = {
  options?: DrawerOptions;
  index?: number;
};
type BtnClickButton = {
  btn?: ButtonProps;
  index?: number;
};

/** https://element-plus.org/zh-CN/component/button.html#button-attributes */
type ButtonProps = {
  /** 按钮文字 */
  label: string;
  /** 按钮尺寸 */
  size?: "large" | "default" | "small";
  /** 按钮类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info";
  /** 二次确认*/
  confirm?: boolean;
  /** 提示文字 */
  tips?: string;
  /** 是否为朴素按钮，默认 `false` */
  plain?: boolean;
  /** 是否为文字按钮，默认 `false` */
  text?: boolean;
  /** 是否显示文字按钮背景颜色，默认 `false` */
  bg?: boolean;
  /** 是否为链接按钮，默认 `false` */
  link?: boolean;
  /** 是否为圆角按钮，默认 `false` */
  round?: boolean;
  /** 是否为圆形按钮，默认 `false` */
  circle?: boolean;
  /** 是否为加载中状态，默认 `false` */
  loading?: boolean;
  /** 自定义加载中状态图标组件 */
  loadingIcon?: string | Component;
  /** 按钮是否为禁用状态，默认 `false` */
  disabled?: boolean;
  /** 图标组件 */
  icon?: string | Component;
  /** 是否开启原生 `autofocus` 属性，默认 `false` */
  autofocus?: boolean;
  /** 原生 `type` 属性，默认 `button` */
  nativeType?: "button" | "submit" | "reset";
  /** 自动在两个中文字符之间插入空格 */
  autoInsertSpace?: boolean;
  /** 自定义按钮颜色, 并自动计算 `hover` 和 `active` 触发后的颜色 */
  color?: string;
  /** `dark` 模式, 意味着自动设置 `color` 为 `dark` 模式的颜色，默认 `false` */
  dark?: boolean;
  /** 自定义元素标签 */
  tag?: string | Component;
  /** 点击按钮后触发的回调 */
  btnClick?: ({
    drawer,
    button
  }: {
    /** 当前 `Drawer` 信息 */
    drawer: BtnClickDrawer;
    /** 当前 `button` 信息 */
    button: BtnClickButton;
  }) => void;
};

interface DrawerProps {
  /** `Drawer` 的显示与隐藏 */
  visible?: boolean;
  /** `Drawer` 的标题 */
  title?: string;
  /** `Drawer` 的宽度，默认 `50%` */
  width?: string | number;
  /** 是否为全屏 `Drawer`（会一直处于全屏状态，除非弹框关闭），默认 `false`，`fullscreen` 和 `fullscreenIcon` 都传时只有 `fullscreen` 会生效 */
  fullscreen?: boolean;
  /** 是否显示全屏操作图标，默认 `false`，`fullscreen` 和 `fullscreenIcon` 都传时只有 `fullscreen` 会生效 */
  fullscreenIcon?: boolean;
  /**`Drawer` 打开的方向 */
  direction?: "rtl" | "ltr" | "ttb" | "btt";
  /** 是否需要遮罩层，默认 `true` */
  modal?: boolean;
  /** `Drawer` 自身是否插入至 `body` 元素上。嵌套的 `Drawer` 必须指定该属性并赋值为 `true`，默认 `false` */
  appendToBody?: boolean;
  /** `Drawer` 打开的延时时间，单位毫秒，默认 `0` */
  openDelay?: number;
  /** 是否可以通过点击 `modal` 关闭 `Drawer`，默认 `true` */
  closeOnClickModal?: boolean;
  /** 是否可以通过按下 `ESC` 关闭 `Drawer`，默认 `true` */
  closeOnPressEscape?: boolean;
  /** 是否显示关闭按钮，默认 `true` */
  showClose?: boolean;
  /**是否在 `Drawer` 出现时将 body 滚动锁定 */
  lockScroll?: boolean;
  /**控制是否在关闭 `Drawer` 之后将子元素全部销毁 */
  destroyOnClose?: boolean;
  /** 关闭前的回调，会暂停 `Dialog` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeClose?: (done: DoneFn) => void;
}

interface DrawerOptions extends DrawerProps {
  props?: any;
  /** 是否隐藏 `Drawer` 按钮操作区的内容 */
  hideFooter?: boolean;
  /** 自定义底部按钮操作 */
  footerButtons?: Array<ButtonProps>;
  /**
   * @description 自定义对话框标题的内容渲染器
   * @see {@link https://element-plus.org/zh-CN/component/dialog.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%A4%B4%E9%83%A8}
   */
  headerRenderer?: ({
    close,
    titleId,
    titleClass
  }: {
    close: Function;
    titleId: string;
    titleClass: string;
  }) => VNode | Component;
  /** 自定义按钮操作区的内容渲染器，会覆盖`footerButtons`以及默认的 `取消` 和 `确定` 按钮 */
  footerRenderer?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => VNode | Component;
  /** 自定义内容渲染器 */
  contentRenderer?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => VNode | Component;
  /** `Drawer` 打开后的回调 */
  open?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** `Drawer` 关闭后的回调（只有点击右上角关闭按钮或空白页或按下了esc键关闭页面时才会触发） */
  close?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** 输入焦点聚焦在 `Drawer` 内容时的回调 */
  openAutoFocus?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** 输入焦点从 `Drawer` 内容失焦时的回调 */
  closeAutoFocus?: ({
    options,
    index
  }: {
    options: DrawerOptions;
    index: number;
  }) => void;
  /** 点击底部取消按钮的回调，会暂停 `Drawer` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeCancel?: (
    done: Function,
    {
      options,
      index
    }: {
      options: DrawerOptions;
      index: number;
    }
  ) => void;
  /** `Drawer` 关闭后的回调。 `args` 返回的 `command` 值解析：`cancel` 点击取消按钮、`sure` 点击确定按钮、`close` 点击右上角关闭按钮或空白页或按下了esc键  */
  closeCallBack?: ({
    options,
    index,
    args
  }: {
    options: DrawerOptions;
    index: number;
    args: any;
  }) => void;
  /** 点击底部确定按钮的回调，会暂停 `Drawer` 的关闭. 回调函数内执行 `done` 参数方法的时候才是真正关闭对话框的时候 */
  beforeSure?: (
    done: Function,
    {
      options,
      index
    }: {
      options: DrawerOptions;
      index: number;
    }
  ) => void;
}

export type { EventType, ArgsType, ButtonProps, DrawerOptions, DrawerProps };
