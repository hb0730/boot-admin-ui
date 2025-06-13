import type { ReqPage } from '@/api/types'

export namespace System {
  export interface UserQuery extends ReqPage {
    username?: string
    nickname?: string
    status?: boolean
    phone?: string
    email?: string
  }

  export interface ResUser {
  }

  export interface ReqSaveUserForm {
    username: string
    nickname: string
    password: string
    phone?: string
    email?: string
    gender?: number
    status?: boolean
  }
  export interface ReqUpdateUserForm {
    nickname: string
    phone?: string
    email?: string
    gender?: number
    status?: boolean
  }

  export interface ResUserRole {
    id: string
    userId: string
    roleId: string
    endTime?: string
  }

  export interface ReqUserRoleForm {
    roleId: string
    endTime?: string
  }
}
