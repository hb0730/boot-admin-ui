import { ref } from "vue";
import type { DrawerOptions } from "./type";
import { useTimeoutFn } from "@vueuse/core";
import formDrawer from "./index.vue";
import { withInstall } from "@pureadmin/utils";

const drawerStore = ref<Array<DrawerOptions>>([]);

const addDrawer = (options: DrawerOptions) => {
  const open = () =>
    drawerStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 关闭`Drawer` */
const closeDrawer = (options: DrawerOptions, index: number, args?: any) => {
  drawerStore.value[index].visible = false;
  options.closeCallBack && options.closeCallBack({ options, index, args });
  useTimeoutFn(() => {
    drawerStore.value.splice(index, 1);
  }, 200);
};

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDrawer = (value: any, key = "title", index = 0) => {
  drawerStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDrawer = () => {
  drawerStore.value = [];
};

const ReDrawer = withInstall(formDrawer);

export {
  addDrawer,
  closeDrawer,
  closeAllDrawer,
  updateDrawer,
  drawerStore,
  ReDrawer
};
