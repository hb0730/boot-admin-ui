import BaseRequest from "./base";
import { Dept, DeptTree } from "./model/dept_model";
enum API {
  BASE_URL = "/api/v3/system/dept",
  tree_dept = "/tree/all",
  save = "/save",
  update_id = "/update/:id",
  delete_id = "/delete/:id"
}

class DeptAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  /**
   *树形组织
   * @returns 获取树形组织
   */
  getTreDept(): Promise<DeptTree[]> {
    return this.get<DeptTree[]>(API.tree_dept);
  }
  save(vo: Dept): Promise<string> {
    return this.post<string>(API.save, vo);
  }
  updateById(id: string, vo: Dept): Promise<string> {
    return this.put<string>(API.update_id.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<string> {
    return this.delete<string>(API.delete_id.replace(":id", id));
  }
}
export const deptApi = new DeptAPI();
