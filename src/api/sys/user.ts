import * as http from "../base";

/**
 * 分页查询
 *
 * @param query
 * @returns
 */
export function userPage(query?: any) {
  return http.get<any, any>(`/sys/user`, query);
}

/**
 * 用户名是否存在
 *
 * @param username
 * @param id
 * @returns
 */
export function existsByUsername(username: string, id?: number) {
  return http.get<any, boolean>(`/sys/user/existsByUsername`, {
    username: username,
    id: id
  });
}
/**
 * 保存用户
 *
 * @param data
 * @returns
 */
export function saveUser(data: any) {
  return http.post<any, string>(`/sys/user`, data);
}

/**
 *
 * 更新用户
 *
 * @param data
 * @returns
 */
export function updateUser(data: any) {
  return http.put<any, any>(`/sys/user`, {}, data);
}

/**
 * 删除用户
 *
 * @param id
 * @returns
 */
export function deleteUser(id: number) {
  return http.deleteRequest<any, any>(`/sys/user`, { id: id });
}
/**
 * 重置密码
 *
 * @param id
 * @param pwd
 * @returns
 */
export function resetPassword(id: number, pwd: string) {
  return http.put<any, any>(
    `/sys/user/resetPassword`,
    {},
    { id: id, password: pwd }
  );
}
