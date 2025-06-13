// 内置字段
export const innerKeys = ['value', 'label']

// 菜单配置值类型 字典项
export const dictValueTypeKey = 'dictValueType'

// 菜单配置值类型 状态
export const dictStatus = 'systemStatus'

// 加载的字典值
export const dictKeys = [dictValueTypeKey, dictStatus]

/**
 * 额外参数类型
 */
export interface ExtraParamType {
  name: string
  type: string
}
// 配置值类型定义
export const ValueType = {
  // 字符串
  STRING: 'STRING',
  // 整数
  INTEGER: 'INTEGER',
  // 小数
  DECIMAL: 'DECIMAL',
  // 布尔值
  BOOLEAN: 'BOOLEAN',
  // 颜色
  COLOR: 'COLOR',
}
// 快捷定义字段
export const definedExtraKeys = [
  {
    name: 'disabled',
    type: ValueType.BOOLEAN,
  },
  {
    name: 'status',
    type: ValueType.STRING,
  },
  {
    name: 'type',
    type: ValueType.STRING,
  },
  {
    name: 'color',
    type: ValueType.COLOR,
  },
  {
    name: 'icon',
    type: ValueType.STRING,
  },
]
