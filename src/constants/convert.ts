import * as constants from "./constants";
/**
 * enabled convert
 * @param value .
 * @returns .
 */
export function enableConvert(value: number): string {
  return constants.enableMap[value];
}
export function enabledBooleanConvert(value: number): boolean {
  return constants.enableBooleanMap[value];
}
/**
 *系统配置类型
 * @param value .
 * @returns .
 */
export function configTypeConvert(value: number): string {
  return constants.configTypeMap[value];
}
