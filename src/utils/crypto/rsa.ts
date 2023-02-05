import jsrsasign from "jsrsasign";
const publicKeyBase64 =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDK0HA6dtI3lMm+ayzt44N0elJQNP1Olnc0l5+0+Es+2fxeYcXmIifhe/lrF24RhdPOTuMYr1tHnkmZKxCojv7LGlxC3xNdOr0tyfYs2EDSijDPdnIWpVlkm+5yzS44R5xEYmaWSk3Y0Zqg3NTXsju1KGN3SF9b5nrTwpRSnmQ2fQIDAQAB";
/**
 * 加密
 * @param data .
 */
export function encrypt(data: string) {
  // const publicKey = jsrsasign.KEYUTIL.parsePublicRawRSAKeyHex(
  //   jsrsasign.b64tohex(publicKeyBase64)
  // );
  // const publicKey = jsrsasign.KEYUTIL.getKey(
  //   jsrsasign.b64tohex(publicKeyBase64),
  //   null,
  //   "pkcs8pub"
  // ) as jsrsasign.RSAKey;
  const rsaKey = new jsrsasign.RSAKey();
  rsaKey.readPKCS8PubKeyHex(jsrsasign.b64tohex(publicKeyBase64));
  return jsrsasign.KJUR.crypto.Cipher.encrypt(data, rsaKey, "RSA");
}
