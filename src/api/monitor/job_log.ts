import BaseRequest from "../base";
import { Page } from "../model/domain";
import { JobLog, JobLogQuery } from "../model/monitor/job_log_model";
enum API {
  BASE_URL = "/system/job/log",
  page = "/list/page"
}
class JobLogAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  getPage(query?: JobLogQuery): Promise<Page<JobLog[]>> {
    return this.post<Page<JobLog[]>>(API.page, query);
  }
}
export const jobLogApi = new JobLogAPI();
