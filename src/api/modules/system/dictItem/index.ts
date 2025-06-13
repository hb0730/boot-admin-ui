import type { System } from './types'
import type { ResPage } from '@/api/types'
import http from '@/api'

/**
 * 分页查询
 * @param query
 * @returns
 */
export function page(query?: System.DictItemQuery) {
  return http.get<ResPage<System.ResDictItem>>(`/sys/dict/item/page`, query)
}

/**
 * 列表查询
 * @param query
 * @returns
 */
export function list(query?: System.DictItemQuery) {
  return http.get(`/sys/dict/item/list`, query)
}

/**
 * 保存
 * @param data
 * @returns
 */
export function save(data: System.ReqDictItemForm) {
  return http.post(`/sys/dict/item/save`, data)
}

/**
 * 更新
 * @param id
 * @param data
 * @returns
 */
export function update(id: string, data: System.ReqDictItemForm) {
  return http.put(`/sys/dict/item/update/${id}`, data)
}

/**
 * 删除
 * @param id
 * @returns
 */
export function del(id: string) {
  return http.delete(`/sys/dict/item/del`, { id })
}
