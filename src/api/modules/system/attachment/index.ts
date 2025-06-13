import type { AttachmentList } from './types'
import type { ResPage } from '@/api/types'
import http from '@/api'

/**
 *  分页查询
 * @param query .
 * @returns
 */
export function page(query?: AttachmentList.ReqQuery) {
  return http.get<ResPage<AttachmentList.ResPage>>(`/sys/attachment/list/page`, query)
}

/**
 * 删除
 * @param id .
 */
export function remove(id: string) {
  return http.delete(`/sys/attachment/list/${id}`)
}
