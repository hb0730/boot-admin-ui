import { BaseClass, BaseQuery } from "../domain";

export interface PostQuery extends BaseQuery {
  isEnabled?: number;
  name?: string;
  number?: string;
}
export interface Post extends BaseClass {
  /**
   * 备注
   */
  description: string;

  /**
   * id
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 编码
   */
  number: string;

  /**
   * 排序
   */
  sort: number;
}
