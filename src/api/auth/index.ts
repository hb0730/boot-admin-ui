import { RSA } from "@/utils/crypto";
import { post, Result } from "../base";

/**
 * 用户登录换取token
 * @param username 用户名
 * @param password 密码
 */
export function login(username: string, password: string) {
  return post<any, Result<any>>("/auth/login", {
    username: username,
    password: RSA.encrypt(password)
  });
}
/**
 *  登出
 *
 * @returns .
 */
export function logout() {
  return post<any, Result<any>>("/auth/logout", {});
}
