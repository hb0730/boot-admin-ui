import * as http from "../base";

/**
 * 列表查询
 *
 * @param query
 * @returns
 */
export function listRole(query?: any) {
  return http.get<any, any>(`/sys/role/list`, query);
}

/**
 * 分页查询
 *
 * @param query
 * @returns
 */
export function pageRole(query?: any) {
  return http.get<any, any>(`/sys/role/page`, query);
}

/**
 * 编码是否存在
 *
 * @param code
 * @param id
 * @returns
 */
export function existsByCode(code: string, id?: number) {
  return http.get<any, boolean>(`/sys/role/existsByCode`, { code, id });
}

/**
 * 新增
 * @param data
 * @returns
 */
export function saveRole(data: any) {
  return http.post<any, string>(`/sys/role`, data);
}

/**
 * 更新
 *
 * @param data
 * @returns
 */
export function updateRole(data: any) {
  return http.put<any, string>(`/sys/role`, {}, data);
}
/**
 * 删除
 *
 * @param id
 * @returns
 */
export function deleteRole(id: number) {
  return http.deleteRequest<any, string>(`/sys/role`, { id: id });
}

/**
 * 赋权
 *
 * @param id
 * @param permissionIds
 * @returns
 */
export function assignPermission(id: number, permissionIds: number[]) {
  return http.put<any, any>(
    `/sys/role/assignPermission`,
    { roleId: id },
    permissionIds
  );
}
