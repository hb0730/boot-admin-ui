import BaseRequest from "../base";
import { PostQuery } from "../model/system/post_model";
enum API {
  BASE_URL = "/system/post",
  export = "/export",
  upload = "/upload"
}
class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  uploadFile(files: any[]): Promise<string> {
    return this.uploadFileRequest<string>(API.upload, files);
  }
  exportFile(query?: PostQuery): Promise<void> {
    return this.downloadFileRequest("post", API.export, { data: query });
  }
}

export const postApi = new PostAPI();
