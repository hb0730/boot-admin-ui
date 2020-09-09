<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.username" placeholder="登录账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.loginIp" placeholder="登录ip" clearable></el-input>
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
        <el-button plain @click="handleCurrentChange(1)" size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            @click="handleDelete"
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
            @click="getPage"
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
            prop="username"
            label="登录账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginIp"
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
              >{{scope.row.status==1?"成功":"失败"}}</el-tag>
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
import { MessageBox } from "element-ui";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      position: "left",
      searchInfo: {
        username: "",
        loginIp: "",
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
      //状态
      status: [
        {label:'成功',value:1},
        {label:'失败',value:0}
      ],
      dataList: [],
    };
  },
  mounted() {
    let _self = this;
    _self.getPage();
  },
  methods: {
    ...mapActions("bootAdmin/loginLog", [
      "loginLogPage",
      "loginLogDelete",
      "loginLogClean",
    ]),
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
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      if (_self.searchInfo.time) {
        params.startTime = _self.searchInfo.time[0];
        params.endTime = _self.searchInfo.time[1];
      }
      _self.loginLogPage({ data: params }).then((result) => {
        _self.dataList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
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
        _self.loginLogDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.getPage();
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
      _self.loginLogClean().then(result => {
        _self.$message.success("操作成功")
        _self.getPage();
      });
    },
  },
};
</script>