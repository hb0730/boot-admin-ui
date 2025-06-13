export interface FormItemProps {
  [key: string]: any
  [key: symbol]: any
  /**
   * 菜单类型
   */
  menuType?: number
  /**
   * 菜单名称
   */
  title?: string
  /**
   * 路由名称
   */
  routeName?: string
  /**
   * 路由地址
   */
  routePath?: string
  /**
   * 菜单图标
   */
  icon?: string
  /**
   * 菜单排序
   */
  sort?: number
  /**
   * id
   */
  id?: string
  /**
   * 父级id
   */
  parentId?: string
  /**
   * 是否需要登陆
   */
  isRequiredLogin?: boolean
  /**
   * 是否固定页签
   */
  isAffix?: boolean
  /**
   * 是否隐藏
   */
  isHidden?: boolean
  /**
   * 是否缓存
   */
  isKeepAlive?: boolean
  /**
   * 是否全屏
   */
  isFullScreen?: boolean
}
