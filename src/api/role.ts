import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
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
  getList(query?: RoleQuery): Promise<Result<Role[]>> {
    return this.post<Result<Role[]>>(API.list, query);
  }
  /**
   * 分页查询
   * @param query 分页查询参数
   * @returns 分页列表
   */
  getPage(query?: RoleQuery): Promise<Result<Page<Role[]>>> {
    return this.post<Result<Page<Role[]>>>(API.page, query);
  }
  save(vo: Role): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  update(id: string, vo: Role): Promise<Result<string>> {
    return this.put<Result<string>>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<Result<string>> {
    return this.delete<Result<string>>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<Result<string>> {
    return this.post<Result<string>>(API.deleteBatch, ids);
  }
  updateRolePermission(
    id: string,
    permission: string[]
  ): Promise<Result<string>> {
    return this.post<Result<string>>(
      API.update_role_permission.replace(":id", id),
      permission
    );
  }
}

export const roleApi = new RoleAPI();
