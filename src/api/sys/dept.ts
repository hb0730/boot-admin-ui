import * as http from "../base";

/**
 * code 是否存在
 *
 * @param code
 * @param id
 * @returns
 */
export function deptExistsCode(code: string, id?: number) {
  return http.get<any, boolean>(`/sys/dept/existsCode`, { code: code, id: id });
}
/**
 * 部门-tree
 *
 * @param query
 * @returns
 */
export function deptTree(query?: any) {
  return http.get<any, any>(`/sys/dept`, query);
}

/**
 * 部门-保存
 *
 * @param data
 * @returns
 */
export function deptSave(data: any) {
  return http.post<any, string>(`/sys/dept`, data);
}

/**
 * 部门-修改
 *
 * @param data
 * @returns
 */
export function deptUpdate(data: any) {
  return http.put<any, any>(`/sys/dept`, {}, data);
}

/**
 * 部门-删除
 *
 * @param id .
 * @returns .
 */
export function deptDelete(id: number) {
  return http.deleteRequest<any, string>(`/sys/dept`, { id: id });
}
