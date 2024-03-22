import * as http from "../base";

/**
 * 验证cron表达式
 *
 * @param value
 * @returns
 */
export function validateCron(value: string) {
  return http.get<any, string>(`/sys/quartz/job/validate/cron`, {
    cronExpression: value
  });
}
/**
 *  定时任务-分页查询
 *
 * @param query
 * @returns
 */
export function timingPage(query?: any) {
  return http.get<any, any>(`/sys/quartz/job`, query);
}
/**
 * 定时任务-新增
 *
 * @param data
 * @returns
 */
export function timingSave(data: any) {
  return http.post<any, any>(`/sys/quartz/job`, data);
}

/**
 * 定时任务-修改
 *
 * @param data
 * @returns
 */
export function timingUpdate(data: any) {
  return http.put<any, any>(`/sys/quartz/job`, {}, data);
}

/**
 * 定时任务-删除
 *
 * @param id
 * @returns
 */
export function timingDelete(id: number) {
  return http.deleteRequest<any, any>(`/sys/quartz/job`, { id: id });
}

/**
 * 定时任务-立即执行
 *
 * @param id
 * @returns
 */
export function timingRun(id: number) {
  return http.post<any, any>(`/sys/quartz/job/run?id=${id}`);
}

/**
 * 定时任务-暂停
 *
 * @param id
 * @returns
 */
export function timingPause(id: number) {
  return http.put(`/sys/quartz/job/pause`, { id: id });
}

/**
 * 定时任务-恢复
 *
 * @param id
 * @returns
 */
export function timingResume(id: number) {
  return http.put(`/sys/quartz/job/resume`, { id: id });
}
