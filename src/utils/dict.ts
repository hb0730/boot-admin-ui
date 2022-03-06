import { DictEntryCache } from "/@/api/model/system/dict_model";

export function getDictEntryInfo(
  entry: DictEntryCache[],
  value: any
): DictEntryCache {
  const result = entry.filter(v => v.value === String(value))[0];
  return result ? result : { label: "", value: value };
}
