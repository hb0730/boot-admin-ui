import BaseRequest from "./base";
import { Page } from "./model/domain";
import { UserOnlineModel, UserOnlineQuery } from "./model/user_online_model";
enum API {
  BASE_URL = "/api/v3/monitor/online/user",
  page = "/list/page",
  logout = "/logout/:token",
  logoutBatch = "/logout"
}
class UserOnlineAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  page(query?: UserOnlineQuery): Promise<Page<UserOnlineModel[]>> {
    return this.post<Page<UserOnlineModel[]>>(API.page, query);
  }
  logout(token: string): Promise<string> {
    return this.get<string>(API.logout.replace(":token", token));
  }
  logoutBatch(tokens: string[]): Promise<string> {
    return this.post<string>(API.logoutBatch, tokens);
  }
}
export const userOnlineApi = new UserOnlineAPI();
