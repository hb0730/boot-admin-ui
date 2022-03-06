import { BaseClass, BaseQuery } from "../domain";

export interface DictQuery extends BaseQuery {
  name?: string;
  type?: string;
}
export interface Dict extends BaseClass {
  id: string;
  /**
   * 备注
   */
  description: string;

  /**
   * 字典名称
   */
  name: string;

  /**
   * 字典类型
   */
  type: string;
}

export interface DictEntryQuery extends BaseQuery {
  parentId?: string;
}
export interface DictEntry extends BaseClass {
  id: string;
  parentId: string;
  /**
   * 备注
   */
  description: string;
  /**
   * 名称
   */
  name: string;

  /**
   * 字典值
   */
  value: string;

  /**
   * 排序
   */
  sort: number;
}

export interface DictCache {
  type: string;
  entry: DictEntryCache[];
}

export interface DictEntryCache {
  label: string;
  value: string;
}
