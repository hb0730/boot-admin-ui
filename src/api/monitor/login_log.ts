import BaseRequest from "../base";
enum API {
  BASE_URL = "/monitor/log/login",
  clean = "/clean"
}
class LoginLogAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  clean(): Promise<string> {
    return this.get<string>(API.clean);
  }
}
export const loginLogApi = new LoginLogAPI();
