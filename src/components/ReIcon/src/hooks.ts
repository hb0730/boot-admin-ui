import { iconType } from "./types";
import { h, defineComponent, Component } from "vue";
import { IconifyIconOffline, FontIcon, IconifyIconOnline } from "../index";

/**
 * 支持fontawesome4、5+、iconfont、remixicon、element-plus的icons、自定义svg
 * @param icon 必传 string 图标
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: string, attrs?: iconType): Component {
  // iconfont
  const ifReg = /^IF-/;
  const iconOnline = /:/;
  const iconifyReg = /^iconify-/;
  // typeof icon === "function" 属于SVG
  if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(
      0,
      name.indexOf(" ") == -1 ? name.length : name.indexOf(" ")
    );
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs
        });
      }
    });
  } else if (typeof icon === "function") {
    // svg
    return icon;
  } else if (iconOnline.test(icon)) {
    // const type = icon.substring(0, icon.indexOf(":") + 1);
    // const i = icon.substring(icon.indexOf(":") + 1);
    return defineComponent({
      name: "Icon",
      render() {
        return h(IconifyIconOnline, { icon: icon, ...attrs });
      }
    });
  } else if (iconifyReg.test(icon)) {
    // iconify
    const name = icon.split(iconifyReg)[1];
    const iconName = name.slice(
      0,
      name.indexOf(" ") == -1 ? name.length : name.indexOf(" ")
    );
    return defineComponent({
      name: "Icon",
      render() {
        return h(IconifyIconOffline, {
          icon: iconName,
          ...attrs
        });
      }
    });
  } else {
    return defineComponent({
      name: "Icon",
      render() {
        return h(IconifyIconOffline, {
          icon: icon,
          ...attrs
        });
      }
    });
  }
}
