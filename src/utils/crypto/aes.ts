/**
 * Encrypt text using AES algorithm
 * @param text - The text to encrypt
 * @param key - The key to encrypt the text
 * @param iv - The iv to encrypt the text
 * @returns The encrypted text
 */
export async function encrypt(text: string, key: string, iv: string): Promise<string> {
  const keyBuffer = hex2Ab(key)
  const ivBuffer = hex2Ab(iv)
  const textBuffer = string2Buffer(text)
  const algorithm = { name: 'AES-CBC', iv: ivBuffer }
  const keyObj = await window.crypto.subtle.importKey('raw', keyBuffer, 'AES-CBC', false, ['encrypt'])
  const data = await window.crypto.subtle.encrypt(algorithm, keyObj, textBuffer)
  return buffer2String(data)
}

/**
 * Encrypt text using AES algorithm
 * @param text - The text to encrypt
 * @param key - The key to encrypt the text
 * @param iv - The iv to encrypt the text
 * @returns The encrypted text
 */
export async function encryptHex(text: string, key: string, iv: string): Promise<string> {
  const keyBuffer = hex2Ab(key)
  const ivBuffer = hex2Ab(iv)
  const textBuffer = string2Buffer(text)
  const algorithm = { name: 'AES-CBC', iv: ivBuffer }
  const keyObj = await window.crypto.subtle.importKey('raw', keyBuffer, 'AES-CBC', false, ['encrypt'])
  const data = await window.crypto.subtle.encrypt(algorithm, keyObj, textBuffer)
  return ab2Hex(data)
}

/**
 *  Encrypt text using AES algorithm
 * @param text - The text to encrypt
 * @param key - The key to encrypt the text
 * @param iv - The iv to encrypt the text
 * @returns The encrypted text
 */
export async function encryptHexToKeyHex(text: string, key: string, iv: string): Promise<string> {
  const keyBuffer = hex2Ab(key)
  const ivBuffer = hex2Ab(iv)
  const textBuffer = string2Buffer(text)
  const algorithm = { name: 'AES-CBC', iv: ivBuffer }
  const keyObj = await window.crypto.subtle.importKey('raw', keyBuffer, 'AES-CBC', false, ['encrypt'])
  const data = await window.crypto.subtle.encrypt(algorithm, keyObj, textBuffer)
  return ab2Hex(data)
}

/**
 *  字符串转UTF-8编码的ArrayBuffer
 * @param text 字符串
 * @returns UTF-8编码的ArrayBuffer
 */
function string2Buffer(text: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(text).buffer
}

/**
 *  ArrayBuffer转UTF-8编码的字符串
 * @param buffer ArrayBuffer 对象
 * @returns UTF-8编码的字符串
 */
function buffer2String(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buffer)
}

/**
 *  ArrayBuffer转16进制字符串,32位
 * @param buffer ArrayBuffer 对象
 * @returns  .
 */
function ab2Hex(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => (`00${x.toString(16)}`).slice(-2)).join('')
}

/**
 *  16进制字符串转ArrayBuffer
 * @param hex  .
 * @returns
 */
function hex2Ab(hex: string): ArrayBuffer {
  const buffer = new Uint8Array(hex.match(/[\da-f]{2}/gi)!.map((h: string) => Number.parseInt(h, 16)))
  return buffer.buffer
}
