import { defineStore } from "pinia";
import { store } from "..";
import { db } from "/@/utils/storage/db";
import { menuApi } from "../../api/system/menu";

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
        self.setMenu(result);
        return Promise.resolve(result);
      });
    },
    async updateCurrentMenu(): Promise<any> {
      await menuApi.updateCurrent();
      const self = this;
      return menuApi.getCurrentRouter().then(result => {
        self.setMenu(result);
        return Promise.resolve(result);
      });
    }
  }
});

export function menuStoreHook() {
  return menuStore(store);
}
