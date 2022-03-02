import { http } from "../utils/http";
import { DictCache } from "./model/dict_model";

export function getCache(): Promise<DictCache[]> {
  return http.get<any, DictCache[]>("/api/v3/system/dict/cache/get");
}
export function updateCache(): Promise<string> {
  return http.get<any, string>("/api/v3/system/dict/cache/update");
}
