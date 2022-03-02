import { http } from "../utils/http";
import { Login, LoginUser } from "./model/auth_model";
import { Result } from "./model/domain";

enum API {
  login = "/auth/login",
  logout = "/auth/logout"
}
class AuthAPI {
  /**
   * 登录
   * @param login username/password
   * @returns 返回信息
   */
  login(login: Login): Promise<Result<LoginUser>> {
    return http.post<any, Result<LoginUser>>(API.login, { data: login });
  }
  /**
   *登录
   * @returns
   */
  logout(): Promise<Result<string>> {
    return http.post<any, Result<string>>(API.logout);
  }
}
export const authAPi = new AuthAPI();
