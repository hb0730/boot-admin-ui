import JSEncrypt from "jsencrypt";
// login password encrypt
const publicKeyBase64 =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzgtWnH39LSI3Imn/lXsLKjm+GKGROa+2g8R0Dr2vE46IAhNGmXPAmRwBWRCTqx+yNhR8gUGyWrM9YAmYyIt+5Ht3GOjPXpZmKqpqB735cIj0iFiHsIPYJ4OjITEbz/olDP2LWdrXYr89xJ69l+Y7uCzHD0NjaB2T3gZQaSKjgqVRo9OHOvMHnbhgP/O6MEKQg+63sdkBwYVWfVl57UDfhUCspizQfm5W2hCp0o23hIK5foVRKnV1ze4Iv+hDORvasZ2XOkP1SKaOMl2BDaQn5HawIjMTL1Kq4khR1f7EZiPakfwxi4AOFhXaSjZwJyuQpgWsIV1Ffc61n0zQIFZxTwIDAQAB";
/**
 * 加密
 * @param data .
 */
export function loginEncrypt(data: string) {
  var encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKeyBase64);
  return encryptor.encrypt(data);
}
