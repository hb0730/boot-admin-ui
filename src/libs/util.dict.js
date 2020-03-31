import { dbGet } from "./util.db"

const dicts = {}

/**
 * 获取数据字典
 * @param info 数据字典集
 * @param type 数据字典类型
 * @param value 数据字典集
 */
dicts.getMapValue = function (info, type, value) {
  let result = info.get(type).filter(function (item, index, array) {
    return item.value == value;
  });
  return result;
}
dicts.getMapType = function (info, type) {
  const array = [];
   info.get(type).forEach(element => {
     array.push(element)
  });
  return array;
}
export default dicts