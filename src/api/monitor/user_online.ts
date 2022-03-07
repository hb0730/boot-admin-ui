import BaseRequest from "../base";
enum API {
  BASE_URL = "/monitor/online/user",
  logout = "/logout/:token",
  logoutBatch = "/logout"
}
class UserOnlineAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  logout(token: string): Promise<string> {
    return this.get<string>(API.logout.replace(":token", token));
  }
  logoutBatch(tokens: string[]): Promise<string> {
    return this.post<string>(API.logoutBatch, tokens);
  }
}
export const userOnlineApi = new UserOnlineAPI();
