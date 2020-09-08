<template>
  <d2-container class="page">
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="searchInfo.group" placeholder="任务分组"></el-input> -->
        <el-select v-model="searchInfo.group" placeholder="任务分组" clearable>
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
        <el-button plain size="medium" @click="handleCurrentChange(1)" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            @click="handlerAddNew"
            class="el-button filter-item el-button--success el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button
            type="button"
            @click="handlerEdit"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button
            type="button"
            @click="handlerRemove"
            class="el-button filter-item el-button--danger el-button--mini"
          >
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
          <button type="button" @click="handlerLog" class="el-button filter-item el-button--info el-button--mini">
            <i class="el-icon-tickets"></i>
            <span>日志</span>
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
          >
            <template scope="scope">{{getDictEntryInfo('sys_job_group',scope.row.group).label}}</template>
          </el-table-column>
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
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled==1?'success':'danger'"
                disable-transitions
              >{{getDictEntryInfo('sys_common_status',scope.row.isEnabled).label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                title="修改"
                @click="handlerUpdate(scope.row)"
                type="text"
                icon="fa fa-pencil"
                size="mini"
              ></el-button>
              <el-button
                title="立即执行"
                @click="handlerExec(scope.row)"
                type="text"
                icon="fa fa-play-circle-o"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                @click="handlerDelete(scope.row)"
                type="text"
                icon="fa fa-remove"
                size="mini"
              ></el-button>
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
    <el-dialog
      title="任务信息"
      :before-close="handleDataDialogClose"
      :visible.sync="dialogDataTableVisible"
      :destroy-on-close="!dialogDataTableVisible"
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
        <el-row>
          <el-col :span="12">
            <el-form-item required label="名称" prop="name">
              <el-input v-model="jobInfo.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="任务分组" prop="group">
              <el-select style="width:100%" v-model="jobInfo.group" placeholder="任务分组" clearable>
                <el-option
                  v-for="item in groupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="调用类" prop="beanName">
              <el-input v-model="jobInfo.beanName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="调用方法" prop="beanMethod">
              <el-input v-model="jobInfo.beanMethod" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="表达式" prop="cron">
              <el-input v-model="jobInfo.cron" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="personInCharge">
              <el-input v-model="jobInfo.personInCharge" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="警告邮箱" prop="email">
              <el-input v-model="jobInfo.email" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="isEnabled">
              <el-radio-group v-model="jobInfo.isEnabled">
                <el-radio
                  v-for="item in isEnabledOptions "
                  :key="Number(item.value)"
                  :label="Number(item.value)"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务描述" prop="description">
          <el-input type="textarea" v-model="jobInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数内容" prop="methodParams">
          <el-input type="textarea" v-model="jobInfo.methodParams" placeholder="参数内容" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handlerSave" type="primary">保存</el-button>
        <el-button @click="handleDataDialogClose" size="medium">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util.js";
import { MessageBox } from "element-ui";
import router from "@/router";

export default {
  data() {
    return {
      position: "left",
      // 检索info
      searchInfo: {
        name: "",
        group: "",
        isEnabled: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      isEnabledOptions: [],
      groupOptions: [],
      dataList: [],
      isUpdate: false,
      dialogDataTableVisible: false,
      // job info
      jobInfo: {
        id: "",
        name: "",
        group: "",
        beanName: "",
        beanMethod: "",
        methodParams: "",
        cron: "",
        personInCharge: "",
        email: "",
        isEnabled: 0,
        description: "",
      },
      jobRules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        group: [{ required: true, message: "请选择任务组", trigger: "change" }],
        beanName: [
          { required: true, message: "请输入调用类", trigger: "blur" },
        ],
        beanMethod: [
          { required: true, message: "请输入调用方法", trigger: "blur" },
        ],
        cron: [{ required: true, message: "请输入表达式", trigger: "blur" }],
      },
    };
  },
  mounted() {
    let _self = this;
    _self.initDict();
    _self.getPage();
  },
  methods: {
    ...mapActions("bootAdmin/job", [
      "jobListPage",
      "jobList",
      "jobSave",
      "jobUpdate",
      "jobDelete",
      "jobExec",
    ]),
    /**
     * 数据字典
     */
    initDict() {
      let _self = this;
      _self.groupOptions = util.dict.getDictValue("sys_job_group");
      _self.isEnabledOptions = util.dict.getDictValue("sys_common_status");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    handleSizeChange(pageSize) {
      let _self = this;
      _self.searchInfo.pageSize = pageSize;
      _self.getPage();
    },
    handleCurrentChange(pageNum) {
      let _self = this;
      _self.searchInfo.pageNum = pageNum;
      _self.getPage();
    },
    /**
     * 获取列表
     */
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.jobListPage({ data: params }).then((result) => {
        _self.dataList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    /**
     * 初始化info
     */
    initInfo() {
      let _self = this;
      _self.jobInfo = {
        id: "",
        name: "",
        group: "",
        beanName: "",
        beanMethod: "",
        methodParams: "",
        cron: "",
        personInCharge: "",
        email: "",
        isEnabled: 0,
        description: "",
      };
    },
    handleDataDialogClose() {
      let _self = this;
      _self.dialogDataTableVisible = false;
      _self.initInfo();
      _self.getPage();
    },
    /**
     * 新增
     */
    handlerAddNew() {
      let _self = this;
      _self.initInfo();
      _self.isUpdate = false;
      _self.dialogDataTableVisible = true;
    },
    /**
     * 保存
     */
    handlerSave() {
      let _self = this;
      _self.$refs.jobRef.validate((valid) => {
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
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.jobInfo));
      let id = _self.jobInfo.id;
      _self.jobUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDataDialogClose();
      });
    },
    save() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.jobInfo));
      _self.jobSave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDataDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerUpdate(row) {
      let _self = this;
      _self.initInfo();
      _self.isUpdate = true;
      _self.jobInfo = JSON.parse(JSON.stringify(row));
      _self.dialogDataTableVisible = true;
    },
    /**
     * 修改
     */
    handlerEdit() {
      let _self = this;
      const lists = _self.$refs.userListRef.selection;
      if (lists.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else if (lists.length >= 2) {
        _self.$message({
          message: "请选择(有且只有一个)",
          type: "warning",
        });
      } else {
        _self.initInfo();
        _self.jobInfo = JSON.parse(JSON.stringify(lists[0]));
        _self.isUpdate = true;
        _self.dialogDataTableVisible = true;
      }
    },

    /**
     * 刪除
     */
    handlerDelete(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除选中数据", "删除", {
        type: "warning",
      }).then(() => {
        const array = [];
        array.push(row.id);
        _self.delete(array);
      });
    },
    /**
     * 刪除
     */
    handlerRemove() {
      let _self = this;
      const lists = _self.$refs.userListRef.selection;
      if (lists.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else {
        const array = [];
        lists.forEach((element) => {
          array.push(element.id);
        });
        MessageBox.confirm("是否删除选中数据", "删除", {
          type: "warning",
        }).then(() => {
          _self.delete(array);
        });
      }
    },
    delete(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.jobDelete({ data: params }).then((result) => {
          _self.$message.success("刪除成功");
          _self.handleDataDialogClose();
        });
      }
    },
    /**
     * 立即执行
     */
    handlerExec(row) {
      let _self = this;
      MessageBox.confirm("是否执行", "执行", { type: "warning" }).then(() => {
        _self.jobExec({ id: row.id }).then((result) => {
          _self.$message.success("执行成功");
        });
      });
    },
    /**
     * 日志
     */
    handlerLog(){
      let _self=this;
      router.push({
        name: "job-log",
      });
    }
  },
};
</script>