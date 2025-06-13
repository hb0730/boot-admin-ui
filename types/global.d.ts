import { Nullable } from 'plus-pro-components'

declare global {
  type Recordable<T = any> = Record<string, T>
  type Nullable<T> = T | null

  /* Menu */
  declare namespace Menu {
    interface MenuOptions {
      /**
       * @description 路由路径
       */
      path: string
      /**
       * @description 路由名称
       */
      name: string
      /**
       * @description 组件
       */
      component?: string | (() => Promise<unknown>)
      /**
       * @description 重定向
       */
      redirect?: string
      /**
       * @description meta
       */
      meta: MetaProps
      /**
       * @description 子菜单
       */
      children?: MenuOptions[]
    }
    interface MetaProps {
      /**
       * @description 菜单和面包屑对应的图标
       */
      icon: string
      /**
       * @description 路由标题 (用作 document.title || 菜单的名称)
       */
      title: string
      /**
       * @description 当前路由为详情页时，需要高亮的菜单
       */
      activeMenu?: string
      /**
       * @description 是否为外链
       */
      isLink?: string
      /**
       * @description 是否在菜单中隐藏 (通常列表详情页需要隐藏)
       */
      isHide: boolean
      /**
       * @description 是否全屏
       */
      isFull: boolean
      /**
       * @description 是否固定在标签页中
       */
      isAffix: boolean
      /**
       * @description 是否缓存
       */
      isKeepAlive: boolean
      /**
       * @description 是否需要登录
       */
      requireLogin: boolean
    }
  }

  /* TabsMenuProps */
  declare namespace Tabs{
    interface TabsMenuProps {
      /**
       * @description 菜单和面包屑对应的图标
       */
      icon: string
      /**
       * @description 路由标题 (用作 document.title || 菜单的名称)
       */
      title: string
      /**
       * @description 路由路径
       */
      path: string
      /**
       * @description 路由名称
       */
      name: string
      /**
       * @description 是否固定在标签页中
       */
      close: boolean
      /**
       * @description 是否缓存
       */
      isKeepAlive: boolean
    }
  }

  /**
   * 扩展 `Element`
   */
  interface Element {
    // v-ripple 作用于 src/directives/ripple/index.ts 文件
    _ripple?: {
      enabled?: boolean
      centered?: boolean
      class?: string
      circle?: boolean
      touched?: boolean
    }
  }

  /**
   * 扩展 `window`
   */
  interface Window {
    jsonlint: any
  }
}

export {}
