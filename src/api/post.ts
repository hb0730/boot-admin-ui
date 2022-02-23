import BaseRequest from "./base";
import { Page, Result } from "./model/domain";
import { Post, PostQuery } from "./model/post_model";
enum API {
  BASE_URL = "/api/v3/system/post",
  list = "/list",
  page = "/list/page",
  save = "/save",
  update = "/update/:id",
  deleteBatch = "/delete",
  export = "/export",
  upload = "/upload"
}
class PostAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  /**
   * page
   * @param query 查询参数
   * @returns page list
   */
  getPage(query?: PostQuery): Promise<Result<Page<Post[]>>> {
    return this.post<Result<Page<Post[]>>>(API.page, query);
  }
  getList(query?: PostQuery): Promise<Result<Post[]>> {
    return this.post<Result<Post[]>>(API.list, query);
  }
  save(vo: Post): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  updateById(id: string, vo: Post): Promise<Result<string>> {
    return this.put<Result<string>>(API.update.replace(":id", id), vo);
  }
  deleteBatch(ids: string[]): Promise<Result<string>> {
    return this.post<Result<string>>(API.deleteBatch, ids);
  }
  uploadFile(files: any[]): Promise<Result<string>> {
    return this.uploadFileRequest<Result<string>>(API.upload, files);
  }
  exportFile(query?: PostQuery): Promise<void> {
    return this.downloadFileRequest("post", API.export, { data: query });
  }
}

export const postApi = new PostAPI();
