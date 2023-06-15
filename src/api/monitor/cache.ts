import { deleteRequest, get } from "../base";
/**
 * 列表查询
 * @returns .
 */
export const queryList = () => {
  return get("/monitor/cache");
};
/**
 * 查找详情
 * @param param .
 * @returns .
 */
export const queryInfo = (param: any) => {
  return get("/monitor/cache/query", param);
};
/**
 * 移除
 * @param param .
 * @returns .
 */
export const remove = (param: any) => {
  return deleteRequest("/monitor/cache/remove", {}, param);
};
