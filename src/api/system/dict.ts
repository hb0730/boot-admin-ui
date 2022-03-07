// import BaseRequest from "./base";
import BaseRequest from "../base";
import { DictCache } from "../model/system/dict_model";
enum API {
  BASE_URL = "/system/dict",
  getCache = "/cache/get",
  updateCache = "/cache/update"
}
class DictAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  getCache(): Promise<DictCache[]> {
    return this.get<DictCache[]>(API.getCache);
  }
  updateCache(): Promise<string> {
    return this.get<string>(API.updateCache);
  }
}

export const dictApi = new DictAPI();
