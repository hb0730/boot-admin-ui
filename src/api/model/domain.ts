/**
 * 响应结构
 */
export interface Result<T> {
  code: string;
  message: string;
  data: T;
}
export interface BaseClass {
  /**
   * 创建者
   */
  createUserId?: string;
  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 修改者
   */
  updateUserId?: string;

  /**
   * 修改时间
   */
  updateTime?: string;

  /**
   * 是否启用
   */
  isEnabled?: number;
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
