import { http } from "../utils/http";
import { DictCache } from "./model/dict_model";
import { Result } from "./model/domain";

export function getCache(): Promise<Result<DictCache[]>> {
  return http.get<Result<DictCache[]>>("/api/v3/system/dict/cache/get");
}
export function updateCache(): Promise<Result<string>> {
  return http.get<Result<string>>("/api/v3/system/dict/cache/update");
}
