import BaseRequest from "../base";
import {
  Menu,
  MenuPermissionTree,
  MenuTree,
  RouterModel
} from "../model/system/menu_model";

enum API {
  currentRouter = "/get/current/router",
  queryTree = "/query/tree",
  save = "/save",
  updateById = "/update/:id",
  delete = "/delete/:id",
  deleteBatch = "/delete",
  menu_permission_tree = "/query/tree/permission",
  update_current_cache = "/update/current"
}
class MenuAPI extends BaseRequest {
  private static BASE_API = "/system/menu";
  getBaseUrl(): String {
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
   *新增
   * @param vo 新增参数
   */
  newSave(vo: Menu): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  /**
   * 根据id更新
   * @param id id
   * @param vo  更新参数
   * @returns  响应参数
   */
  updateById(id: string, vo: Menu): Promise<string> {
    return this.put<string>(API.updateById.replace(":id", id), vo);
  }
  /**
   *根据id删除
   * @param id id
   * @returns result
   */
  deleteById(id: string): Promise<string> {
    return this.delete(API.delete.replace(":id", id));
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
