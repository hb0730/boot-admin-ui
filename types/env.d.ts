/// <reference types="vite/client" />

declare interface ViteEnv {
  /**
   * @description application name
   */
  readonly VITE_APP_TITLE: string
  /**
   * @description: vite port
   */
  readonly VITE_PORT: number
  /**
   * @description:  public path
   */
  readonly VITE_PUBLIC_PATH: string
  /**
   * @description:  route mode [hash, history]
   */
  readonly VITE_ROUTER_MODE: 'hash' | 'history'
  /**
   * @description:  base api
   */
  readonly VITE_API_URL: string
}

interface ImportMetaEnv extends ViteEnv {
  _: unknown
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示
 */
declare const __APP_INFO__: {
  pkg: {
    name: string
    version: string
    engines: {
      node: string
    }
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
  }
  buildTimestamp: number
}

declare module 'vue3-json-viewer';

declare module 'jsonlint-mod';
