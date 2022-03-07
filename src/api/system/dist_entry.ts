import BaseRequest from "../base";
enum API {
  BASE_URL = "/system/dict/entry"
}
class DictEntryAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
}
export const dictEntryApi = new DictEntryAPI();
