import { BaseQuery, get, post, put, Result } from "../base";

/**
 *  菜单与权限树形列表
 * @param query 查询参数
 * @returns 树形列表
 */
export function treeList<P extends BaseQuery, T>(
  query?: P
): Promise<Result<T>> {
  return get("/sys/permission/tree", query);
}
/**
 * 菜单树形列表
 * @param query .
 */
export function treeMenus<P extends BaseQuery, T>(
  query?: P
): Promise<Result<T>> {
  return get("/sys/permission/tree/menu", query);
}
/**
 * 新增
 * @param data .
 * @returns .
 */
export function savePermission<T>(data: any): Promise<Result<T>> {
  return post("/sys/permission/save", data);
}
/**
 *  更新
 * @param id .
 * @param data .
 * @returns  .
 */
export function updatePermission<T>(id: string, data: any): Promise<Result<T>> {
  return put("/sys/permission/update", { id: id }, data);
}
