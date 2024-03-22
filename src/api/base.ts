import { http } from "@/utils/http";

/**
 * 通用响应
 */
export interface Result<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}
/**
 * 通用拉下选择
 */
export interface SelectOption {
  label: string;
  value: string;
}
/**
 * 通用分页请求
 */
export interface BasePageQuery {
  /**
   * 分页大小
   */
  size?: number;
  /**
   * 当前页
   */
  current?: number;
}

/**
 *
 * post method
 *
 * @param url 请求地址
 * @param data 请求参数
 * @returns Promise<Result<P>>
 */
export function post<Q, T>(url: string, data?: Q): Promise<Result<T>> {
  return http.post<Q, Result<T>>(url, { data: data });
}

/**
 * get method
 * @param url 请求地址
 * @param params 请求参数
 * @returns Promise<Result<P>>
 */
export function get<Q, T>(url: string, params?: Q): Promise<Result<T>> {
  return http.get<Q, Result<T>>(url, { params });
}

/**
 * put
 * @param url path
 * @param params query
 * @param data body
 * @returns .
 */
export function put<Q, T>(
  url: string,
  params?: Q,
  data?: T
): Promise<Result<String>> {
  return http.request("put", url, { params: params, data: data });
}
/**
 * delete
 * @param url .
 * @param params .
 * @param data .
 * @returns .
 */
export function deleteRequest<Q, T>(
  url: string,
  params?: Q,
  data?: T
): Promise<Result<String>> {
  return http.request("delete", url, { params: params, data: data });
}
