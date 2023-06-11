<script setup lang="ts">
import type { PropType } from "vue";
import { reactive } from "vue";
import { useRenderIcon } from "../ReIcon/src/hooks";
export type SelectOptions = {
  [key: string]: any[];
};
/**
 * select option label,value,key名称
 */
export interface OptionKey {
  /**
   * select option label 名称
   */
  label: string;
  /**
   * select option value 名称
   */
  value: string;
  /**
   *  select option key 名称
   */
  prop: string;
}
/**
 * form field
 */
export interface FormField {
  /**
   * 字段类型
   */
  type: "input" | "select" | "date";
  /**
   * 表达label
   */
  label: string;
  /**
   * model 的键名
   */
  prop: string;
  /**
   * 默认值
   */
  default?: any;
  /*=========input==============*/
  /**
   * 输入框占位文本
   */
  placeholder?: string;
  /**
   * 设置最大值
   */
  max?: number;
  /**
   * 设置最小值
   */
  min?: number;
  /*==========select==============*/
  /**
   * 指定的dataSource key
   */
  dataSourceKey?: string;
  options?: {
    /**
     * 是否允许清除, 默认true
     */
    clearable?: boolean;
    /**
     * 选项
     */
    keys?: OptionKey;
    /**
     * 如果是select 是否允许清除
     */
    filterable?: boolean;
  };
  /*==========date============*/
  /**
   * 显示类型,string	year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
   */
  dateType?: "year" | "month" | "date" | "dates" | "datetime";
  /**
   * 显示在输入框中的格式
   */
  dateFormat?: string;
  /**
   * 绑定值的格式
   */
  dateValueFormat?: string;
}
const props = defineProps({
  /**
   * 是否显示
   */
  show: {
    required: true,
    type: Boolean,
    default: true
  },
  /**
   *表单尺寸
   */
  size: {
    required: false,
    type: String as PropType<"" | "default" | "small" | "large">,
    default: "default"
  },
  /**
   * 表单字段
   */
  formField: {
    required: true,
    type: Array as PropType<FormField[]>,
    default: function () {
      return [];
    }
  },
  /**
   * 下拉数据源
   */
  dataSource: {
    required: false,
    type: Object as PropType<SelectOptions>,
    default: function () {
      return {};
    }
  },
  /**
   * 表单对齐方式
   */
  position: {
    required: false,
    type: String as PropType<"left" | "right" | "top">,
    default: "right"
  },
  /**
   * 查询权限
   */
  queryPermission: {
    required: false,
    type: Object as PropType<[] | String>,
    default: function () {
      return [];
    }
  }
});
// change 控件change事件,searchForm 实时变更,search btn搜索事件,reset重置事件
const emits = defineEmits(["change", "searchForm", "search", "reset"]);

const pageData: any = reactive({ formData: {} });
/**
 * 获取默认值
 */
const _getDefaultForm = () => {
  const fields: FormField[] = props.formField;
  const obj: any = {};
  fields.forEach((value: FormField) => {
    value[value.prop] = value.default;
  });
  return obj;
};
/**
 * 控件change事件
 * @param item
 */
const _change = (item?: FormField) => {
  _searchForm();
  emits("change", item || {});
};
/**
 * 实时更新
 */
const _searchForm = (data?: any) => {
  const obj = {};
  emits("searchForm", Object.assign(obj, data || pageData.formData));
};
/**
 * 搜索
 */
const _search = () => {
  _searchForm();
  emits("search", pageData.formData);
};
/**
 * 重置
 */
const _searchReset = () => {
  // 日期控件支持默认值
  const _defaultData = _getDefaultForm();
  pageData.formData = _defaultData;
  _searchForm(pageData.formData);
  emits("reset", _defaultData);
};
defineOptions({ name: "FormSearch" });
</script>

<template>
  <el-form
    :inline="true"
    label-width="auto"
    :label-position="props.position"
    :size="props.size"
    v-if="props.show"
  >
    <el-form-item
      :label="item.label"
      v-for="(item, index) in props.formField"
      :key="index"
    >
      <!--input-->
      <template v-if="item.type === 'input'">
        <el-input
          v-model="pageData.formData[item.prop]"
          :placeholder="item.placeholder"
          :maxlength="item.max"
          :min="item.min"
          :clearable="item.options?.clearable || true"
          @change="_change(item)"
        />
      </template>
      <!--select-->
      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="pageData.formData[item.prop]"
          :filterable="item.options ? item.options?.filterable : false"
          :clearable="item.options?.clearable || true"
          :placeholder="item.placeholder"
          style="width: 100%"
          @change="_change(item)"
        >
          <el-option
            v-for="sub in props.dataSource[item.dataSourceKey]"
            :key="
              sub[
                item.options?.keys?.prop === undefined
                  ? 'value'
                  : item.options.keys.prop
              ]
            "
            :value="
              sub[
                item.options?.keys?.value === undefined
                  ? 'value'
                  : item.options.keys.value
              ]
            "
            :label="
              sub[
                item.options?.keys?.label === undefined
                  ? 'value'
                  : item.options.keys.label
              ]
            "
          />
        </el-select>
      </template>
      <!--date-->
      <template v-else-if="item.type === 'date'">
        <el-date-picker
          v-model="pageData.formData[item.prop]"
          :placeholder="item.placeholder"
          :clearable="item.options?.clearable || true"
          :type="item.dateType ? item.dateType : 'date'"
          :format="item.dateFormat ? item.dateFormat : 'YYYY-MM-DD'"
          :value-format="
            item.dateValueFormat ? item.dateValueFormat : 'YYYY-MM-DD'
          "
          @change="_change(item)"
        />
      </template>
    </el-form-item>
    <el-form-item>
      <el-button
        plain
        type="primary"
        :icon="useRenderIcon('ep:search')"
        v-auth="props.queryPermission"
        @click="_search"
        >查询</el-button
      >
      <el-button
        plain
        type=""
        :icon="useRenderIcon('ep:refresh')"
        @click="_searchReset"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
