import * as http from "../base";
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function listMenus<Q extends http.BasePageQuery, T>(query?: Q) {
  return http.get<Q, T>("/sys/permission", query);
}
/**
 * 树形菜单结构
 *
 * @param filterBtn 是否过滤按钮类型
 * @returns
 */
export function listTree(filterButton = true) {
  return http.get<any, any>("/sys/permission/menu/tree", { filterButton });
}

/**
 * 新增菜单与权限
 *
 * @param data  .
 * @returns .
 */
export function addMenu(data: any) {
  return http.post<any, string>("/sys/permission", data);
}

/**
 * 更新菜单与权限
 *
 * @param data .
 * @returns .
 */
export function updateMenu(data: any) {
  return http.put<any, string>("/sys/permission", null, data);
}

/**
 * 删除菜单与权限
 * @param id
 * @returns
 */
export function deleteMenu(id: any) {
  return http.deleteRequest<any, string>("/sys/permission", { id: id });
}
