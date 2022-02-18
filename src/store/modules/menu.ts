import { defineStore } from "pinia";
import { store } from "..";
import { db } from "/@/utils/storage/db";
import { menuApi } from "/@/api/menu";
import { warnMessage } from "/@/utils/message";

export const menuStore = defineStore({
  id: "menu-store",
  actions: {
    setMenu(menus: any) {
      db.dbSet({
        dbName: "sys",
        path: "menu",
        user: true,
        value: JSON.stringify(menus)
      });
    },
    getMenu(): string {
      return db.dbGet({ dbName: "sys", path: "menu", user: true });
    },
    /**
     * 当前参数
     * @returns 当前参数
     */
    getCurrentMenu(): Promise<any> {
      const self = this;
      const menu = this.getMenu();
      if (menu) {
        return Promise.resolve(JSON.parse(menu));
      }
      return menuApi.getCurrentRouter().then(result => {
        if (result.code === "0") {
          self.setMenu(result.data);
          return Promise.resolve(result.data);
        } else {
          warnMessage(result.message);
          return Promise.resolve([]);
        }
      });
    }
  }
});

export function menuStoreHook() {
  return menuStore(store);
}
