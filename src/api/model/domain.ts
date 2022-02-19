/**
 * 响应结构
 */
export interface Result<T> {
  code: string;
  message: string;
  data: T;
}

/**
 * page结构体
 */
export interface Page<T> {
  total: number;
  size: number;
  pages: number;
  records: T;
}

export interface BaseQuery {
  sortType?: string;
  sortColumn?: string[];
  groupColumn?: string[];
  pageNum?: number;
  pageSize?: number;
  total?: number;
}
