import type { Auth } from './types'
import http from '@/api'

/**
 *  用户名登录
 * @param params .
 */
export async function loginByUsername(params: Auth.ReqLoginForm) {
  return http.post<string>(`/auth/login/password`, {
    username: params.username,
    password: params.password,
  })
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser() {
  return http.get(`/auth/user`, {}, { loading: false })
}

// 获取菜单列表
export function getAuthMenuList() {
  return http.get<any>(`/auth/menu`, {})
}

/**
 * 退出登录
 */
export async function logout() {
  return http.post(`/auth/logout`, {})
}
