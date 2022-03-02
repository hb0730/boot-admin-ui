import BaseRequest from "./base";
import { Page } from "./model/domain";
import { Role, RoleQuery } from "./model/role_model";
enum API {
  BASE_URL = "/api/v3/system/role",
  list = "/list",
  page = "/list/page",
  save = "/save",
  update = "/update/:id",
  delete = "/delete/:id",
  deleteBatch = "/delete",
  update_role_permission = "/update/permission/:id"
}
class RoleAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getList(query?: RoleQuery): Promise<Role[]> {
    return this.post<Role[]>(API.list, query);
  }
  /**
   * 分页查询
   * @param query 分页查询参数
   * @returns 分页列表
   */
  getPage(query?: RoleQuery): Promise<Page<Role[]>> {
    return this.post<Page<Role[]>>(API.page, query);
  }
  save(vo: Role): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  update(id: string, vo: Role): Promise<string> {
    return this.put<string>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  updateRolePermission(id: string, permission: string[]): Promise<string> {
    return this.post<string>(
      API.update_role_permission.replace(":id", id),
      permission
    );
  }
}

export const roleApi = new RoleAPI();
