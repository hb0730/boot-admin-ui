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
        <el-button plain size="medium" @click="handlerSearch" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            @click="handleLogOut"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-sign-out"></i>
            <span>强退</span>
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
          :data="userOnlineList.slice((pages.page-1)*pages.pageSize,pages.page*pages.pageSize)"
          style="width: 100%;"
          ref="userOnlineRef"
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
            prop="tokenId"
            label="会话id"
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
            prop="loginTime"
            label="登录时间"
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
            <template scope="scope">
              <el-button
                size="small"
                @click="handleLogout(scope.row)"
                type="danger"
                plain
                icon="fa fa-sign-out"
              >强退</el-button>
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
  </d2-container>
</template>
<script>
import { MessageBox } from "element-ui";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      userOnlineList: [],
      searchInfo: {},
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      position: "left",
    };
  },
  mounted() {
    let _self = this;
    _self.getPage();
  },
  methods: {
    ...mapActions("bootAdmin/userOnline", [
      "userOnlinePage",
      "userOnlineLogoutKey",
      "userOnlineLogout",
    ]),
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.userOnlinePage({ data: params }).then((result) => {
        _self.userOnlineList = result.records;
        _self.pages.total = Number(result.total);
      });
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
      // this.getPage();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      // this.getPage();
    },
    /**
     * 强退
     */
    handleLogout(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除选中数据", "删除", {
        type: "warning",
      }).then(() => {
        const array = [];
        array.push(row.tokenId);
        _self.logout(array);
      });
    },
    handleLogOut() {
      let _self = this;
      const lists = _self.$refs.userOnlineRef.selection;
      if (lists.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else {
        const array = [];
        lists.forEach((element) => {
          array.push(element.tokenId);
        });
        MessageBox.confirm("是否删除选中数据", "删除", {
          type: "warning",
        }).then(() => {
          _self.logout(array);
        });
      }
    },
    /**
     * 检索
     */
    handlerSearch() {
      let _self = this;
      _self.pages.page = 1;
      _self.pages.pageSize = 10;
      _self.getPage();
    },
    logout(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.userOnlineLogout({ data: params }).then((result) => {
          _self.getPage();
        });
      }
    },
  },
};
</script>