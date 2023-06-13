import { get, Result, post, put, deleteRequest } from "../base";

/**
 * 分页查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(query?: any): Promise<Result<T>> {
  return get("/sys/config/query/page", query);
}
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryList<T>(query?: any): Promise<Result<T>> {
  return get("/sys/config/query/list", query);
}
/**
 *  保存
 * @param data .
 * @returns  .
 */
export function save<T>(data?: T): Promise<Result<T>> {
  return post("/sys/config/save", data);
}
/**
 * 更新
 * @param id .
 * @param data .
 * @returns .
 */
export function update<T>(id: string, data?: T): Promise<Result<T>> {
  return put(`/sys/config/update/${id}`, {}, data);
}
/**
 * 删除
 * @param id .
 * @returns .
 */
export function delByIds<T>(id: string[]): Promise<Result<T>> {
  return deleteRequest(`/sys/config/delete`, {}, id);
}
/**
 * 刷新缓存
 * @param id .
 * @returns .
 */
export function refreshCache(id: string): Promise<Result<T>> {
  return put(`/sys/config/refresh/${id}`, {});
}
