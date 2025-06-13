/** 6位数字验证码正则 */
export const REGEXP_SIX = /^\d{6}$/

/** 手机号正则 */
export const REGEXP_PHONE = /^1[3-9]\d{9}$/

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
// eslint-disable-next-line regexp/no-useless-assertions
export const REGEXP_PWD = /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^[^\n\r\u2028\u2029\u4E00-\u9FA5]*[\u4E00-\u9FA5].*$)([\s\S]){8,18}$/

/** 邮箱正则 */
export const REGEXP_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
