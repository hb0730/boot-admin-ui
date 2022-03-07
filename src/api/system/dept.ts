import BaseRequest from "../base";
import { DeptTree } from "../model/system/dept_model";
enum API {
  BASE_URL = "/system/dept",
  tree_dept = "/tree/all"
}

class DeptAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  /**
   *树形组织
   * @returns 获取树形组织
   */
  getTreDept(): Promise<DeptTree[]> {
    return this.get<DeptTree[]>(API.tree_dept);
  }
}
export const deptApi = new DeptAPI();
