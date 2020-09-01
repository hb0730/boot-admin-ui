import { isArray } from 'lodash'
const hepler = {};

/**
 * @description 检查一个对象是否有子元素
 * @param {Object} item 检查的对象
 * @param {String} keyname 子元素的 keyname
 */
hepler.hasChildren = function (item = {}, keyname = 'children') {
    return item[keyname] && isArray(item[keyname]) && item[keyname].length > 0
}

export default hepler;