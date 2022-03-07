import BaseRequest from "../base";
enum API {
  BASE_URL = "/system/role",
  update_role_permission = "/update/permission/:id"
}
class RoleAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  updateRolePermission(id: string, permission: string[]): Promise<string> {
    return this.post<string>(
      API.update_role_permission.replace(":id", id),
      permission
    );
  }
}

export const roleApi = new RoleAPI();
