import { defineStore } from "pinia";
import { store } from "..";
import { DictCache, DictEntryCache } from "/@/api/model/system/dict_model";
import { db } from "/@/utils/storage/db";
export const dictStore = defineStore({
  id: "dict-store",
  actions: {
    set(info: DictCache[]) {
      db.dbSet({
        dbName: "sys",
        path: "dict",
        value: JSON.stringify(info),
        user: false
      });
    },
    get(): DictCache[] {
      return JSON.parse(
        db.dbGet({
          dbName: "sys",
          path: "dict",
          defaultValue: "",
          user: false
        })
      );
    },
    getEntry(type: string): DictEntryCache[] {
      const result: DictCache[] = this.get();
      if (result.length <= 0) {
        return [];
      }
      return result.filter(v => v.type === type)[0].entry;
    }
  }
});
export function dictStoreHook() {
  return dictStore(store);
}
