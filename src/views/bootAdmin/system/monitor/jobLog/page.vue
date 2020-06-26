<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.jobId" placeholder="任务id" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.jobName" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.status" clearable placeholder="请选择">
          <el-option
            v-for="item in jobStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSeach" plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            @click="handleDelete"
            type="button"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button
            @click="handleClean"
            type="button"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-trash"></i>
            <span>清空</span>
          </button>
          <button
            @click="handleExport"
            type="button"
            class="el-button filter-item el-button--warning el-button--mini"
          >
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
          :data="jobLogList"
          style="width: 100%;"
          ref="jobLogRef"
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
            prop="jobId"
            label="任务id"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="stopTime"
            label="结束时间"
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
            prop="status"
            label="状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled==1?'success':'danger'"
                disable-transitions
              >{{getMapValue('system_job_status',scope.row.isEnabled)[0].label}}</el-tag>
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
import router from "@/router";
import { mapActions } from "vuex";
import util from "@/libs/util";
import {
  jobLogAllPagePath,
  jobLogDeletePath,
  jobLogCleanPath,
  jobLogExportPath
} from "@/api/baseUrl";
import { MessageBox } from "element-ui";
import { bootAdminExport } from '@/api/export';
import { jobLogServer } from '@/api/baseServer';
export default {
  data() {
    return {
      jobLogList: [],
      searchInfo: {
        jobId: "",
        jobName:"",
        status:"",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      position: "left",
      isUpdate: false,
      isView: false,
      mapInfo: {},
      jobStatusOptions: []
    };
  },
  created: function() {
    this.getParams();
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  mounted() {
    let _self = this;
    _self.getMap();
  },
  methods: {
    ...mapActions("d2admin/dict", ["getDictMap"]),
    ...mapActions("bootAdmin/jobLog", [
      "jobLogAllPage",
      "jobLogDelete",
      "jobLogClean"
    ]),
    getParams() {
      // 取到路由带过来的参数
      var routerParams = decodeURIComponent(this.$route.query.d);
      this.searchInfo.jobId = routerParams;
      this.getPage();
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      this.searchInfo.pageNum = val;
      this.getPage();
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.jobStatusOptions = _self.getMapType("system_job_status");
      });
    },
    /**获取map值 */
    getMapValue(type, value) {
      let _self = this;
      return util.dicts.getMapValue(_self.mapInfo, type, value);
    },
    getMapType(type) {
      let _self = this;
      return util.dicts.getMapType(_self.mapInfo, type);
    },
    getPage() {
      let _self = this;
      let url =
        jobLogAllPagePath;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.jobLogAllPage({ url: url, data: params }).then(result => {
        _self.jobLogList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    handleViewError(row) {
      this.$msgbox({
        title: "异常信息",
        message: row.exceptionInfo,
        dangerouslyUseHTMLString: false,
        showConfirmButton: false,
        customClass: "mod-sys__log-error-view-info"
      }).catch(error => {});
    },
    handleSeach() {
      let _self = this;
      _self.getPage();
    },
    /**
     * 删除
     */
    handleDelete() {
      let _self = this;
      const lists = _self.$refs.jobLogRef.selection;
      if (lists.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning"
        });
        return;
      }
      const array = [];
      lists.forEach(element => {
        array.push(element.id);
      });
      MessageBox.confirm("是否删除选中数据", "删除", {
        type: "warning"
      }).then(() => {
        _self.delete(array);
      });
    },
    delete(ids) {
      if (ids.length > 0) {
        let _self = this;
        let url = jobLogDeletePath;
        let params = JSON.parse(JSON.stringify(ids));
        _self.jobLogDelete({ url: url, data: params }).then(result => {
          _self.getPage();
        });
      }
    },
    handleClean() {
      let _self = this;
      MessageBox.confirm("是否清空当前任务日志", "删除", {
        type: "warning"
      }).then(() => {
        _self.clean();
      });
    },
    clean() {
      let _self = this;
      let id = _self.searchInfo.jobId;
      if (id) {
        let url = jobLogCleanPath + "/" + id;
        _self.jobLogClean({ url: url, data: null }).then(result => {
          _self.getPage();
        });
      }
    },
    /**
     * 导出
     */
    handleExport() {
      let _self =this
      let params= JSON.parse(JSON.stringify(_self.searchInfo));
      let url = jobLogServer+jobLogExportPath
      bootAdminExport('post',url,params)
    }
  }
};
</script>
<style >
</style>