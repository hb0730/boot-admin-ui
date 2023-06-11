import { Result, deleteRequest, get, post, put } from "../base";

/**
 * 分页查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(query?: any): Promise<Result<T>> {
  return get("/sys/org/query/page", query);
}
/**
 * 树形结构查询
 * @param query .
 * @returns .
 */
export function queryTree<T>(query?: any): Promise<Result<T>> {
  return get("/sys/org/query/tree", query);
}
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryList<T>(query?: any): Promise<Result<T>> {
  return get("/sys/org/query/list", query);
}
/**
 * 保存
 * @param data .
 * @returns .
 */
export function save<T>(data: any): Promise<Result<T>> {
  return post("/sys/org/save", data);
}
/**
 * 更新
 * @param id ID
 * @param data .
 * @returns .
 */
export function update<T>(id: string, data: any): Promise<Result<T>> {
  return put(`/sys/org/update/${id}`, {}, data);
}
/**
 * 删除
 * @param id .
 * @returns .
 */
export function del<T>(id: any): Promise<Result<T>> {
  return deleteRequest(`/sys/org/del`, {}, id);
}
