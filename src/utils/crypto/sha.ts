/**
 *  SHA-256加密,返回16进制字符串,32位
 * @param text 需要加密的文本
 * @returns SHA-256加密后的16进制字符串
 */
export async function has256Hex(text: string): Promise<string> {
  const data = await encrypt(text, 'SHA-256')
  return ab2Hex(data)
}

/**
 *  SHA-256加密,返回ArrayBuffer对象
 * @param text 需要加密的文本
 * @returns ArrayBuffer 对象
 */
export async function has256(text: string): Promise<ArrayBuffer> {
  return await encrypt(text, 'SHA-256')
}

export async function has256String(text: string): Promise<string> {
  const data = await encrypt(text, 'SHA-256')
  return arrayBufferToString(data)
}

/**
 *  加密
 * @param text 需要加密的文本
 * @param algorithm 加密算法
 * @returns ArrayBuffer 对象
 */
export async function encrypt(text: string, algorithm: string): Promise<ArrayBuffer> {
  const textBuffer = new TextEncoder().encode(text)
  return await window.crypto.subtle.digest(algorithm, textBuffer)
}

/**
 *  ArrayBuffer转16进制字符串,32位
 * @param buffer ArrayBuffer 对象
 * @returns 16进制字符串
 */
function ab2Hex(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => (`00${x.toString(16)}`).slice(-2)).join('')
}

/**
 *  ArrayBuffer转UTF-8编码的字符串
 * @param buffer ArrayBuffer 对象
 * @returns UTF-8编码的字符串
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buffer)
}
