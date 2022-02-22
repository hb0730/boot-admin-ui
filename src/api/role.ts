import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
import { Role, RoleQuery } from "./model/role_model";
enum API {
  BASE_URL = "/api/v3/system/role",
  list = "/list",
  page = "/list/page"
}
class RoleAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getList(query: RoleQuery): Promise<Result<Role[]>> {
    return this.post<Result<Role[]>>(API.list, query);
  }
  /**
   * 分页查询
   * @param query 分页查询参数
   * @returns 分页列表
   */
  getPage(query: RoleQuery): Promise<Result<Page<Role[]>>> {
    return this.post<Result<Page<Role[]>>>(API.page, query);
  }
}

export const roleApi = new RoleAPI();
