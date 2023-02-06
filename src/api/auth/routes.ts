import { get, Result } from "../base";

/**
 * 当前用户的路由信息
 * @returns .
 */
export function getRoutes(): Promise<Result<any>> {
  return get<any, Result<any>>("/sys/permission/routes", {});
}
