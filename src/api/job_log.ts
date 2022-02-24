import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
import { JobLog, JobLogQuery } from "./model/job_log_model";
enum API {
  BASE_URL = "/api/v3/system/job/log",
  page = "/list/page"
}
class JobLogAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getPage(query?: JobLogQuery): Promise<Result<Page<JobLog[]>>> {
    return this.post<Result<Page<JobLog[]>>>(API.page, query);
  }
}
export const jobLogApi = new JobLogAPI();
