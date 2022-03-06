import BaseRequest from "../base";
import { DictEntry, DictEntryQuery } from "../model/system/dict_model";
import { Page } from "../model/domain";
enum API {
  BASE_URL = "/system/dict/entry",
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
  getPage(query?: DictEntryQuery): Promise<Page<DictEntry[]>> {
    return this.post<Page<DictEntry[]>>(API.page, query);
  }
  getList(query?: DictEntryQuery): Promise<DictEntry[]> {
    return this.post<DictEntry[]>(API.list, query);
  }
  save(vo: DictEntry): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateById(id: string, vo: DictEntry): Promise<string> {
    return this.put<string>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
}
export const dictEntryApi = new DictEntryAPI();
