import { dbGet } from "./util.db"
const dicts = {}

/**
 * 获取字典缓存
 */
dicts.getDict = function () {
   let info = dbGet({
      dbName: 'sys',
      path: 'dict',
      defaultValue: {},
      user: false
   })
   return info;
}
/**
 * 根据类型过滤具体的字典集
 * @param {string} type 类型 
 */
dicts.getDictValue = function (type) {
   let info = dbGet({
      dbName: 'sys',
      path: 'dict',
      defaultValue: {},
      user: false
   })

   let result = JSON.parse(JSON.stringify(info)).filter(function (item, index, array) {
      return item.type == type
   })
   return result[0].entry;
}
/**
 * 字典详情
 * @param {string} type 字典类型 
 * @param {object} value  字典值
 */
dicts.getDictEntryValue = function (type, value) {
   let info = dbGet({
      dbName: 'sys',
      path: 'dict',
      defaultValue: {},
      user: false
   })

   let result = JSON.parse(JSON.stringify(info)).filter(function (item, index, array) {
      return item.type == type
   })
   result = result[0].entry.filter(function (item, index, array) {
      return item.value == value;
   })
   return result[0];
}

export default dicts;