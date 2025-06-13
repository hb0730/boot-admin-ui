import type { ReqPage } from '@/api/types'

export namespace System {

  export interface DictItemQuery extends ReqPage {
    dictId?: string
    keyword?: string
    status?: number
  }

  export interface ResDictItem {
    id: string
    dictId: string
    itemName: string
    itemValue: string
    status: number
    description?: string
  }

  export interface ReqDictItemForm {
    id?: string
    dictId: string
    itemName: string
    itemValue: string
    status: number
    description?: string
  }

}
