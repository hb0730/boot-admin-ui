import { App } from "vue";
import eIconPicker from "e-icon-picker";
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import "e-icon-picker/lib/index.css"; // 基本样式，包含基本图标
// import "e-icon-picker/src/js/fontAwesome.js";
// import "e-icon-picker/lib/fontawesome/all-6.0.0.data.js"; //font-awesome 图标库
import "font-awesome/css/font-awesome.css";
import "e-icon-picker/lib/ele/icon.css"; //element-plus 图标库

export function useIconPicker(app: App) {
  app.use(eIconPicker, {
    FontAwesome: true,
    ElementUI: true,
    eIcon: false, //自带的图标，来自阿里妈妈
    eIconSymbol: false, //是否开启彩色图标
    addIconList: [],
    removeIconList: [],
    zIndex: 3100 //选择器弹层的最低层,全局配置
  });
}
