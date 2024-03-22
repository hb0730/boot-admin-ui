import type { OptionsType } from "@/components/ReSegmented";

const menuTypeOptions: Array<OptionsType> = [
  {
    label: "菜单",
    value: 1
  },
  {
    label: "iframe",
    value: 2
  },
  {
    label: "外链",
    value: 3
  },
  {
    label: "按钮",
    value: 4
  }
];
const menuTypeOptionMap = { 1: "菜单", 2: "iframe", 3: "外链", 4: "按钮" };

const showLinkOptions: Array<OptionsType> = [
  {
    label: "显示",
    tip: "会在菜单中显示",
    value: true
  },
  {
    label: "隐藏",
    tip: "不会在菜单中显示",
    value: false
  }
];

const keepAliveOptions: Array<OptionsType> = [
  {
    label: "缓存",
    tip: "会保存该页面的整体状态，刷新后会清空状态",
    value: true
  },
  {
    label: "不缓存",
    tip: "不会保存该页面的整体状态",
    value: false
  }
];

const hiddenTagOptions: Array<OptionsType> = [
  {
    label: "允许",
    tip: "当前菜单名称或自定义信息允许添加到标签页",
    value: false
  },
  {
    label: "禁止",
    tip: "当前菜单名称或自定义信息禁止添加到标签页",
    value: true
  }
];

const showParentOptions: Array<OptionsType> = [
  {
    label: "显示",
    tip: "会显示父级菜单",
    value: true
  },
  {
    label: "隐藏",
    tip: "不会显示父级菜单",
    value: false
  }
];

const frameLoadingOptions: Array<OptionsType> = [
  {
    label: "开启",
    tip: "有首次加载动画",
    value: true
  },
  {
    label: "关闭",
    tip: "无首次加载动画",
    value: false
  }
];
const MenuEnableOptions: Array<OptionsType> = [
  {
    label: "启用",
    value: true
  },
  {
    label: "禁用",
    value: false
  }
];

export {
  menuTypeOptions,
  menuTypeOptionMap,
  showLinkOptions,
  keepAliveOptions,
  hiddenTagOptions,
  showParentOptions,
  frameLoadingOptions,
  MenuEnableOptions
};
