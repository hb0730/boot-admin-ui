<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
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
            class="el-button filter-item el-button--success el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button
            @click="handleEdit"
            type="button"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button
            @click="()=>dialogFormVisible=true"
            type="button"
            class="el-button filter-item el-button--info el-button--mini"
          >
            <i class="fa fa-upload"></i>
            <span>上传</span>
          </button>
          <button
            @click="handleDelete"
            type="button"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-remove"></i>
            <span>刪除</span>
          </button>
        </div>
        <div class="avue-crud__right">
          <button
            type="button"
            class="el-button el-tooltip el-button--default el-button--small is-circle"
            aria-describedby="el-tooltip-2497"
            tabindex="0"
            title="刷新"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="pageListDatas"
          style="width: 100%;"
          ref="datasRef"
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
    <el-dialog :before-close="handleClose" :visible.sync="dialogFormVisible">
      <FilePondUpload ref="upload" :uploadHandler="handlerUpload"></FilePondUpload>
    </el-dialog>
  </d2-container>
</template>
<script>
import util from "@/libs/util";
import { mapActions } from "vuex";
import FilePondUpload from "@/components/Upload/FileUpload";
import { upload } from "@/api/http";
export default {
  data() {
    return {
      searchInfo: {},
      isEnabledOptions: [],
      isOnlineOptions: [],
      pageListDatas: [],
      position: "left",
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dialogFormVisible: false
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
  },
  methods: {
    ...mapActions("d2admin/dict", ["getDictMap"]),
    ...mapActions("bootAdmin/file", ["FileUpload"]),
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        // _self.isEnabledOptions = _self.getMapType("system_enabled");
        // _self.isOnlineOptions = _self.getMapType("online_constant");
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
     * 新增
     */
    handleAddNew() {
      let _self = this;
    },
    /**
     * 修改
     */
    handleEdit() {
      let _self = this;
    },
    /**
     * 删除
     */
    handleDelete() {
      let _self = this;
    },
    handlerUpload(formData, uploadProgress, cancelToken) {
      let _self = this;
      return upload(
        "/api/v1/base/img/upload",
        formData,
        uploadProgress,
        cancelToken
      );
    },
    handleClose() {
      let _self = this;
      _self.$refs.upload.handleClearFileList();
      _self.dialogFormVisible = false;
    }
  }
};
</script>
<style >
</style>
