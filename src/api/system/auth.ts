import { http } from "../../utils/http";
import { Login, LoginUser } from "../model/system/auth_model";

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
  login(login: Login): Promise<LoginUser> {
    return http.post<any, LoginUser>(API.login, { data: login });
  }
  /**
   *登录
   * @returns
   */
  logout(): Promise<string> {
    return http.post<any, string>(API.logout);
  }
}
export const authAPi = new AuthAPI();
