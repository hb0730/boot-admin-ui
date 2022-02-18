/**
 * 响应结构
 */
export interface Result<T> {
  code: string;
  message: string;
  data: T;
}
