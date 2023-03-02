import { get, Result, post, put } from "../base";

/**
 * 分页查询角色
 * @param query .
 * @returns .
 */
export function roleQueryPage<T>(query?: any): Promise<Result<T>> {
  return get("/sys/role/query/page", query);
}
/**
 * 查询角色列表
 * @param query .
 * @returns .
 */
export function roleQueryList<T>(query?: any): Promise<Result<T>> {
  return get("/sys/role/query/list", query);
}
/**
 *  检查code是否重复
 * @param code code
 * @param id 需要排查的ID
 * @returns .
 */
export function checkCode<T>(code: string, id?: string): Promise<Result<T>> {
  const _data: any = { code: code };
  if (id) {
    _data.id = id;
  }
  return get("/sys/role/check/code", _data);
}
/**
 *  保存角色
 * @param data .
 * @returns  .
 */
export function roleSave<T>(data?: T): Promise<Result<T>> {
  return post("/sys/role/save", data);
}
/**
 * 根据ID更新角色
 * @param id 角色ID
 * @param data 需要更新的信息
 * @returns .
 */
export function roleUpdate<T>(id: string, data?: T): Promise<Result<T>> {
  return put("/sys/role/update", { id: id }, data);
}
/**
 * 角色权限
 * @param id  角色ID
 * @returns .
 */
export function queryPermission(id: string): Promise<Result<string[]>> {
  return get("/sys/role/permission", { id: id });
}
/**
 * 更新权限
 * @param id 角色ID
 * @param permissionIds 权限ID
 * @returns .
 */
export function updatePermission(id: string, permissionIds?: string[]) {
  permissionIds = permissionIds || [];
  return put("/sys/role/permission", { id: id }, permissionIds);
}
