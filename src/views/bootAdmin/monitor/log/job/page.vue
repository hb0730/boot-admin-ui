<template>
  <d2-container class="page">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchInfo.jobName" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="searchInfo.group" placeholder="任务分组"></el-input> -->
        <el-select v-model="searchInfo.jobGroup" placeholder="任务分组" clearable>
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.status" placeholder="执行状态" clearable>
          <el-option
            v-for="item in isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchInfo.time"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="handleCurrentChange(1)" size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button type="button" class="el-button filter-item el-button--danger el-button--mini">
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button type="button" class="el-button filter-item el-button--danger el-button--mini">
            <i class="fa fa-trash"></i>
            <span>清空</span>
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
            @click="getPage"
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
            type="selection"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="jobName"
            label="任务名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="jobGroup"
            label="任务分组"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">{{getDictEntryInfo('sys_job_group',scope.row.jobGroup).label}}</template>
          </el-table-column>
          <el-table-column
            prop="invokeTarget"
            label="调用目标"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="jobMessage"
            label="日志信息"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
           <el-table-column
            prop="createTime"
            label="开始时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="任务状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status==1?'success':'danger'"
                disable-transitions
              >{{scope.row.status==1?"成功":"失败"}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="错误日志"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-button @click="handleViewError(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchInfo.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchInfo.total"
        ></el-pagination>
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
      // 检索条件
      searchInfo: {
        jobName: "",
        jobGroup: "",
        status: "",
        time: [],
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      groupOptions: [],
      isEnabledOptions: [
        { label: "成功", value: 1 },
        { label: "失败", value: 0 },
      ],
      dataList: [],
    };
  },
  mounted() {
    let _self = this;
    _self.getPage();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/jobLog", ["jobLogPage"]),
    /**
     * 数据字典
     */
    initDict() {
      let _self = this;
      _self.groupOptions = util.dict.getDictValue("sys_job_group");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    handleSizeChange(size) {
      let _self = this;
      _self.searchInfo.pageSize = size;
      _self.getPage();
    },
    handleCurrentChange(num) {
      let _self = this;
      _self.searchInfo.pageNum = num;
      _self.getPage();
    },
    /**
     * 分页查询
     */
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      if(_self.searchInfo.time){
        params.startTime=_self.searchInfo.time[0];
        params.endTime=_self.searchInfo.time[1];
      }
      _self.jobLogPage({ data: params }).then((result) => {
        _self.dataList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    // 查看错误信息
    handleViewError(row) {
      this.$msgbox({
        title: "异常信息",
        message: row.exceptionInfo,
        dangerouslyUseHTMLString: false,
        showConfirmButton: false,
        customClass: "mod-sys__log-error-view-info",
      }).catch((error) => {});
    },
  },
};
</script>