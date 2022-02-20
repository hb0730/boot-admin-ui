import BaseRequest from "./base";
import { Result } from "./model/domain";
import { Role, RoleQuery } from "./model/role_model";
enum API {
  BASE_URL = "/api/v3/system/role",
  list = "/list"
}
class RoleAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getList(query: RoleQuery): Promise<Result<Role[]>> {
    return this.post<Result<Role[]>>(API.list, query);
  }
}

export const RoleApi = new RoleAPI();
