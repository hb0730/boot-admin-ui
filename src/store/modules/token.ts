import { defineStore } from "pinia";
import { store } from "/@/store";
import { db } from "/@/utils/storage/db";
import { authAPi } from "/@/api/auth";
import { LoginUser } from "/@/api/model/auth_model";
import { Result } from "/@/api/model/domain";
import { warnMessage } from "/@/utils/message";
import { cookies } from "/@/utils/storage/cookie";
import dayjs from "dayjs";
import router from "/@/router";
import { initRouter } from "/@/router/utils";
import { dictStoreHook } from "./dict";
import { getCache } from "/@/api/dict_cache";

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
          value: JSON.stringify(login)
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
    async login({ username = "", password = "", remember = false }) {
      //set remember cache
      this.setRemember({ username, password, remember }, remember);
      try {
        const result: Result<LoginUser> = await authAPi.login({
          username: username,
          password: password
        });
        if (result.code === "0") {
          this.setToken(
            result.data.accessToken,
            dayjs(result.data.expireTime).date()
          );
          this.setUserId(result.data.id);
          this.loginAfter(result.data);
        } else {
          warnMessage(result.message);
        }
      } catch (error) {
        Promise.resolve(error);
      }
    },
    loginAfter(loginUser: LoginUser) {
      db.dbSet({
        dbName: "sys",
        path: "userInfo",
        value: JSON.stringify(loginUser),
        user: true
      });
      this.updateCache();
      initRouter(loginUser.username).then(() => {});
      router.push("/");
    },
    updateCache() {
      //数据字典
      getCache().then(result => {
        dictStoreHook().set(result.data);
      });
    }
  }
});

export function tokenStoreHook() {
  return tokenStore(store);
}
