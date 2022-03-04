import BaseRequest from "./base";
import { Page } from "./model/domain";
import { OperLogModel, OperLogQuery } from "./model/oper_log_model";

enum API {
  BASE_URL = "/api/v3/monitor/operation/log",
  clean = "/clean",
  page = "/list/page",
  delete = "/delete/:id",
  deleteBatch = "/delete",
  list = "/list"
}
class OperLogAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  page(query?: OperLogQuery): Promise<Page<OperLogModel[]>> {
    return this.post<Page<OperLogModel[]>>(API.page, query);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  clean(): Promise<string> {
    return this.get(API.clean);
  }
}

export const operLogApi = new OperLogAPI();
