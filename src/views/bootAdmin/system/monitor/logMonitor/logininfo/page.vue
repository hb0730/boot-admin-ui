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
        <el-date-picker v-model="searchInfo.startTime" type="date" placeholder="登录开始"></el-date-picker>-
        <el-date-picker v-model="searchInfo.endTime" type="date" placeholder="登录结束"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" plain size="medium" icon="fa fa-search">查询</el-button>
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
            <span>清除</span>
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
            @click="getPageAll"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="loginInfoList"
          style="width: 100%;"
          ref="loginInfoRef"
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
              >{{getMapValue("system_status",scope.row.status)[0].label}}</el-tag>
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
import {
  loginInfoAllPagePath,
  loginInfoDeletePath,
  loginInfoCleanPath,
  loginInfoExportPath
} from "@/api/baseUrl";
import util from "@/libs/util";
import { MessageBox } from "element-ui";
import { loginInfoServer } from "@/api/baseServer";
import { bootAdminExport } from "@/api/export";
export default {
  data() {
    return {
      position: "left",
      loginInfoList: [],
      searchInfo: {
        username: "",
        ipaddr: "",
        status: "",
        startTime: "",
        endTime: "",
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
    ...mapActions("bootAdmin/loginInfo", [
      "loginInfoAllPage",
      "loginInfoDelete",
      "loginInfoClean"
    ]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    handleSizeChange(val) {
      this.searchInfo.pageSize = val;
      this.getPageAll();
    },
    handleCurrentChange(val) {
      this.searchInfo.pageNum = val;
      this.getPageAll();
    },
    /**
     * 获取列表
     */
    getPageAll() {
      let _self = this;
      let url = loginInfoAllPagePath;
      let info = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.loginInfoAllPage({ url: url, data: info }).then(result => {
        _self.loginInfoList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.getMapType("system_status");
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
    },
    handleSearch() {
      let _self = this;
      _self.getPageAll();
    },
    /**
     * 删除
     */
    handleDelete() {
      let _self = this;
      const lists = _self.$refs.loginInfoRef.selection;
      if (lists.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning"
        });
      } else {
        const array = [];
        lists.forEach(element => {
          array.push(element.id);
        });
        MessageBox.confirm("是否删除选中数据", "删除", {
          type: "warning"
        }).then(() => {
          _self.delete(array);
        });
      }
    },
    delete(ids) {
      let _self = this;
      if (ids.length > 0) {
        let url = loginInfoDeletePath;
        let params = JSON.parse(JSON.stringify(ids));
        _self.loginInfoDelete({ url: url, data: params }).then(result => {
          _self.getPageAll();
        });
      }
    },
    /**
     * 数据清空
     */
    handleClean() {
      let _self = this;
      MessageBox.confirm("是否删除选中数据", "删除", {
        type: "warning"
      }).then(() => {
        _self.clean();
      });
    },
    clean() {
      let _self = this;
      let url = loginInfoCleanPath;
      _self.loginInfoClean({ url: url, data: null }).then(result => {
        _self.getPageAll();
      });
    },
    /**
     * 导出
     */
    handleExport() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      let url = loginInfoServer + loginInfoExportPath;
      bootAdminExport("post", url, params);
    }
  }
};
</script>
<style >

</style>