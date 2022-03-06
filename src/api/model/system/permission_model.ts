import { BaseQuery } from "../domain";
export interface Permission {
  id: string;
  name: string;
  permission: string;
  menuId: string;
  sort: number;
  description: string;
  isEnabled: number;
}

export interface Query extends BaseQuery {
  menuId?: string;
  name?: string;
  permission?: string;
}
