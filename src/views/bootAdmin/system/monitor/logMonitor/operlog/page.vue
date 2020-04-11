<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.module" placeholder="操作模块" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.businessType" placeholder="操作类型" clearable>
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.username" placeholder="操作用户" clearable></el-input>
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
          <el-date-picker v-model="searchInfo.startTime" type="date" placeholder="操作开始"></el-date-picker>-
          <el-date-picker v-model="searchInfo.endTime" type="date" placeholder="操作结束"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            @click="handleRemove"
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
          <button @click="handleExport" type="button" class="el-button filter-item el-button--warning el-button--mini">
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
          :data="operLogList"
          style="width: 100%;"
          ref="operLog"
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
            label="日志编号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="module"
            label="操作模块"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="操作内容"
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
            <template scope="scope">
              <el-tag
                v-if="scope.row.businessType==0||scope.row.businessType==1||scope.row.businessType==2||scope.row.businessType==4"
                type="success"
                disable-transitions
              >{{getMapValue("system_oper_type",scope.row.businessType)[0].label}}</el-tag>
              <el-tag
                v-if="scope.row.businessType==3||scope.row.businessType==7||scope.row.businessType==9"
                type="danger"
                disable-transitions
              >{{getMapValue("system_oper_type",scope.row.businessType)[0].label}}</el-tag>
              <el-tag
                v-if="scope.row.businessType==5||scope.row.businessType==6||scope.row.businessType==8"
                type="warning"
                disable-transitions
              >{{getMapValue("system_oper_type",scope.row.businessType)[0].label}}</el-tag>
            </template>
          </el-table-column>
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
            label="主机"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="operLocation"
            label="操作地点"
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
              >{{getMapValue("system_status",scope.row.status)[0].label}}</el-tag>
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
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">
              <el-button
                type="warning"
                @click="handleInfo(scope.row)"
                size="medium"
                plain
                icon="fa fa-search"
              >详情</el-button>
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
    <el-dialog title="操作详情" :visible.sync="dialogVisible">
      <el-form label-width="auto" disabled :model="operLogInfo" :label-position="position" center>
        <el-form-item label="操作模块">
          <el-input v-model="operLogInfo.module" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作信息">
          <el-input v-model="operLogInfo.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select style="width:100%;" v-model="operLogInfo.businessType" placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="Number(item.value)"
              :value="Number(item.value)"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="operLogInfo.operUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input v-model="operLogInfo.requestMethod" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求方法">
          <el-input v-model="operLogInfo.method" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求参数">
          <el-input v-model="operLogInfo.operParam" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="返回参数">
          <el-input v-model="operLogInfo.jsonResult" type="textarea"></el-input>
        </el-form-item>
        <el-form-item v-if="operLogInfo.status==0" label="错误信息">
          <el-input v-model="operLogInfo.errorMsg" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  loginInfoAllPagePath,
  operLogDeletePath,
  operLogCleanPath,
  operLogExportPath
} from "@/api/baseUrl";
import util from "@/libs/util";
import { MessageBox } from "element-ui";
import { operLogServer } from '@/api/baseServer';
import { bootAdminExport } from '@/api/export';
export default {
  data() {
    return {
      position: "left",
      operLogList: [],
      searchInfo: {},
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      mapInfo: new Map(),
      status: [],
      type: [],
      operLogInfo: {},
      dialogVisible: false,
      position: "left"
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
    _self.getPageAll();
  },
  methods: {
    ...mapActions("bootAdmin/operLog", [
      "operLogAllPage",
      "operLogDelete",
      "operLogClean"
    ]),
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
      _self.operLogAllPage({ url: url, data: info }).then(result => {
        _self.operLogList = result.list;
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
        _self.status = _self.getMapType("system_status");
        _self.type = _self.getMapType("system_oper_type");
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
    /**
     * 详情
     */
    handleInfo(row) {
      let _self = this;
      _self.operLogInfo = JSON.parse(JSON.stringify(row));
      _self.dialogVisible = true;
    },
    /**
     * 检索
     */
    handleSearch() {
      let _self = this;
      _self.getPageAll();
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
        let url = operLogDeletePath;
        let params = JSON.parse(JSON.stringify(ids));
        _self.operLogDelete({ url: url, data: params }).then(result => {
          _self.getPageAll();
        });
      }
    },
    /**
     * 清空
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
      let url = operLogCleanPath;
      _self.operLogClean({ url: url, data: null }).then(result => {
        _self.getPageAll();
      });
    },
    handleExport(){
      let _self =this 
      let params=JSON.parse(JSON.stringify(_self.searchInfo))
      let url =operLogServer+operLogExportPath
      bootAdminExport('post',url,params)
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