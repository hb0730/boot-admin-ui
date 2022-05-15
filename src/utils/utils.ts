import { DictEntryCache } from "/@/api/model/system/dict_model";

/**
 * 得到value对应的 cache
 * @param options 选项
 * @param value value
 * @returns option or null
 */
export const filterDict = (
  options: DictEntryCache[],
  value: string
): DictEntryCache | null => {
  const result = options.filter(v => v.value === value);
  if (result) {
    return result[0];
  } else {
    return null;
  }
};
/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == "object")) {
    return;
  }

  for (const key in obj) {
    if (
      //eslint-disable-next-line
      obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] === "")
    ) {
      delete obj[key];
    }
  }
  return obj;
}
/**
 * 类型转换
 * @param source
 * @param target
 * @returns
 */
export function convertType(source: any, target?: string): any {
  if (source === undefined || source === null) {
    return source;
  }
  switch (target) {
    case "String":
      return source.toString();
    case "Number":
      return Number(source);
    default:
      return source.toString();
  }
}
