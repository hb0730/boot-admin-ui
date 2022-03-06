import { BaseClass, BaseQuery } from "../domain";

export interface JobQuery extends BaseQuery {
  name?: string;
  group?: string;
  isEnabled?: number;
}

export interface Job extends BaseClass {
  /**
   * 备注
   */
  description: string;

  /**
   * id
   */
  id: string;

  /**
   * 任务名称
   */
  name: string;

  /**
   * 任务组
   */
  group: string;

  /**
   * Bean名称
   */
  beanName: string;

  /**
   * 方法名称
   */
  beanMethod: string;

  /**
   * 参数
   */
  methodParams: string;

  /**
   * cron表达式
   */
  cron: string;

  /**
   * 负责人
   */
  personInCharge: string;

  /**
   * 负责人邮箱
   */
  email: string;
}
