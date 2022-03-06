import BaseRequest from "../base";
import { Page } from "../model/domain";
import { Post, PostQuery } from "../model/system/post_model";
enum API {
  BASE_URL = "/system/post",
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
  getPage(query?: PostQuery): Promise<Page<Post[]>> {
    return this.post<Page<Post[]>>(API.page, query);
  }
  getList(query?: PostQuery): Promise<Post[]> {
    return this.post<Post[]>(API.list, query);
  }
  save(vo: Post): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateById(id: string, vo: Post): Promise<string> {
    return this.put<string>(API.update.replace(":id", id), vo);
  }
  deleteBatch(ids: string[]): Promise<string> {
    return this.post<string>(API.deleteBatch, ids);
  }
  uploadFile(files: any[]): Promise<string> {
    return this.uploadFileRequest<string>(API.upload, files);
  }
  exportFile(query?: PostQuery): Promise<void> {
    return this.downloadFileRequest("post", API.export, { data: query });
  }
}

export const postApi = new PostAPI();
