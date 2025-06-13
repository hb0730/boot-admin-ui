import type { ReqPage } from '@/api/types'

export namespace AttachmentList {
  /**
   * 查询参数
   */
  export interface ReqQuery extends ReqPage {
    displayName?: string
    contentType?: string
  }

  /**
   * 返回参数
   */
  export interface ResPage {
    id: string
    displayName: string
    contentType: string
    size: number
    permalink: string
    created: string
  }

}
