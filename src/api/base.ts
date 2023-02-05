import { http } from "@/utils/http";
export interface Result<T> {
  code: number;
  message: string;
  result: T;
  success: boolean;
  timestamp: number;
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
export function get<T, P>(url: string, params: T): Promise<Result<P>> {
  return http.get<T, Result<P>>(url, { params: params });
}
