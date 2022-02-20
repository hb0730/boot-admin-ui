import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
import { UserQuery, User } from "./model/user_model";
enum API {
  BASE_URL = "api/v3/system/user/info",
  page = "/list/page",
  save = "/save",
  updateById = "/update/:id",
  deleteBatch = "/delete",
  restPassword = "/rest/password/:id"
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
  getUserPage(query: UserQuery): Promise<Result<Page<User[]>>> {
    return this.post<Result<Page<User[]>>>(API.page, query);
  }
  saveUser(vo: User): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  updateUserById(id: string, vo: User): Promise<Result<string>> {
    return this.put<Result<string>>(API.updateById.replace(":id", id), vo);
  }
  deleteBatchById(ids: string[]): Promise<Result<string>> {
    return this.post<Result<string>>(API.deleteBatch, ids);
  }
  restPassword(id: string): Promise<Result<string>> {
    return this.get<Result<string>>(API.restPassword.replace(":id", id));
  }
}
export const userApi = new UserAPI();
