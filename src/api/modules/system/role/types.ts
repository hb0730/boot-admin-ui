import type { ReqPage } from '@/api/types'

export namespace System {
  export interface RoleQuery extends ReqPage {
    roleName?: string
    roleCode?: string
    status?: number
  }
  export interface ResRole {
    id: string
    roleName: string
    roleCode: string
    remark?: string
    status: number
  }

  export interface ReqRoleForm {
    id?: string
    roleName: string
    roleCode: string
    remark?: string
    status: number
  }
}
