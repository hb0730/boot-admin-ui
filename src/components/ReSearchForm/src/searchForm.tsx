import { defineComponent, ref } from "vue";
import type { SearchFormItem, SearchFormItems } from "./types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const props = {
  /**
   * 是否展示
   */
  show: {
    type: Boolean,
    default: true
  },
  /**
   * 表单对齐方式
   */
  position: {
    type: String as PropType<"top" | "right" | "left">,
    default: "right"
  },
  /**
   * 表单大小
   */
  size: {
    type: String as PropType<"" | "default" | "small" | "large">,
    default: ""
  },
  /**
   * 查询权限
   */
  permission: {
    required: false,
    type: Object as PropType<string | string[]>,
    default: () => []
  },
  /**
   * 下拉数据源
   */
  dataSource: {
    required: false,
    type: Object as PropType<Record<string, any[]>>,
    default: () => ({})
  },
  /**
   * 表单配置
   */
  formItems: {
    required: true,
    type: Array as PropType<SearchFormItems>
  }
};

/**
 * @description 搜索表单
 */
export default defineComponent({
  name: "SearchForm",
  props,
  emits: ["search", "reset", "searchForm", "change"],
  setup(props, { emit, attrs }) {
    const formDate = ref({});

    const inputItem = (item: SearchFormItem) => {
      if (item.type !== "input") return;
      return (
        <el-input
          v-model={formDate.value[item.options?.prop]}
          placeholder={item.options?.placeholder}
          clearable={item.options?.clearable ?? true}
          maxlength={item.options?.maxlength}
          minlength={item.options?.minlength}
          class="!w-[180px]"
          onChange={_change(item)}
        />
      );
    };
    const selectItem = (item: SearchFormItem) => {
      if (item.type !== "select") return;
      return (
        <el-select
          v-model={formDate.value[item.options?.prop]}
          placeholder={item.options?.placeholder}
          multiple={item.options?.multiple}
          filterable={item.options?.filterable ?? true}
          clearable={item.options?.clearable ?? true}
          class="!w-[180px]"
          style="width: 100%"
        >
          {props.dataSource[item.options?.dataSourceKey]?.map((item: any) => {
            return (
              <el-option
                key={item[item.options?.selectOptionKey.value ?? "value"]}
                label={item[item.options?.selectOptionKey.label ?? "label"]}
                value={item[item.options?.selectOptionKey.value ?? "value"]}
              />
            );
          })}
        </el-select>
      );
    };
    const dateItem = (item: SearchFormItem) => {
      if (item.type !== "date") return;
      return (
        <el-date-picker
          v-model={formDate.value[item.options?.prop]}
          placeholder={item.options?.placeholder}
          clearable={item.options?.clearable ?? true}
          type={item.options?.dateType ?? "date"}
          format={item.options?.format ?? "yyyy-MM-dd"}
          value-format={item.options?.valueFormat ?? "yyyy-MM-dd"}
          style="width: 100%"
        />
      );
    };
    /**
     *  表单默认值
     * @returns
     */
    function getDefaultValue() {
      const fields: SearchFormItem[] = props.formItems;
      const obj: any = {};
      fields.forEach(item => {
        obj[item.options?.prop] = item.options?.defaultValue ?? null;
      });
      // 删除 null的字段
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      obj &&
        Object.keys(obj).forEach(key => obj[key] === null && delete obj[key]);
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      return obj;
    }
    /**
     * 表单项值改变
     *@param item 表单项
     */
    function _change(item?: SearchFormItem) {
      _searchForm();
      emit("change", item);
    }
    /**
     * 表单重置
     */
    function _searchReset() {
      const defaultData = getDefaultValue();
      formDate.value = defaultData;
      _searchForm(defaultData);
      emit("reset");
    }
    /**
     * 值的变化
     *
     * @param data .
     */
    function _searchForm(data?: any) {
      const obj = {};
      Object.assign(obj, data || formDate.value);
      // 删除 undefined,'',null的字段
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      obj &&
        Object.keys(obj).forEach(
          key =>
            (obj[key] === undefined || obj[key] === "" || obj[key] === null) &&
            delete obj[key]
        );
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      emit("searchForm", obj);
    }
    /**
     * 表单查询
     */
    function _search() {
      _searchForm();
      emit("search");
    }

    return () => (
      <>
        <el-form
          {...attrs}
          inline={true}
          label-width="auto"
          label-position={props.position}
          size={props.size}
          v-show={props.show}
          class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
        >
          {props.formItems?.map((item: SearchFormItem) => {
            return (
              <el-form-item
                label={item.label}
                key={item.label}
                v-show={item.hide ?? true}
              >
                {inputItem(item)}
                {selectItem(item)}
                {dateItem(item)}
              </el-form-item>
            );
          })}
          <el-form-item>
            <el-button
              plain
              type="primary"
              icon={useRenderIcon("ri:search-line")}
              v-auth={props.permission}
              onClick={_search}
            >
              查询
            </el-button>
            <el-button
              plain
              type=""
              icon={useRenderIcon("ri:refresh-line")}
              onClick={_searchReset}
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </>
    );
  }
});
