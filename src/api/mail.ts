import BaseRequest from "./base";
import { MailModel, mailTestInfo } from "./model/mail_model";
enum API {
  BASE_URL = "/api/v3/message/mail",
  info = "/",
  save = "/save",
  test = "/test"
}
class MailAPI extends BaseRequest {
  getBaseUrl(): String {
    return API.BASE_URL;
  }
  info(): Promise<MailModel> {
    return this.get<MailModel>(API.info);
  }
  save(model: MailModel): Promise<string> {
    return this.post<string>(API.save, model);
  }
  test(info: mailTestInfo): Promise<string> {
    return this.post<string>(API.test, info);
  }
}

export const mailApi = new MailAPI();
