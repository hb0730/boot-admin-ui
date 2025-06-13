import { clone as _clone, cloneDeep, orderBy } from 'lodash-es'

const mode = import.meta.env.VITE_ROUTER_MODE ?? 'history'
/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {object} result 处理后的结果
 * @returns {object}
 */
export function getAllBreadcrumbList(menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}) {
  for (const item of menuList) {
    result[item.path] = [...parent, item]
    if (item.children)
      getAllBreadcrumbList(item.children, result[item.path], result)
  }
  return result
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
  return newMenuList.filter((item) => {
    item.children?.length && (item.children = getShowMenuList(item.children))
    return !item.meta?.isHide
  })
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {string}
 */
export function getUrlWithParams(): string {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search,
  }
  return url[mode]
}

/**
 * @description 生成随机字符串
 * @param length 长度
 * @returns {string}
 */
export function random(length: number = 16): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const maxPos = chars.length
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return result
}

/**
 *
 * @description 拷贝
 * @param data 需要拷贝的数据
 * @param deep 是否深拷贝
 * @returns {T}
 */
export function clone<T>(data: T, deep: boolean = false): T {
  return deep ? cloneDeep(data) : _clone(data)
}

/**
 *  列表转树形结构
 * @param list 列表
 * @param sort 排序方式, 默认升序
 * @returns {Array}
 */
export function deepTree(list: any[], sort?: 'desc' | 'asc'): any[] {
  const newList: any[] = []
  const map: any = {}

  orderBy(list, 'sort', sort)
    .map((e) => {
      map[e.id] = e
      return e
    })
    .forEach((e) => {
      const parent = map[e.parentId]

      if (parent) {
        (parent.children || (parent.children = [])).push(e)
      }
      else {
        newList.push(e)
      }
    })

  return newList
}

/**
 *  获取list中所有key的值
 * @param data 数据
 * @param key 键名
 * @returns {Array}
 */
export function getKeyList(data: any, key: string): any[] {
  const list: any[] = []
  data.forEach((item: any) => {
    list.push(item[key])
    if (item.children) {
      list.push(...getKeyList(item.children, key))
    }
  })
  return list
}

// ==== buildShortUUID  函数====

export function buildShortUUID(prefix = '') {
  // 生成uuid
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  return prefix + uuid
}

// ===== copyText 函数 =====
export function copyText(text: string) {
  return new Promise((resolve, reject) => {
    // 是否支持 clipboard
    if (!navigator.clipboard) {
      // 兼容处理
      const input = document.createElement('input')
      input.setAttribute('value', text)
      document.body.appendChild(input)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        document.body.removeChild(input)
        resolve(true)
      }
      else {
        document.body.removeChild(input)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('复制失败')
      }
    }
    else {
      navigator.clipboard.writeText(text).then(() => {
        resolve(true)
      }, () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('复制失败')
      })
    }
  })
}

/**
 * @description 跳转link
 */
export function openLink(link: string) {
  window.open(link, '_blank')
}
