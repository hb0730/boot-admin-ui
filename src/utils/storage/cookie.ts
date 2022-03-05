import { merge } from "lodash-es";
import Cookies from "js-cookie";
import { Title, Version } from "../../../public/serverConfig.json";
class JsCookies {
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
    Cookies.set(`${Title}-${Version}-${name}`, value, currentCookieSetting);
  }
  /**
   * 拿到 cookie 值
   * @param name
   * @returns
   */
  get(name = "default") {
    return Cookies.get(`${Title}-${Version}-${name}`);
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
    Cookies.remove(`${Title}-${Version}-${name}`);
  }
}

export const cookies = new JsCookies();
