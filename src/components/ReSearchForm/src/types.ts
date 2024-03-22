export interface SearchFormSelectOption {
  /**
   * 选项标签
   */
  label: string;
  /**
   * 选项值
   */
  value: string | number;
  /**
   * 选项 key
   */
  prop: string;
}
export interface SearchFormItemOptions {
  /**
   * 是否隐藏
   */
  hide?: boolean;
  /**
   * 表单项字段
   */
  prop?: string;
  /**
   * 默认值
   */
  defaultValue?: string | number;
  /**
   * 输入框占位文本
   */
  placeholder?: string;
  /**
   * 是否可清空
   */
  clearable?: boolean;
  /**
   * 最大长度
   */
  maxlength?: number;
  /**
   * 最小长度
   */
  minlength?: number;
  /**
   * 是否多选
   */
  multiple?: boolean;
  /**
   * 是否可搜索
   */
  filterable?: boolean;
  /**
   * select 数据源
   */
  dataSourceKey?: string;
  /**
   * select option key
   */
  selectOptionKey?: SearchFormSelectOption;

  /**
   * 显示类型, 默认 date
   */
  dateType?: "year" | "month" | "date" | "dates" | "datetime";
  /**
   * 显示格式 默认 yyyy-MM-DD
   */
  format?: string;
  /**
   * 值格式 默认 yyyy-MM-DD
   */
  valueFormat?: string;
}
export interface SearchFormItem {
  /**
   * 表单项标签
   */
  label: string;
  /**
   * 表单项类型
   */
  type: "input" | "select" | "date";
  /**
   * 可选项
   */
  options?: SearchFormItemOptions;
  /**
   * 是否隐藏
   */
  hide?: boolean;
}

export interface SearchFormItems extends Array<SearchFormItem> {}
