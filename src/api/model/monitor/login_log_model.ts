import { BaseClass, BaseQuery } from "../domain";

export interface LoginLogModel extends BaseClass {
  /**
   * 备注
   */
  description: string;

  /**
   * id
   */
  id: string;

  /**
   * 登录名
   */
  username: string;

  /**
   * 登录ip
   */
  loginIp: string;

  /**
   * 浏览器
   */
  browser: string;

  /**
   * 操作系统
   */
  os: string;

  /**
   * 登录状态
   */
  status: number;

  /**
   * 登录信息
   */
  message: string;
}

export interface LoginLogQuery extends BaseQuery {
  username: string;
  loginIp: string;
  status: number;
  startTime: string;
  endTime: string;
}
