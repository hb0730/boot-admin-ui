import BaseRequest from "../base";
import { Page } from "../model/domain";
import { Query, Permission } from "../model/system/permission_model";
enum API {
  BASE_URL = "/system/permission",
  menu_permission = "/menu/page/:menuId"
}
class PermissionAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
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
}
export const permissionApi = new PermissionAPI();
