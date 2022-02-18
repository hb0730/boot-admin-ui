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
