<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps({
  list: {
    type: Array,
    default: function () {
      return [];
    }
  },
  pageSizes: {
    type: Array,
    default: function () {
      return [10, 20, 50, 100];
    }
  },
  currentPage: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageTotal: {
    type: Number,
    default: 0
  }
});
const dataList = toRef(props, "list");
const pageSizes = toRef(props, "pageSizes");
const pageSize = toRef(props, "pageSize");
const currentPage = toRef(props, "currentPage");
const pageTotal = toRef(props, "pageTotal");

const emit = defineEmits<{
  (e: "selectionChange", v: Object);
  (e: "sizeChange", v: Object);
  (e: "currentChange", v: Object);
}>();

const handleSelectionChange = selection => {
  emit("selectionChange", selection);
};
const handleSizeChange = (pageSize: number) => {
  emit("sizeChange", pageSize);
};
const handleCurrentChange = (pageNum: number) => {
  emit("currentChange", pageNum);
};
</script>

<template>
  <el-row :gutter="2">
    <el-col :xs="10">
      <el-table
        :data="dataList"
        style="width: 100%"
        ref="userOnlineRef"
        size="large"
        border
        :fit="true"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
      >
        <slot name="tableColumn" />
      </el-table>
      <el-pagination
        align="left"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      />
    </el-col>
  </el-row>
</template>

<style scoped></style>
