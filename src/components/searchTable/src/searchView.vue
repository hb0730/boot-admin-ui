<script setup lang="ts">
import { reactive, toRef } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
const props = defineProps({
  // 筛选项配置
  searchFormConfig: {
    require: false,
    type: Array,
    default: function () {
      return [];
    }
  },
  // 搜索表单中，下拉数据来源dataList. [ { code, name } ]
  dataSource: {
    require: false,
    type: Object,
    default: function () {
      return [];
    }
  },
  // input 输入框最大长度
  max: {
    type: Number,
    default: 50
  },
  // 查询权限
  isSearchAuth: {
    type: Boolean,
    default: true
  }
});
const formField = toRef(props, "searchFormConfig");
const isSearchAuth = toRef(props, "isSearchAuth");
const pageData = reactive({
  searchForm: {}
});

const emit = defineEmits<{
  (e: "searchChange", v: Object);
  (e: "getSearchForm", v: Object);
  (e: "searchRun", val: Object);
  (e: "searchReset", v: Object);
}>();

const _searchChange = function (item) {
  _getSearchForm();
  emit("searchChange", item || {});
};
const _getSearchForm = function (data?) {
  const obj = _setDefaultForm();
  emit("getSearchForm", Object.assign(obj, data || pageData.searchForm));
};
const _setDefaultForm = function () {
  const obj = {};
  // const list = formField.value;
  return obj;
};
const _search = function () {
  _getSearchForm();
  emit("searchRun", pageData.searchForm);
};
const _searchReset = function () {
  // 日期控件支持默认值
  const obj = _setDefaultForm();
  pageData.searchForm = obj;
  _getSearchForm(obj);
  emit("searchReset", obj);
};
</script>

<template>
  <!---->
  <el-form
    ref="searchForm"
    :inline="true"
    label-width="auto"
    label-position="right"
  >
    <el-row :gutter="24">
      <!--eslint-disable-next-line-->
      <template v-for="(item, i) in formField">
        <!--eslint-disable-next-line-->
        <el-col :xl="item.xl || 6" :lg="8" :md="8" :sm="12" :xs="24">
          <template v-if="item.type === 'input'">
            <el-form-item :label="item.name">
              <el-input
                v-model="pageData.searchForm[item.key]"
                :placeholder="item.tips"
                :max-length="item.max || max"
                clearable
                @change="_searchChange(item)"
              />
            </el-form-item>
          </template>
          <template v-if="item.type === 'select'">
            <el-form-item :label="item.name">
              <!----->
              <el-select
                v-model="pageData.searchForm[item.key]"
                :filterable="item.options ? item.options.showSearch : false"
                clearable
                :placeholder="item.tips"
                style="width: 100%"
                @change="_searchChange(item)"
              >
                <el-option
                  v-for="sub in dataSource[item.dataList]"
                  :key="sub.value"
                  :value="sub.value"
                  :label="sub.label"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-if="item.type === 'daterange'">
            <el-form-item :label="item.name">
              <el-date-picker
                style="width: 50%"
                v-model="pageData.searchForm[item.key]"
                type="daterange"
                unlink-panels
                :start-placeholder="item.startPlaceholder"
                :end-placeholder="item.endPlaceholder"
                :format="item.format"
                :value-format="item.valueFormat"
              />
            </el-form-item>
          </template>
        </el-col>
      </template>
      <el-col v-show="isSearchAuth" :md="8" :sm="12" :xs="24">
        <span style="overflow: hidden" class="table-page-search-submitButtons">
          <el-button
            plain
            type="primary"
            :icon="useRenderIcon('iconify-fa-search')"
            @click="_search"
            >查询</el-button
          >
          <el-button
            plain
            type="primary"
            :icon="useRenderIcon('iconify-refreshLine')"
            @click="_searchReset"
            >重置</el-button
          >
        </span>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped>
:deep(.table-page-search-submitButtons) {
  display: flex;
}
</style>
