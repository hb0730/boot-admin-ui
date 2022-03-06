import BaseRequest from "../base";
import { Page } from "../model/domain";
import { Job, JobQuery } from "../model/monitor/job_model";
enum API {
  BASE_URL = "/system/job",
  list = "/list",
  page = "/list/page",
  save = "/save",
  update = "/update/:id",
  deleteById = "/delete/:id",
  deleteBatch = "/delete",
  exec = "/exec/:id"
}
class JobAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  list(query?: JobQuery): Promise<Job[]> {
    return this.post<Job[]>(API.list, query);
  }
  page(query?: JobQuery): Promise<Page<Job[]>> {
    return this.post<Page<Job[]>>(API.page, query);
  }
  save(vo: Job): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateById(id: string, vo: Job): Promise<string> {
    return this.put<string>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.deleteById.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  exec(id: string): Promise<string> {
    return this.get<string>(API.exec.replace(":id", id));
  }
}

export const jobApi = new JobAPI();
