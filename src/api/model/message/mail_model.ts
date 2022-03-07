import { BaseClass } from "../domain";

export interface MailModel extends BaseClass {
  /**
   * 发送主机
   */
  host: string;

  /**
   * 协议
   */
  protocol: string;

  /**
   * ssl 端口
   */
  sslPort: number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 发件人
   */
  fromName: string;

  /**
   * 是否启用
   */
  enabled: number;
}
export interface mailTestInfo {
  /**
   * 收件者
   */
  to: string;
  /**
   * 主题
   */
  subject: string;
  /**
   * 内容
   */
  content: string;
}
