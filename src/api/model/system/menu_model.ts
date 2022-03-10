export interface RouterModel {
  path: string;
  name: string;
  component: string;
  redirect: string;
  children: Array<RouterModel>;
}
export interface MetaModel {
  icon: string;
  Title: String;
  showLink: boolean;
  savedPosition: boolean;
  i18n: boolean;
  rank: number;
  keepAlive: boolean;
  authority: Array<string>;
}
export interface Menu {
  id: string;
  title: string;
  enname: string;
  external: number;
  iframe: number;
  cache: number;
  hidden: number;
  i18n: number;
  showParent: number;
  parentId: string;
  path: string;
  component: string;
  icon: string;
  sort: number;
  description: string;
  isEnabled: number;
}

export interface MenuTree extends Menu {
  children: MenuTree[];
}

export interface MenuPermissionTree {
  /**
   * id
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 是否为权限
   */
  isPermission: boolean;
  /**
   * 子集
   */
  children: MenuPermissionTree[];
}
