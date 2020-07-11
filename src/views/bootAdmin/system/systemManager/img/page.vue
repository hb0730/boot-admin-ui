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
        <el-row>
          <el-col
            :span="4"
            style="padding: 6px 6px 6px 6px;"
            v-for="item in pageListDatas"
            :key="item.id"
          >
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <el-image :src="item.thumbPath"></el-image>
              <div style="padding: 14px;">
                <span>{{item.name}}</span>
              </div>
              <el-checkbox :id="item.id" class="select-attachment-checkbox"></el-checkbox>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchInfo.pageNum"
          :page-sizes="[18, 36, 54, 72]"
          :page-size="searchInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchInfo.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog width="30%" :before-close="handleClose" :visible.sync="dialogFormVisible">
      <!-- <FilePondUpload ref="upload" :uploadHandler="handlerUpload"></FilePondUpload> -->
      <elx-imgbox v-model="imgList" :upload-url="uploadImgUrl" :list-url="listUrl" :limit="10"></elx-imgbox>
    </el-dialog>
  </d2-container>
</template>
<script>
import util from "@/libs/util";
import { mapActions } from "vuex";
import FilePondUpload from "@/components/Upload/FileUpload";
import elImgbox from "@/components/imgbox";
import { upload } from "@/api/http";
import { imageUploadPath, imagPagePath, imageUploadsPath } from "@/api/baseUrl";
export default {
  data() {
    return {
      searchInfo: {
        pageNum: 1,
        pageSize: 18,
        total: 0
      },
      isEnabledOptions: [],
      isOnlineOptions: [],
      pageListDatas: [],
      position: "left",
      dialogFormVisible: false,
      listUrl: imagPagePath,
      uploadImgUrl: imageUploadsPath,
      action: "",
      imgList: []
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
    _self.getPage();
  },
  methods: {
    ...mapActions("d2admin/dict", ["getDictMap"]),
    ...mapActions("bootAdmin/img", ["ImgPage", "ImgUpload"]),
    handleSizeChange(val) {
      this.searchInfo.pageSize = val;
    },
    handleCurrentChange(val) {
      this.searchInfo.pageNum = val;
    },
    getPage() {
      let _self = this;
      let url = imagPagePath;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.ImgPage({ url: url, data: params }).then(result => {
        _self.pageListDatas = result.records;
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
      return _self.ImgUpload({
        url: imageUploadPath,
        formData: formData,
        uploadProgress: uploadProgress,
        cancelToken: cancelToken
      });
    },
    handleClose() {
      let _self = this;
      _self.$refs.upload.handleClearFileList();
      _self.dialogFormVisible = false;
    }
  }
};
</script>
<style scoped>
.select-attachment-checkbox {
  display: block;
  width: 100%;
  height: 100%;
  /* position: absolute; */
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}
</style>
