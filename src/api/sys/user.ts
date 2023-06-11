import { Result, deleteRequest, get, post, put } from "../base";
/**
 * 分页查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(query?: any): Promise<Result<T>> {
  return get("/sys/user/query/page", query);
}
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryList<T>(query?: any): Promise<Result<T>> {
  return get("/sys/user/query/list", query);
}
/**
 * 检查用户名是否存在
 * @param username .
 * @returns .
 */
export function hashUsername(username: string): Promise<Result<Boolean>> {
  return get("/sys/user/check/username", { username: username });
}
/**
 * 新增
 * @param data .
 * @returns .
 */
export function save<T>(data: any): Promise<Result<T>> {
  return post("/sys/user/save", data);
}
/**
 * 更新
 * @param id .
 * @param data .
 * @returns  .
 */
export function update<T>(id: string, data: any): Promise<Result<T>> {
  return put(`/sys/user/update/${id}`, {}, data);
}

/**
 * 获取用户角色ID
 * @param userId .
 * @returns .
 */
export function queryRoleIds<T>(userId: string): Promise<Result<T>> {
  return get(`/sys/user/query/role/ids`, { id: userId });
}
/**
 * 删除用户
 * @param userIds .
 * @returns  .
 */
export function del<T>(userIds: string[]): Promise<Result<T>> {
  return deleteRequest(`/sys/user/delete`, {}, userIds);
}
/**
 * 重置密码
 * @param username .
 * @param data .
 * @returns .
 */
export function resetPasswd<T>(
  username: string,
  data: any
): Promise<Result<T>> {
  return put(`/sys/user/reset/passwd/${username}`, {}, data);
}
/**
 * 更新密码
 * @param username .
 * @param data .
 * @returns .
 */
export function changePasswd<T>(
  username: string,
  data: any
): Promise<Result<T>> {
  return put(`/sys/user/change/passwd/${username}`, {}, data);
}
