import { defineStore } from "pinia";
import { store } from "..";
import { storageLocal, storageSession } from "@pureadmin/utils";
import { login, logout } from "@/api/auth";
import {
  type AuthInfo,
  authInfoKey,
  authTokenKey,
  cacheAuth
} from "@/utils/auth";
import { Result } from "@/api/base";
import { useMultiTagsStoreHook } from "./multiTags";
import { routerArrays } from "@/layout/types";
import router, { resetRouter } from "@/router";
export type LoginRequest = {
  username: string;
  password: string;
  remember?: boolean;
};
/**
 * 认证与授权相关 cache
 */
export const authStore = defineStore({
  id: "authStore",
  state: () => ({
    loginUser: storageLocal().getItem<LoginRequest>("login_info") ?? {
      username: "",
      password: "",
      remember: false
    },
    userInfo: storageSession().getItem<AuthInfo>(authInfoKey),
    authToken: storageSession().getItem<string>(authTokenKey) ?? ""
  }),
  actions: {
    setAuthToken(token: string) {
      this.authToken = token;
    },
    setUserInfo(userInfo: AuthInfo) {
      this.userInfo = userInfo;
    },
    getPermission(): string[] {
      return this.userInfo.permissions;
    },
    /**
     * 缓存登录信息
     * @param data .
     */
    cacheRemember(data: LoginRequest) {
      if (data.remember) {
        storageLocal().setItem<LoginRequest>("login_info", data);
        this.loginUser = data;
      } else {
        storageLocal().removeItem("login_info");
        this.loginUser = { username: "", password: "", remember: false };
      }
    },
    /**
     *  登录
     * @param data .
     */
    login(data: LoginRequest): Promise<Result<any>> {
      this.cacheRemember(data);
      return login(data.username, data.password).then((res: any) => {
        if (res.success) {
          cacheAuth(res.result);
        }
        return Promise.resolve(res);
      });
    },
    /**
     * 登出
     */
    logout() {
      return logout().then((res: any) => {
        //清理缓存
        if (res.success) {
          storageSession().clear();
          useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
          resetRouter();
          router.push("/login");
        }
      });
    }
  }
});
export function useAuthStoreHook() {
  return authStore(store);
}
