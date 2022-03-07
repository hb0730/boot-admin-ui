import BaseRequest from "../base";

enum API {
  BASE_URL = "/monitor/operation/log",
  clean = "/clean"
}
class OperLogAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  clean(): Promise<string> {
    return this.get(API.clean);
  }
}

export const operLogApi = new OperLogAPI();
