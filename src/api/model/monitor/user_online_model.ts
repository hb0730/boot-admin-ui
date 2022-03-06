import { BaseQuery } from "../domain";

export interface UserOnlineModel {
  /**
   * 会话id
   */
  tokenId: string;
  /**
   * 登录账号
   */
  username: string;
  /**
   * 登录IP地址
   */
  ipaddr: string;

  /**
   * 登录地址
   */
  loginLocation: string;

  /**
   * 浏览器类型
   */
  browser: string;

  /**
   * 操作系统
   */
  os: string;

  /**
   * 登录时间
   */
  loginTime: string;
}

export interface UserOnlineQuery extends BaseQuery {
  ipaddr?: string;
  username?: string;
}
