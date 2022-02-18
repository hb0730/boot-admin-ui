import { ElMessageBox } from "element-plus";

const confirm = (message: any): any => {
  return ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  });
};
export { confirm };
