import { http } from "@/utils/http";
export interface Result<T> {
  code: number;
  message: string;
  result: T;
  success: boolean;
  timestamp: number;
}
export interface BaseQuery {
  size?: number;
  current?: number;
}
/**
 * post
 */
export function post<T, P>(url: string, data: T): Promise<Result<P>> {
  return http.post<T, Result<P>>(url, { data: data });
}
/**
 * get
 */
export function get<T, P>(url: string, params?: T): Promise<Result<P>> {
  return http.get<T, Result<P>>(url, { params: params });
}
/**
 * put
 * @param url path
 * @param params query
 * @param data body
 * @returns .
 */
export function put<T>(
  url: string,
  params?: any,
  data?: T
): Promise<Result<T>> {
  return http.request("put", url, { params: params, data: data });
}
/**
 * 删除
 * @param url .
 * @param params .
 * @param data .
 * @returns .
 */
export function deleteRequest<T>(
  url: string,
  params?: any,
  data?: any
): Promise<Result<T>> {
  return http.request("delete", url, { params: params, data: data });
}
