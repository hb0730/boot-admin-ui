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
export const filterDictName = (
  options: DictEntryCache[],
  value: string
): string | null => {
  const result = options.filter(v => {
    v.value === value;
  });
  if (result) {
    return result[0].label;
  } else {
    return null;
  }
};
