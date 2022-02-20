import BaseRequest from "./base";
import { DeptTree } from "./model/dept_model";
import { Result } from "./model/domain";
enum API {
  BASE_URL = "/api/v3/system/dept",
  tree_dept = "/tree/all"
}

class DeptAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  /**
   *树形组织
   * @returns 获取树形组织
   */
  getTreDept(): Promise<Result<DeptTree[]>> {
    return this.get<Result<DeptTree[]>>(API.tree_dept);
  }
}
export const deptApi = new DeptAPI();
