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
        <el-time-picker
          is-range
          v-model="searchInfo.time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button type="button" class="el-button filter-item el-button--danger  el-button--mini">
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
           <button type="button" class="el-button filter-item el-button--danger el-button--mini">
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
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="loginInfoList"
          style="width: 100%;"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="id"
            label="登录编号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="登录账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ipaddr"
            label="登录ip"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginLocation"
            label="登录地址"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="browser"
            label="浏览器"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="os"
            label="操作系统"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="登录状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success':'danger'"
                disable-transitions
              >{{getMapValue("login_status",scope.row.status)[0].label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="登录信息"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="登录时间"
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
          :current-page="pages.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import { loginInfoAllPagePath } from "@/api/baseUrl";
import util from "@/libs/util";
export default {
  data() {
    return {
      position: "left",
      loginInfoList: [],
      searchInfo: {},
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      mapInfo: new Map(),
      status: []
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
    _self.getPageAll();
  },
  methods: {
    ...mapActions("bootAdmin/loginInfo", ["loginInfoAllPage"]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPageAll();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      this.getPageAll();
    },
    /**
     * 获取列表
     */
    getPageAll() {
      let _self = this;
      let url =
        loginInfoAllPagePath +
        "/" +
        _self.pages.page +
        "/" +
        _self.pages.pageSize;
      let info = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.loginInfoAllPage({ url: url, data: info }).then(result => {
        _self.loginInfoList = result.list;
        _self.pages.total = Number(result.total);
      });
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.getMapType("login_status");
      });
    },
    /**获取map值 */
    getMapValue(type, value) {
      let _self = this;
      return util.dicts.getMapValue(_self.mapInfo, type, value);
    },
    getMapType(type) {
      let _self = this;
      _self.status = util.dicts.getMapType(_self.mapInfo, type);
    }
  }
};
</script>
<style >
.el-table th {
  word-break: break-word;
  color: rgba(0, 0, 0, 0.85);
  background-color: #fafafa;
}
.avue-crud__menu {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  position: relative;
  width: 100%;
  min-height: 40px;
  height: auto;
  overflow: hidden;
  margin-bottom: 5px;
}
</style>