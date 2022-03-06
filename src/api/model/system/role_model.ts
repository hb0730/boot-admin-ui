import { BaseClass, BaseQuery } from "../domain";

export interface RoleQuery extends BaseQuery {
  name?: string;
  code?: string;
  isEnabled?: number;
}
export interface Role extends BaseClass {
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
   * 标识
   */
  code: string;

  /**
   * 排序
   */
  sort: number;
  deptIds: string[];
  permissionIds: string[];
}
