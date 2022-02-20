import BaseRequest from "./base";
import { Result } from "./model/domain";
import { Post, PostQuery } from "./model/post_model";
enum API {
  BASE_URL = "/api/v3/system/post",
  list = "/list"
}
class PostAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  getList(query?: PostQuery): Promise<Result<Post[]>> {
    return this.post<Result<Post[]>>(API.list, query);
  }
}

export const postApi = new PostAPI();
