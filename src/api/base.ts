import { ElLoading } from "element-plus";
import { downloadFileBlob } from "../utils/file";
import { http } from "../utils/http";
import { PureHttpResoponse, RequestMethods } from "../utils/http/types";

export default class BaseRequest {
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
  /**
   * file download
   * @param method method
   * @param url url
   * @param params params
   * @returns void
   */
  public downloadFileRequest<R>(
    method: RequestMethods,
    url: string,
    params?: R
  ): Promise<void> {
    let response: PureHttpResoponse = null;
    return http
      .request<void>(method, this.getBaseUrl().trim() + url, params, {
        responseType: "blob",
        beforeResponseCallback: function (res: PureHttpResoponse) {
          response = res;
        }
      })
      .then(result => {
        const contentDisposition = response.headers["content-disposition"];
        downloadFileBlob(
          result,
          response.headers["content-type"],
          contentDisposition
        );
        return Promise.resolve();
      });
  }
  /**
   * file upload request
   * @param url request url
   * @param files file data
   * @returns response
   */
  public uploadFileRequest<T>(url: string, files: any[]): Promise<T> {
    const fileData = new FormData();
    files.forEach(file => {
      fileData.append("file", file);
    });
    return http.request<T>(
      "post",
      this.getBaseUrl().trim() + url,
      { data: fileData },
      {
        headers: { "content-type": "multiple/form-data" }
      }
    );
  }
}
