import type { System } from './types'
import type { ResPage } from '@/api/types'
import http from '@/api'
import { random } from '@/utils'
import { AES, SHA, str2Hex } from '@/utils/crypto'
import { isEmail, isPhone } from '@/utils/is'

export function page(query?: System.UserQuery) {
  return http.get<ResPage<System.ResUser>>(`/sys/user/page`, query)
}

export function list(query?: System.UserQuery) {
  return http.get<System.ResUser[]>(`/sys/user/list`, query)
}

export async function hasExists(type: 'user_name' | 'email' | 'phone', value: string, id?: string) {
  let data = value
  if (type !== 'user_name') {
    data = await SHA.has256Hex(value)
  }
  return http.get<string>(`/sys/user/has/${type}`, { value: data, id })
}

export async function save(data: System.ReqSaveUserForm) {
  // 正则判断是否为脱敏数据
  const { phone, email } = data
  if (phone && !isPhone(phone)) {
    data.phone = ''
  }
  if (email && !isEmail(email)) {
    data.email = ''
  }

  const timestamp = new Date().getTime()
  const iv = random(16)
  const _key = await SHA.has256Hex(iv + timestamp)
  const _iv = await str2Hex(iv)
  // 密码加密
  if (data.phone) {
    data.phone = await AES.encryptHex(data.phone, _key, _iv)
  }
  if (data.email) {
    data.email = await AES.encryptHex(data.email, _key, _iv)
  }
  // 密码加密
  data.password = await AES.encryptHex(data.password, _key, _iv)
  const param = {
    ...data,
    captchaKey: iv,
    timestamp,
  }
  return http.post<string>(`/sys/user/save`, param)
}

export async function update(id: string, data: System.ReqUpdateUserForm) {
  // 正则判断是否为脱敏数据
  const { phone, email } = data
  if (phone && !isPhone(phone)) {
    data.phone = ''
  }
  if (email && !isEmail(email)) {
    data.email = ''
  }

  const timestamp = new Date().getTime()
  const iv = random(16)
  const _key = await SHA.has256Hex(iv + timestamp)
  const _iv = await str2Hex(iv)
  // 密码加密
  if (data.phone) {
    data.phone = await AES.encryptHex(data.phone, _key, _iv)
  }
  if (data.email) {
    data.email = await AES.encryptHex(data.email, _key, _iv)
  }
  const param = {
    ...data,
    captchaKey: iv,
    timestamp,
  }
  return http.put<string>(`/sys/user/update/${id}`, param)
}

export async function resetPassword(id: string, password: string) {
  const timestamp = new Date().getTime()
  const iv = random(16)
  const _key = await SHA.has256Hex(iv + timestamp)
  const _iv = await str2Hex(iv)
  const param = {
    password: await AES.encryptHex(password, _key, _iv),
    captchaKey: iv,
    timestamp,
  }
  return http.put<string>(`/sys/user/rest_password/${id}`, param)
}

export async function remove(id: string) {
  return http.delete<string>(`/sys/user/del`, { id })
}

export async function getRoles(id: string) {
  return http.get<System.ResUserRole[]>(`/sys/user/roles`, { id })
}
export async function saveRoles(id: string, roles: System.ReqUserRoleForm[]) {
  return http.put<string>(`/sys/user/roles/${id}`, roles)
}
