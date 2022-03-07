import BaseRequest from "../base";
enum API {
  BASE_URL = "/system/job",
  exec = "/exec/:id"
}
class JobAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  exec(id: string): Promise<string> {
    return this.get<string>(API.exec.replace(":id", id));
  }
}

export const jobApi = new JobAPI();
