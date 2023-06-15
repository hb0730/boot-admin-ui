import { get, Result, post, put, deleteRequest } from "../base";

/**
 * 分页查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(query?: any): Promise<Result<T>> {
  return get("/monitor/quartz/job/query/page", query);
}
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryList<T>(query?: any): Promise<Result<T>> {
  return get("/monitor/quartz/job/query/list", query);
}
/**
 *  保存
 * @param data .
 * @returns  .
 */
export function save<T>(data?: T): Promise<Result<T>> {
  return post("/monitor/quartz/job/save", data);
}
/**
 * 更新
 * @param id .
 * @param data .
 * @returns .
 */
export function update<T>(id: string, data?: T): Promise<Result<T>> {
  return put(`/monitor/quartz/job/update/${id}`, {}, data);
}
/**
 * 删除
 * @param id .
 * @returns .
 */
export function delByIds<T>(id: string[]): Promise<Result<T>> {
  return deleteRequest(`/monitor/quartz/job/delete`, {}, id);
}
/**
 * 检查cron表达式
 * @param cron .
 * @returns .
 */
export function checkCorn<T>(cron: string): Promise<Result<T>> {
  return get(`/monitor/quartz/job/check/cron`, { cron: cron });
}

/**
 * 启动
 * @param id .
 * @returns .
 */
export function resume<T>(id: string): Promise<Result<T>> {
  return put(`/monitor/quartz/job/resume/${id}`);
}

/**
 * 立即执行
 * @param id .
 * @returns .
 */
export function execute<T>(id: string): Promise<Result<T>> {
  return put(`/monitor/quartz/job/execute/${id}`);
}
/**
 * 根据ID删除
 * @param id .
 * @returns .
 */
export function delById<T>(id: string): Promise<Result<T>> {
  return deleteRequest(`/monitor/quartz/job/delete`, { id: id }, {});
}
