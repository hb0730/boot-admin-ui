import { BaseClass, BaseQuery } from "../domain";
export interface User extends BaseClass {
  id: string;
  username: string;
  nickName: string;
  phonenumber: string;
  gender: number;
  isEnabled: number;
  email: string;
  isAdmin: number;
  deptId: string;
  roleIds: string[];
  postIds: string[];
  description: string;
}

export interface UserInfo extends BaseClass {
  /**
   * id
   */
  id: string;
  /**
   * 用户账号
   */
  username: string;
  /**
   * 昵称
   */
  nickName: string;

  /**
   * 用户手机号
   */
  phoneNumber: string;

  /**
   * 性别
   */
  gender: number;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 邮箱
   */
  email: string;
}
export interface UpdatePassword {
  /**
   * 原密码
   */
  oldPassword: string;
  /**
   * 新密码
   */
  newPassword: string;
  /**
   * 原密码
   */
  newPassword2: string;
}
export interface UserQuery extends BaseQuery {
  deptId?: string;
  nickName?: string;
  username?: string;
  isEnabled?: number;
}
