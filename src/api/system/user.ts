import BaseRequest from "../base";
import { UserInfo, UpdatePassword } from "../model/system/user_model";
enum API {
  BASE_URL = "/system/user/info",
  info = "/:id",
  updateById = "/update/:id",
  restPassword = "/rest/password/:id",
  updatePassword = "/update/password/:id"
}
class UserAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }

  restPassword(id: string): Promise<string> {
    return this.get<string>(API.restPassword.replace(":id", id));
  }
  userInfo(id: string): Promise<UserInfo> {
    return this.get<UserInfo>(API.info.replace(":id", id));
  }
  updateUserInfoById(id: string, vo: UserInfo): Promise<string> {
    return this.put<string>(API.updateById.replace(":id", id), vo);
  }
  updatePassword(id: string, vo: UpdatePassword): Promise<string> {
    return this.put<string>(API.updatePassword.replace(":id", id), vo);
  }
}
export const userApi = new UserAPI();
