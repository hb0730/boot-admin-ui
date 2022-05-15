import { hideLoading, showLoading } from "../utils/loading";
import { BaseClass, BaseQuery } from "./model/domain";
import { downloadFileBlob } from "/@/utils/file";
import { http } from "/@/utils/http";
import { PureHttpResponse, RequestMethods } from "/@/utils/http/types";

export default abstract class BaseRequest {
  private pageUrl: string;
  private listUrl: string;
  private saveUrl: string;
  private updateUrl: string;
  private deleteUrl: string;
  constructor() {
    this.pageUrl = "/list/page";
    this.listUrl = "/list";
    this.saveUrl = "/save";
    this.updateUrl = "/update/:id";
    this.deleteUrl = "/delete";
  }
  abstract getBaseUrl(): string;
  /**
   * 分页查询
   *
   * @param params 请求参数
   * @return 分页列表
   */
  page<T, Q extends BaseQuery>(query: Q): Promise<T> {
    return this.post<T>(this.pageUrl, query);
  }
  /**
   * 列表查询
   *
   * @param params 请求参数
   * @return 列表
   */
  list<T, Q extends BaseQuery>(query: Q): Promise<T> {
    return this.post<T>(this.listUrl, query);
  }
  /**
   * 保存
   *
   * @param dto 参数
   * @return 是否成功
   */
  save<dto extends BaseClass>(data: dto): Promise<string> {
    return this.post<string>(this.saveUrl, data);
  }
  /**
   * 根据id修改
   *
   * @param id  id
   * @param dto 修改参数
   * @return 是否成功
   */
  updateById<dto extends BaseClass>(id: string, data: dto): Promise<string> {
    return this.put<string>(this.updateUrl.replace(":id", id), data);
  }
  /**
   * 删除
   *
   * @param id id
   * @return 是否成功
   */
  deleteById(id: string): Promise<string> {
    return this.delete(this.deleteUrl + "/" + id, null);
  }
  /**
   * 根据id批量删除
   *
   * @param ids id
   * @return 是否成功
   */
  deleteBatch(ids: string[]): Promise<string> {
    return this.post(this.deleteUrl, ids);
  }
  /**
   * get request
   * @param url request url
   * @param params request params
   * @returns response result
   */
  public get<T>(url: string, params?: any): Promise<T> {
    return this.requestNonLoading<T, any>("get", url, { params: params });
  }
  /**
   * post request
   * @param url request url
   * @param data post data
   * @returns response result
   */
  public post<T>(url: string, data?: any): Promise<T> {
    return this.requestNonLoading<T, any>("post", url, { data: data });
  }
  /**
   * put request
   * @param url request url
   * @param data put data
   * @returns response result
   */
  public put<T>(url: string, data: any): Promise<T> {
    return this.requestNonLoading<T, any>("put", url, { data: data });
  }
  /**
   * delete request
   * @param url url request url
   * @param params delete params
   * @returns response result
   */
  public delete<T>(url: string, params?: any): Promise<T> {
    return this.requestNonLoading<T, any>("delete", url, params);
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
    showLoading();
    return http
      .request<T>(method, this.getBaseUrl().trim() + url, params)
      .finally(() => {
        hideLoading();
      });
  }
  /**
   * http request 无遮挡
   * @returns
   */
  public requestNonLoading<T, P>(
    method: RequestMethods,
    url: string,
    params?: P
  ): Promise<T> {
    return http.request<T>(method, this.getBaseUrl().trim() + url, params);
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
    let response: PureHttpResponse = null;
    return http
      .request<void>(method, this.getBaseUrl().trim() + url, params, {
        responseType: "blob",
        beforeResponseCallback: function (res: PureHttpResponse) {
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
