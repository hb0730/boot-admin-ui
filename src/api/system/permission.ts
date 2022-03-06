import BaseRequest from "../base";
import { Page } from "../model/domain";
import { Query, Permission } from "../model/system/permission_model";
enum API {
  BASE_URL = "/system/permission",
  menu_permission = "/menu/page/:menuId",
  save = "/save",
  update_id = "/update/:id",
  delete_batch = "/delete"
}
class PermissionAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  /**
   *新增
   * @param vo 参数
   * @returns 响应
   */
  save(vo: Permission): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  /**
   * 获取参数对应的权限信息
   * @param menuId 参数id
   * @param query 请求参数
   * @returns 响应
   */
  getMenuPermission(
    menuId: string,
    query?: Query
  ): Promise<Page<Permission[]>> {
    return this.post<Page<Permission[]>>(
      API.menu_permission.replace(":menuId", menuId),
      query
    );
  }
  /**
   *根据id修改
   * @param id id
   * @param vo 更新参数
   * @returns 响应
   */
  updateById(id: string, vo: Permission): Promise<string> {
    return this.put<string>(API.update_id.replace(":id", id), vo);
  }
  /**
   * 批量删除
   * @param ids id集合
   * @returns 响应
   */
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.delete_batch, ids);
  }
}
export const permissionApi = new PermissionAPI();
