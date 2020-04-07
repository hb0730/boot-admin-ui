<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.username" placeholder="登录账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.ipaddr" placeholder="登录ip" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            @click="handleAddNew"
            type="button"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <!-- <button type="button" class="el-button filter-item el-button--danger el-button--mini">
            <i class="fa fa-sign-out"></i>
            <span>强退</span>
          </button>-->
        </div>
        <div class="avue-crud__right">
          <button
            type="button"
            class="el-button el-tooltip el-button--default el-button--small is-circle"
            aria-describedby="el-tooltip-2497"
            tabindex="0"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="jobList"
          style="width: 100%;"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="number"
            label="编码"
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
            prop="beanName"
            label="调用类"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="methodName"
            label="调用方法"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="params"
            label="所需参数"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cron"
            label="表达式"
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
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled==1?'success':'danger'"
                disable-transitions
              >{{getMapValue('system_enabled',scope.row.isEnabled)[0].label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="bottom" effect="light">
                <el-button
                  type="text"
                  @click="handleUpdate(scope.row)"
                  icon="fa fa-pencil"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button
                  type="text"
                  icon="fa fa-remove"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="调度日志" placement="bottom" effect="light">
                <el-button
                  type="text"
                  icon="fa fa-list"
                  size="mini" 
                  @click="handleLogList(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="任务信息"
      :before-close="handleDataDialogClose"
      :visible.sync="dialogDataTableVisible"
    >
      <el-form
        label-width="auto"
        :model="jobInfo"
        :label-position="position"
        ref="jobRef"
        required-asterisk
        :rules="jobRules"
        center
      >
        <el-form-item required label="编码" prop="number">
          <el-input v-model="jobInfo.number" clearable></el-input>
        </el-form-item>
        <el-form-item required label="名称" prop="name">
          <el-input v-model="jobInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="调用类" prop="beanName">
          <el-input v-model="jobInfo.beanName" clearable></el-input>
        </el-form-item>
        <el-form-item required label="调用方法" prop="methodName">
          <el-input v-model="jobInfo.methodName" clearable></el-input>
        </el-form-item>
        <el-form-item label="所需参数">
          <el-input v-model="jobInfo.params" clearable></el-input>
        </el-form-item>
        <el-form-item required label="表达式" prop="cron">
          <el-input v-model="jobInfo.cron" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="jobInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-radio-group v-model="jobInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleSave" size="medium" type="primary" plain>保存</el-button>
        <el-button @click="handleDataDialogClose" size="medium" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import router from '@/router'
import { mapActions } from "vuex";
import { jobAllPagePath, jobSavePath, jobUpdatePath } from "@/api/baseUrl";
import util from "@/libs/util";
export default {
  data() {
    return {
      jobList: [],
      searchInfo: {},
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      jobInfo: {},

      position: "left",
      isUpdate: false,
      isView: false,
      dialogDataTableVisible: false,
      mapInfo: {},
      isEnabledOptions: [],
      jobRules: {
        number: [{ required: true, message: "请输入编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        beanName: [
          { required: true, message: "请输入调用类", trigger: "blur" }
        ],
        methodName: [
          { required: true, message: "请输入调用方法", trigger: "blur" }
        ],
        cron: [{ required: true, message: "请输入表达式", trigger: "blur" }]
      }
    };
  },
  mounted() {
    let _self = this;
    _self.getPage();
    _self.getMap();
  },
  methods: {
    ...mapActions("bootAdmin/job", ["jobAllPage", "jobSave", "jobUpdate"]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    getPage() {
      let _self = this;
      let url =
        jobAllPagePath + "/" + _self.pages.page + "/" + _self.pages.pageSize;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.jobAllPage({ url: url, data: params }).then(result => {
        _self.jobList = result.list;
        _self.pages.total = Number(result.total);
      });
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      this.getPage();
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.isEnabledOptions = _self.getMapType("system_enabled");
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
    handleDataDialogClose() {
      let _self = this;
      _self.searchInfo = {};
      _self.getPage();
      _self.dialogDataTableVisible = false;
    },
    initJob() {
      let _self = this;
      _self.jobInfo = {
        id: "",
        isEnabled: 1
      };
    },
    /**
     * 新增
     */
    handleAddNew() {
      let _self = this;
      _self.isUpdate = false;
      _self.isView = false;
      _self.initJob();
      _self.dialogDataTableVisible = true;
    },
    /**
     * 保存
     */
    handleSave() {
      let _self = this;
      _self.$refs.jobRef.validate(valid => {
        if (valid) {
          if (_self.isUpdate) {
            _self.update();
          } else {
            _self.save();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    save() {
      let _self = this;
      let url = jobSavePath;
      let params = JSON.parse(JSON.stringify(_self.jobInfo));
      _self.jobSave({ url: url, data: params }).then(result => {
        _self.handleDataDialogClose();
      });
    },
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.jobInfo));
      let url = jobUpdatePath + "/" + params.id;
      _self.jobUpdate({ url: url, data: params }).then(result => {
        _self.handleDataDialogClose();
      });
    },
    /**
     * 修改
     */
    handleUpdate(row) {
      let _self = this;
      _self.jobInfo = row;
      _self.isUpdate = true;
      _self.isView = false;
      _self.dialogDataTableVisible = true;
    },
    handleLogList(row){
      let _self=this 
      let jobInfo=JSON.parse(JSON.stringify(row))
      router.push({
        path:'/bootAdmin/systemMonitor/jobLog',
        query:{
          d:encodeURIComponent(jobInfo.id)
        }
      })

    }
  }
};
</script>
<style >
</style>