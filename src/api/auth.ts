import { RSA } from "@/utils/crypto";
import * as http from "@/api/base";

/**
 * 用户信息
 */
export interface UserInfo {
  /**
   *用户id
   */
  id: number;
  /**
   * username
   */
  username: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * access token
   */
  token: string;
  /**
   * 权限
   */
  permissions?: string[];
  /**
   * 角色
   */
  roles?: string[];
}
/**
 *  登录
 *
 * @param username .
 * @param password .
 */
export const login = async (
  username: string,
  password: string
): Promise<http.Result<UserInfo>> => {
  // password en
  const _pwd = RSA.loginEncrypt(password);
  return http.post("/auth/login", { username, password: _pwd });
};

/**
 * 获取当前用户信息
 * @returns
 */
export function getUserInfo(): Promise<http.Result<UserInfo>> {
  return http.get("/auth/info");
}
/**
 * 注销登出
 *
 * @returns .
 */
export const logout = () => {
  return http.post<any, string>("/auth/logout");
};

/**
 * 当前用户的routes
 */
export const currentRoutes = () => {
  return http.get<any, any>("/sys/permission/current/routes");
};
