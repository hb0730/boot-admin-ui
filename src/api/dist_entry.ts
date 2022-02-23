import BaseRequest from "./base";
import { DictEntry, DictEntryQuery } from "./model/dict_model";
import { Page, Result } from "./model/domain";
enum API {
  BASE_URL = "/api/v3/system/dict/entry",
  page = "/list/page",
  list = "/list",
  save = "/save",
  update = "/update/:id",
  delete = "/delete/:id",
  deleteBatch = "/delete"
}
class DictEntryAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getPage(query?: DictEntryQuery): Promise<Result<Page<DictEntry[]>>> {
    return this.post<Result<Page<DictEntry[]>>>(API.page, query);
  }
  getList(query?: DictEntryQuery): Promise<Result<DictEntry[]>> {
    return this.post<Result<DictEntry[]>>(API.list, query);
  }
  save(vo: DictEntry): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  updateById(id: string, vo: DictEntry): Promise<Result<string>> {
    return this.put<Result<string>>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<Result<string>> {
    return this.delete<Result<string>>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<Result<string>> {
    return this.post<Result<string>>(API.deleteBatch, ids);
  }
}
export const dictEntryApi = new DictEntryAPI();
