import { ElLoading } from "element-plus";
import { http } from "../utils/http";
import { RequestMethods } from "../utils/http/types";

class BaseRequest {
  getBaseUrl(): String {
    return "";
  }
  /**
   * get request
   * @param url request url
   * @param params request params
   * @returns response result
   */
  public get<T>(url: string, params?: any): Promise<T> {
    return this.request<T, any>("get", url, { params: params });
  }
  /**
   * post request
   * @param url request url
   * @param data post data
   * @returns response result
   */
  public post<T>(url: string, data?: any): Promise<T> {
    return this.request<T, any>("post", url, { data: data });
  }
  /**
   * put request
   * @param url request url
   * @param data put data
   * @returns response result
   */
  public put<T>(url: string, data: any): Promise<T> {
    return this.request<T, any>("put", url, { data: data });
  }
  /**
   * delete request
   * @param url url request url
   * @param params delete params
   * @returns response result
   */
  public delete<T>(url: string, params?: any): Promise<T> {
    return this.request<T, any>("delete", url, params);
  }
  /**
   * http request
   * @param method request method
   * @param url request url
   * @param params request params
   * @returns response  result
   */
  public request<T, P>(
    method: RequestMethods,
    url: string,
    params?: P
  ): Promise<T> {
    const instance = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    return http
      .request<T>(method, this.getBaseUrl().trim() + url, params)
      .then(value => {
        instance.close();
        return value;
      })
      .catch(error => {
        instance.close();
        return error;
      });
  }
}
export default BaseRequest;
