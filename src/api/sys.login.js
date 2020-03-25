import request from '@/plugin/axios'
import { httpPost, httpGet } from './http'
import { loginPath, logoutPath } from './baseUrl'

/**
 * 用户登录(废弃)
 * @param data
 * @constructor
 */
export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 用户登录
 * @param data
 * @constructor
 */
export function Login (data) {
  let url = loginPath + '?username=' + data.username + '&password=' + data.password
  data = null
  return httpPost(url, data)
}

/**
 * 登出
 * @constructor
 */
export function Logout () {
  let url = logoutPath
  return httpGet(url, null)
}
