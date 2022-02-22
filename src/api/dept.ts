import BaseRequest from "./base";
import { Dept, DeptTree } from "./model/dept_model";
import { Result } from "./model/domain";
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
  getTreDept(): Promise<Result<DeptTree[]>> {
    return this.get<Result<DeptTree[]>>(API.tree_dept);
  }
  save(vo: Dept): Promise<Result<string>> {
    return this.post<Result<string>>(API.save, vo);
  }
  updateById(id: string, vo: Dept): Promise<Result<string>> {
    return this.put<Result<string>>(API.update_id.replace(":id", id), vo);
  }
  deleteById(id: string): Promise<Result<string>> {
    return this.delete<Result<string>>(API.delete_id.replace(":id", id));
  }
}
export const deptApi = new DeptAPI();
