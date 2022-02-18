import BaseRequest from "./base";
import { Result } from "./model/domain";
import { Menu, MenuTree, RouterModel } from "./model/menu_model";

enum API {
  currentRouter = "/get/current/router",
  queryTree = "/query/tree",
  save = "/save",
  updateById = "/update/:id",
  delete = "/delete/:id",
  deleteBatch = "/delete"
}
class MenuAPI extends BaseRequest {
  private static BASE_API = "/api/v3/system/menu";
  getBaseUrl(): String {
    return MenuAPI.BASE_API;
  }
  /**
   * 获取菜单属性
   */
  getMenuTree(): Promise<Result<MenuTree[]>> {
    return this.get<Result<MenuTree[]>>(API.queryTree);
  }
  /**
   * 获取当前用户router
   */
  getCurrentRouter(): Promise<Result<RouterModel[]>> {
    return this.get<Result<RouterModel[]>>(API.currentRouter);
  }
  /**
   *新增
   * @param vo 新增参数
   */
  newSave(vo: Menu): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  /**
   * 根据id更新
   * @param id id
   * @param vo  更新参数
   * @returns  响应参数
   */
  updateById(id: string, vo: Menu): Promise<Result<string>> {
    return this.put<Result<string>>(API.updateById.replace(":id", id), vo);
  }
  /**
   *根据id删除
   * @param id id
   * @returns result
   */
  deleteById(id: string): Promise<Result<string>> {
    return this.delete(API.delete.replace(":id", id));
  }
}
export const menuApi = new MenuAPI();
