import BaseRequest from "./base";
import { Page } from "./model/domain";
import { LoginLogModel, LoginLogQuery } from "./model/login_log_model";
enum API {
  BASE_URL = "/api/v3/monitor/log/login",
  page = "/list/page",
  list = "/list",
  delete = "/delete/:id",
  deleteBatch = "/delete",
  clean = "/clean"
}
class LoginLogAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  page(query?: LoginLogQuery): Promise<Page<LoginLogModel[]>> {
    return this.post<Page<LoginLogModel[]>>(API.page, query);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.delete.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  clean(): Promise<string> {
    return this.get<string>(API.clean);
  }
}
export const loginLogApi = new LoginLogAPI();
