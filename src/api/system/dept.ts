import BaseRequest from "../base";
import { DeptQuery, DeptTree } from "../model/system/dept_model";
enum API {
  BASE_URL = "/system/dept",
  tree_dept = "/tree/all",
  tree = "/tree"
}

class DeptAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  /**
   *获取全部树形组织
   * @returns 获取树形组织
   */
  getTreDeptAll(): Promise<DeptTree[]> {
    return this.get<DeptTree[]>(API.tree_dept);
  }
  /**
   *树形组织
   * @returns 获取树形组织
   */
  getTreeDept(param: DeptQuery): Promise<DeptTree[]> {
    return this.post<DeptTree[]>(API.tree, param);
  }
}
export const deptApi = new DeptAPI();
