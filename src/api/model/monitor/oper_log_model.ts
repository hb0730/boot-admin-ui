import { BaseClass, BaseQuery } from "../domain";

export interface OperLogModel extends BaseClass {
  /**
   * 备注
   */
  description: string;

  /**
   * id
   */
  id: string;

  /**
   * 操作人员
   */
  username: string;

  /**
   * 操作类型
   */
  operType: number;

  /**
   * 操作ip
   */
  operIp: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 请求地址
   */
  requestUrl: string;

  /**
   * 请求方法
   */
  requestMethod: string;

  /**
   * 操作方法
   */
  operMethod: string;

  /**
   * 请求参数
   */
  requestParams: string;

  /**
   * 响应参数
   */
  requestResult: string;

  /**
   * 错误信息
   */
  errorMessage: string;
}

export interface OperLogQuery extends BaseQuery {
  /**
   * 操作用户
   */
  username: string;
  /**
   * 操作类型
   */
  operType: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 状态
   */
  status: number;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
}
