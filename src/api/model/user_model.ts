import { BaseClass, BaseQuery } from "./domain";
export interface User extends BaseClass {
  id: string;
  username: string;
  nickName: string;
  phonenumber: string;
  gender: number;
  isEnabled: number;
  email: string;
  isAdmin: number;
  deptId: string;
  roleIds: string[];
  postIds: string[];
  description: string;
}

export interface UserQuery extends BaseQuery {
  deptId?: string;
  nickName?: string;
  username?: string;
  isEnabled?: number;
}
