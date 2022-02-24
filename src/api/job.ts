import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
import { Job, JobQuery } from "./model/job_model";
enum API {
  BASE_URL = "/api/v3/system/job",
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
  list(query?: JobQuery): Promise<Result<Job[]>> {
    return this.post<Result<Job[]>>(API.list, query);
  }
  page(query?: JobQuery): Promise<Result<Page<Job[]>>> {
    return this.post<Result<Page<Job[]>>>(API.page, query);
  }
  save(vo: Job): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  updateById(id: string, vo: Job): Promise<Result<string>> {
    return this.put<Result<string>>(API.update.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<Result<string>> {
    return this.delete<Result<string>>(API.deleteById.replace(":id", id));
  }
  deleteBatch(ids: string[]): Promise<Result<string>> {
    return this.post<Result<string>>(API.deleteBatch, ids);
  }
  exec(id: string): Promise<Result<string>> {
    return this.get<Result<string>>(API.exec.replace(":id", id));
  }
}

export const jobApi = new JobAPI();
