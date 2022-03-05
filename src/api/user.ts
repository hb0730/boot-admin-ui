import BaseRequest from "./base";
import { Page } from "./model/domain";
import { UserQuery, User, UserInfo, UpdatePassword } from "./model/user_model";
enum API {
  BASE_URL = "api/v3/system/user/info",
  info = "/:id",
  page = "/list/page",
  save = "/save",
  updateById = "/update/:id",
  deleteBatch = "/delete",
  restPassword = "/rest/password/:id",
  updatePassword = "/update/password/:id"
}
class UserAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  /**
   * 分页查询
   * @param query 查询参数
   * @returns 查询结果
   */
  getUserPage(query: UserQuery): Promise<Page<User[]>> {
    return this.post<Page<User[]>>(API.page, query);
  }
  saveUser(vo: User): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateUserById(id: string, vo: User): Promise<string> {
    return this.put<string>(API.updateById.replace(":id", id), vo);
  }
  deleteBatchById(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
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
