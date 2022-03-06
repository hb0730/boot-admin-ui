import { http } from "../../utils/http";
import { DictCache } from "../model/system/dict_model";

export function getCache(): Promise<DictCache[]> {
  return http.get<any, DictCache[]>("/system/dict/cache/get");
}
export function updateCache(): Promise<string> {
  return http.get<any, string>("/system/dict/cache/update");
}
