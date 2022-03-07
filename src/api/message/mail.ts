import BaseRequest from "../base";
import { MailModel, mailTestInfo } from "../model/message/mail_model";
enum API {
  BASE_URL = "/message/mail",
  info = "/",
  test = "/test"
}
class MailAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
  info(): Promise<MailModel> {
    return this.get<MailModel>(API.info);
  }
  test(info: mailTestInfo): Promise<string> {
    return this.post<string>(API.test, info);
  }
}

export const mailApi = new MailAPI();
