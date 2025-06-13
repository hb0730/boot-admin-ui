import type { ReqPage } from '@/api/types'

export namespace System {
  export interface DictQuery extends ReqPage {
    keyword?: string
    status?: number
  }

  export interface ResDict {
    id: string
    dictName: string
    dictCode: string
    status: number
    description?: string
  }

  export interface ReqDictForm {
    id?: string
    dictName: string
    dictCode: string
    status: number
    description?: string
  }
  export interface ResDictType {
    label: string
    value: any
    description?: string
    attrs?: any
  }
}
