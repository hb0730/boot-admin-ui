import { type SelectOption, get } from "../base";

/**
 * 菜单类型
 * @returns .
 */
export function menuTypes() {
  return get<any, SelectOption[]>(`/sys/enums/menuType`);
}
