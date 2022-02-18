<script setup lang="ts">
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];
</script>

<template>
  <div class="app-container">
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button type="success" size="small" :icon="useRenderIcon('plus')"
            >新增</el-button
          >
          <el-button type="primary" size="small" :icon="useRenderIcon('edit')"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            :icon="useRenderIcon('FA-trash-alt')"
            >修改</el-button
          >
        </div>
        <div class="avue-crud__right">
          <el-button
            size="small"
            title="刷新"
            circle
            :icon="useRenderIcon('FA-sync')"
          ></el-button>
        </div>
      </div>
      <el-col>
        <el-table
          :data="tableData"
          ref="permissionTableRef"
          check-strictly
          :highlight-current="true"
          default-expand-all
          style="width: 100%"
          border
          :fit="true"
        >
          <el-table-column
            type="selection"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="permission"
            label="标识"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
