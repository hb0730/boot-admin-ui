import { defineStore } from "pinia";
import { store } from "/@/store";
import { db } from "/@/utils/storage/db";
import { authAPi } from "/@/api/system/auth";
import { LoginUser } from "/@/api/model/system/auth_model";
import { cookies } from "/@/utils/storage/cookie";
import dayjs from "dayjs";
import { initRouter } from "/@/router/utils";
import { dictStoreHook } from "./dict";
import { getCache, updateCache } from "/@/api/system/dict_cache";
import { menuStoreHook } from "./menu";
import { usePermissionStoreHook } from "./permission";

export const tokenStore = defineStore({
  id: "token-store",
  actions: {
    setToken(token: string, expireTime: Date) {
      cookies.set("token", token, { expires: expireTime });
    },
    getToken(): string | undefined {
      return cookies.get("token");
    },
    setUserId(userId: string) {
      cookies.set("uuid", userId);
    },
    isCurrentUserAdmin(): boolean {
      const user: LoginUser = this.getCurrentUserInfo();
      return user.isAdmin === 1;
    },
    getCurrentUserInfo(): LoginUser {
      return JSON.parse(
        db.dbGet({ dbName: "sys", path: "userInfo", user: true })
      );
    },
    /**
     *设置缓存信息
     * @param login username/password
     * @param remember remember me
     */
    setRemember(
      login: { username: string; password: string; remember: boolean },
      remember: boolean
    ): void {
      if (remember) {
        db.dbSet({
          dbName: "sys",
          path: "remember",
          value: JSON.stringify(login)
        });
      } else {
        db.dbSet({
          dbName: "sys",
          path: "remember",
          value: JSON.stringify({})
        });
      }
    },
    getRemember(): { username: string; password: string; remember: boolean } {
      const user = db.dbGet({
        dbName: "sys",
        path: "remember",
        defaultValue: JSON.stringify({
          username: "",
          password: "",
          remember: false
        })
      });
      return JSON.parse(user);
    },
    /**
     *登录
     * @param param0 登录参数
     */
    login({ username = "", password = "", remember = false }) {
      //set remember cache
      this.setRemember({ username, password, remember }, remember);
      return new Promise((resolve, reject) => {
        authAPi
          .login({ username: username, password: password })
          .then(async (res: LoginUser) => {
            this.setToken(res.accessToken, dayjs(res.expireTime).date());
            this.setUserId(res.id);
            this.loginAfter(res);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async logout() {
      const self = this;
      return authAPi.logout().then(result => {
        //移除cookie token, user cache
        self.logoutAfter();
        cookies.remove("token");
        cookies.remove("uuid");
        return result;
      });
    },
    logoutAfter() {
      db.dbSet({ dbName: "sys", path: "userInfo", user: true, value: "" });
      db.dbSet({ dbName: "sys", path: "menu", user: true, value: "" });
      db.dbSet({ dbName: "sys", path: "dict", user: false, value: "" });
    },
    loginAfter(loginUser: LoginUser) {
      db.dbSet({
        dbName: "sys",
        path: "userInfo",
        value: JSON.stringify(loginUser),
        user: true
      });
      this.updateCache().then(async () => {
        usePermissionStoreHook().clearAllWholeMenus();
        initRouter(loginUser.username);
      });
    },
    async updateCache(): Promise<void> {
      await menuStoreHook()
        .updateCurrentMenu()
        .then(_ => {
          usePermissionStoreHook().clearAllWholeMenus();
          initRouter("");
        });
      await updateCache().then(() => {
        getCache().then(result => {
          dictStoreHook().set(result);
        });
      });
      return Promise.resolve();
    }
  }
});

export function tokenStoreHook() {
  return tokenStore(store);
}
