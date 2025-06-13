export * as AES from './aes'
export * as SHA from './sha'

/**
 *  16进制字符串转ArrayBuffer
 * @param hex 16进制字符串
 * @returns ArrayBuffer 对象
 */
export async function ab2hex(buffer: ArrayBuffer): Promise<string> {
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => (`00${x.toString(16)}`).slice(-2)).join('')
}

/**
 *  16进制字符串转ArrayBuffer
 * @param hex 16进制字符串
 * @returns ArrayBuffer 对象
 */
export async function hex2ab(hex: string): Promise<ArrayBuffer> {
  const buffer = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
  }
  return buffer.buffer
}

/**
 *  ArrayBuffer转UTF-8编码的字符串
 * @param buffer ArrayBuffer 对象
 * @returns UTF-8编码的字符串
 */
export async function ab2str(buffer: ArrayBuffer): Promise<string> {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buffer)
}

/**
 *  字符串转UTF-8编码的ArrayBuffer
 * @param text 字符串
 * @returns UTF-8编码的ArrayBuffer
 */
export async function str2ab(text: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  return encoder.encode(text).buffer
}

/**
 *  字符串转16进制字符串
 * @param text 字符串
 * @returns 16进制字符串
 */
export async function str2Hex(text: string): Promise<string> {
  const buffer = await str2ab(text)
  return await ab2hex(buffer)
}
