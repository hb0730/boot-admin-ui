<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-select v-model="searchInfo.operType" placeholder="操作类型" clearable>
          <el-option
            v-for="item in businessType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.username" placeholder="操作用户" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.description" placeholder="描述" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.status" placeholder="状态" clearable>
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchInfo.time"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
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
            @click="handleRemove"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button type="button" @click="handleClean" class="el-button filter-item el-button--danger el-button--mini">
            <i class="fa fa-trash"></i>
            <span>清除</span>
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
          ref="operLog"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求地址">
                  <span>{{ props.row.requestUrl }}</span>
                </el-form-item>
                <el-form-item label="请求方式">
                  <span>{{ props.row.requestMethod }}</span>
                </el-form-item>
                <el-form-item label="操作方法">
                  <span>{{ props.row.operMethod }}</span>
                </el-form-item>
                <el-form-item label="请求参数">
                  <span>{{props.row.requestParams}}</span>
                </el-form-item>
                <el-form-item label="响应参数">
                  <span>{{props.row.requestResult}}</span>
                </el-form-item>
                <el-form-item label="错误信息">
                  <span>{{ props.row.errorMessage }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="操作人员"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="operIp"
            label="操作ip"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="businessType"
            label="操作类型"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">{{getDictEntryInfo('sys_oper_type',scope.row.operType).label}}</template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="操作状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success':'danger'"
                disable-transitions
              >{{scope.row.status==1?"成功":"失败"}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="操作时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
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
import util from "@/libs/util.js";
import { mapActions } from "vuex";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      position: "left",
      searchInfo: {
        username: "",
        operType: "",
        description: "",
        status: "",
        startTime: "",
        endTime: "",
        time: [],
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      // 操作类型
      businessType: [],
      status: [
        { label: "成功", value: 1 },
        { label: "失败", value: 0 },
      ],
      //列表
      dataList: [],
    };
  },
  mounted() {
    let _self = this;
    _self.initDict();
    _self.getPage();
  },
  methods: {
    ...mapActions("bootAdmin/operLog", [
      "operLogListPage",
      "operLogDelete",
      "operLogClean",
    ]),
    /**
     * 初始化数据字典
     */
    initDict() {
      let _self = this;
      _self.businessType = util.dict.getDictValue("sys_oper_type");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      if (_self.searchInfo.time) {
        params.startTime = _self.searchInfo.time[0];
        params.endTime = _self.searchInfo.time[0];
      }
      _self.operLogListPage({ data: params }).then((result) => {
        _self.dataList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
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
     * 删除
     */
    handleRemove() {
      let _self = this;
      const lists = _self.$refs.operLog.selection;
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
        _self.operLogDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.getPage();
        });
      }
    },
    /**
     * 清空
     */
    handleClean() {
      let _self = this;
      MessageBox.confirm("是否删除选中数据", "删除", {
        type: "warning",
      }).then(() => {
        _self.clean();
      });
    },
    clean() {
      let _self = this;
      _self.operLogClean().then((result) => {
        _self.$message.success("清除成功");
        _self.getPage();
      });
    },
  },
};
</script>