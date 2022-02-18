import { merge } from "lodash-es";
import Cookies from "js-cookie";
import { getConfig } from "/@/config";

class JsCookies {
  private static env = getConfig();
  constructor() {}
  /**
   *  存储 cookie 值
   * @param name
   * @param value
   * @param cookieSetting
   */
  set(name = "default", value = "", cookieSetting = {}) {
    const currentCookieSetting = {
      expires: 1
    };
    merge(currentCookieSetting, cookieSetting);
    Cookies.set(
      `${JsCookies.env.Title}-${JsCookies.env.Version}-${name}`,
      value,
      currentCookieSetting
    );
  }
  /**
   * 拿到 cookie 值
   * @param name
   * @returns
   */
  get(name = "default") {
    return Cookies.get(
      `${JsCookies.env.Title}-${JsCookies.env.Version}-${name}`
    );
  }
  /**
   * 拿到 cookie 全部的值
   * @returns
   */
  getAll() {
    return Cookies.get();
  }
  /**
   * 删除 cookie
   * @param name
   */
  remove(name = "default") {
    Cookies.remove(`${JsCookies.env.Title}-${JsCookies.env.Version}-${name}`);
  }
}

export const cookies = new JsCookies();
