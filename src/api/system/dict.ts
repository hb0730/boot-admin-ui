// import BaseRequest from "./base";
import BaseRequest from "../base";
import { Dict, DictCache, DictQuery } from "../model/system/dict_model";
import { Page } from "../model/domain";
enum API {
  BASE_URL = "/system/dict",
  page = "/list/page",
  list = "/list",
  save = "/save",
  update = "/update/:id",
  delete = "/delete/:id",
  deleteBatch = "/delete",
  getCache = "/cache/get",
  updateCache = "/cache/update"
}
class DictAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getPage(query?: DictQuery): Promise<Page<Dict[]>> {
    return this.post<Page<Dict[]>>(API.page, query);
  }
  getList(query?: DictQuery): Promise<Dict[]> {
    return this.post<Dict[]>(API.list, query);
  }
  save(vo: Dict): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateById(id: string, vo: Dict): Promise<string> {
    return this.put<string>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<string> {
    return this.delete(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  getCache(): Promise<DictCache[]> {
    return this.get<DictCache[]>(API.getCache);
  }
  updateCache(): Promise<string> {
    return this.get<string>(API.updateCache);
  }
}

export const dictApi = new DictAPI();
