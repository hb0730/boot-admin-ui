import BaseRequest from "../base";
import {
  MenuPermissionTree,
  MenuTree,
  RouterModel
} from "../model/system/menu_model";

enum API {
  currentRouter = "/get/current/router",
  queryTree = "/query/tree",
  menu_permission_tree = "/query/tree/permission",
  update_current_cache = "/update/current"
}
class MenuAPI extends BaseRequest {
  private static BASE_API = "/system/menu";
  getBaseUrl(): string {
    return MenuAPI.BASE_API;
  }
  /**
   * 获取菜单属性
   */
  getMenuTree(): Promise<MenuTree[]> {
    return this.get<MenuTree[]>(API.queryTree);
  }
  updateCurrent(): Promise<string> {
    return this.get<string>(API.update_current_cache);
  }
  /**
   * 获取当前用户router
   */
  getCurrentRouter(): Promise<RouterModel[]> {
    return this.get<RouterModel[]>(API.currentRouter);
  }
  /**
   * 菜单权限树
   * @returns 菜单权限树
   */
  getMenuPermissionTree(): Promise<MenuPermissionTree[]> {
    return this.get<MenuPermissionTree[]>(API.menu_permission_tree);
  }
}
export const menuApi = new MenuAPI();
