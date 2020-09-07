<template>
  <d2-container class="page">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="searchInfo.group" placeholder="任务分组"></el-input> -->
        <el-select v-model="searchInfo.group" placeholder="状态" clearable>
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.isEnabled" placeholder="状态" clearable>
          <el-option
            v-for="item in isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button type="button" class="el-button filter-item el-button--success el-button--mini">
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button type="button" class="el-button filter-item el-button--primary el-button--mini">
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button type="button" class="el-button filter-item el-button--danger el-button--mini">
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button
            class="el-button filter-item el-button--info el-button--mini"
            style="padding:0 0 0 0px"
          >
            <el-upload
              ref="upload"
              action
              :limit="1"
              :show-file-list="false"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <button class="el-button filter-item el-button--info el-button--mini">
                <i class="fa fa-upload"></i>
                <span>导入</span>
              </button>
            </el-upload>
          </button>
          <button type="button" class="el-button filter-item el-button--warning el-button--mini">
            <i class="fa fa-download"></i>
            <span>导出</span>
          </button>
        </div>
        <div class="avue-crud__right">
          <button
            type="button"
            class="el-button el-tooltip el-button--default el-button--small is-circle"
            aria-describedby="el-tooltip-2497"
            tabindex="0"
            title="刷新"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="dataList"
          style="width: 100%;"
          ref="userListRef"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="任务编号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="group"
            label="任务分组"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="beanName"
            label="调用类"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cron"
            label="执行表达式"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="isEnabled"
            label="状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util.js";

export default {
  data() {
    return {
      // 检索info
      searchInfo: {
        name: "",
        group: "",
        status: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      isEnabledOptions: [],
      groupOptions: [],
      dataList: [],
    };
  },
  mounted() {
    let _self = this;
    _self.initDict();
  },
  methods: {
    initDict() {
      let _self = this;
      _self.groupOptions = util.dict.getDictValue("sys_job_group");
      _self.isEnabledOptions=util.dict.getDictValue("sys_common_status");
    },
  },
};
</script>