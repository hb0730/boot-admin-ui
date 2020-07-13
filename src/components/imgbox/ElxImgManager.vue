<template>
  <div class="elx-imgbox">
    <el-dialog title="图片管理器" :visible.sync="visible"  class="elx-imgbox-dialog" top="5vh">
      <el-tabs v-model="options.activeTab" @tab-click="handlerTabs" tab-position="left">
        <el-tab-pane label="选择图片" name="pick" class="pick-block">
          <div class="elx-img-list-loading" v-if="isLoading">
            <div class="el-icon-loading"></div>
          </div>

          <div class="elx-main elx-img-list">
            <div
              class="img-item"
              v-for="(img, itemIndex) in imgRes.items"
              @click="onClickListImage(img)"
              :key="itemIndex"
            >
              <div class="thumb-wp">
                <img :src="img.thumbPath" alt="img.name" />
              </div>
              <div class="title">{{img.name}}</div>
              <div class="label" v-if="img.fileKey">{{img.fileKey}}</div>
              <span class="selected" v-if="img.selected">
                <span class="icon el-icon-check"></span>
              </span>
            </div>
          </div>

          <el-pagination
            layout="total, prev, pager, next"
            :total="imgRes.total"
            @current-change="onPageNumChange"
          ></el-pagination>

          <div class="elx-foot">
            <el-badge :value="images.length" class="item">
              <el-button
                type="primary"
                size="medium"
                :disabled="images.length == 0"
                @click="onConfirm"
              >确定</el-button>
            </el-badge>
            <el-badge :value="images.length" class="item">
              <el-button
                type="warning"
                size="medium"
                :disabled="images.length == 0"
                @click="onDelete"
              >删除</el-button>
            </el-badge>
            <el-button
              type="primary"
              size="medium"
              @click="options.activeTab='upload'"
              plain
              v-if="options.enableUpload"
            >上传图片</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="上传图片" name="upload" class="upload-block" v-if="options.enableUpload">
          <div class="elx-main">
            <div class="upload-title">请选择本地图片上传：</div>
            <el-upload
              ref="upload"
              class="upload-img-preview"
              list-type="picture-card"
              accept="image/*"
              action
              :multiple="options.multiple"
              :headers="options.headers"
              :with-credentials="options.withCredentials"
              :data="options.withData"
              :http-request="uploadRequest"
              :auto-upload="false"
              :limit="uploadNumberLimit()"
              :before-upload="beforeUpload"
              :on-change="onUploadChange"
              :on-progress="onUploadProgress"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-exceed="onUploadExceedTip"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="upload-tip">{{ uploadTips() }}</div>

            <div class="elx-foot">
              <el-button type="primary" size="medium" @click="onUploadConfirm">确定上传</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import {
  imagePage,
  uploadImage,
  imageDeletes
} from "@/api/bootAdmin/systemManager/img";
import { imageDeletePath } from "@/api/baseUrl";
export default {
  name: "ElxImgbox",
  model: {
    prop: "images",
    event: "change"
  },
  props: {
    // uploadHandler: {
    //   type: Function,
    //   required: true
    // }
  },
  data() {
    return {
      images: [], // 已选图片
      options: {
        uploadUrl: "", //上传路径
        listUrl: "", // 图片列表数据URL
        action: "", // 图片上传URL
        multiple: true, // 是否支持选取多个图片
        withData: {}, // 上传时附带的额外参数
        withCredentials: true, // 支持发送 cookie 凭证信息
        headers: {}, // 设置上传的请求头部
        limit: 10, // 最多可选择图片数量
        maxSize: 2, // 最大尺寸（M）
        activeTab: "pick",
        enableUpload: true, // 是否启用图片上传
        callback: null
      },
      isLoading: true,
      visible: false,
      uploadSuccessCount: 0,
      imgRes: {
        items: [],
        total: 0
      },
      fileList: [],
      fileData: new FormData()
    };
  },
  methods: {
    setOptions(options) {
      Object.assign(this.options, options);
      // 已选取上传tab但上传未启用，则转到图片选取（仅演示时有这种情况，正式使用不会有）
      if (this.options.activeTab === "upload" && !this.options.enableUpload) {
        this.options.activeTab = "pick";
      }
    },
    handlerTabs(tab, event){
       if(tab.paneName=='pick'){
         this.loadListImage();
       }else{
         
       }
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    onConfirm() {
      this.hide();
      if (typeof this.options.callback === "function") {
        this.options.callback(this.images);
      }
    },
    /**
     * 删除
     */
    onDelete() {
      let _self = this;
      if (_self.images.length <= 0) {
        ELEMENT.Message.warning("请选择图片");
        return;
      }
      let ids = [];
      _self.images.forEach(item => {
        ids.push(item.id);
      });
      // 调用
      let url = imageDeletePath;
      let params = JSON.parse(JSON.stringify(ids));
      imageDeletes(url, params).then(result => {
        _self.removeAll();
        _self.loadListImage();
      });
    },
    removeAll() {
      let _self = this;
      console.info(_self.images);
      _self.images.forEach(item => {
        _self.clearListSelected(item);
      });
      _self.images = [];
    },
    /**
     * 点击图片时选中或取消选中图片
     * @param img object
     */
    onClickListImage(img) {
      var imgIndex = this.selectedImageIndex(img);
      if (imgIndex >= 0) {
        // 取消图片已选状态
        img.selected = false;
        this.images.splice(imgIndex, 1);
        return;
      }
      if (!this.options.multiple) {
        // 单选时，先取消已选
        this.images = [];
        this.clearListSelected();
      }
      // 选择图片
      if (this.options.multiple && this.images.length >= this.options.limit) {
        ELEMENT.Message.warning("最多只能选择" + this.options.limit + "张图片");
        return;
      }
      img.selected = true;
      this.images.push(JSON.parse(JSON.stringify(img)));
    },
    clearListSelected(img) {
      for (let i = 0; i < this.imgRes.items.length; i++) {
        if (img) {
          if (img.path === this.imgRes.items[i].path) {
            this.imgRes.items[i].selected = false;
            break;
          }
        } else if (this.imgRes.items[i].selected) {
          console.info(this.imgRes.items[i].selected);
          this.imgRes.items[i].selected = false;
        }
      }
    },
    /**
     * 加载图片列表数据
     * @param page
     */
    loadListImage(page = 1) {
      if (!this.options.listUrl) {
        throw new Error("listUrl is required");
      }
      this.isLoading = true;
      let _self = this;
      let params = {
        pageNum: page,
        pageSize: 15,
        _r: Math.random()
      };
      imagePage(this.options.listUrl, params).then(result => {
        this.imgRes.total = parseInt(result.total);
        let imageList = [];
        let listCount = 0;
        for (let i = 0; i < result.records.length; i++) {
          let img = result.records[i];
          img.selected = this.selectedImageIndex(img) > -1;
          imageList.push(img);
        }

        this.imgRes.items = imageList;
        this.isLoading = false;
      });
    },
    /**
     * 图片已选则返回下标，未选则返回-1
     */
    selectedImageIndex(img) {
      for (let i = 0; i < this.images.length; i++) {
        var selectedImg = this.images[i];
        if (selectedImg.path === img.path) {
          return i;
        }
      }
      return -1;
    },
    /**
     * 分页页面变化时刷新数据
     * @param page
     */
    onPageNumChange(page) {
      this.loadListImage(page);
    },
    /**
     * 提交上传图片
     */
    onUploadConfirm() {
      this.$refs.upload.submit();
      let url = this.options.uploadUrl;
      uploadImage(url, this.fileData).then(result => {
        this.fileData = new FormData();
        this.uploadSuccessCount = 0;
        this.$refs.upload.clearFiles();
      });
    },
    onUploadProgress(event, file, fileList) {},
    onUploadChange(file, fileList) {},
    /**
     * 上传图片前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGif = file.type === "image/gif";
      const isSize = file.size / (1024 * 1024) < this.options.maxSize;
      if (!isJPG && !isPNG && !isGif) {
        ELEMENT.Message.error(this.uploadTypeTip());
        return false;
      }
      if (!isSize) {
        ELEMENT.Message.error(this.uploadSizeTip());
        return false;
      }
      return true;
    },
    uploadNumberLimit() {
      if (!this.options.multiple) {
        return 1;
      }
      return this.options.limit - this.images.length;
    },
    uploadTypeTip() {
      return "仅支持 jpg/png/gif 图片";
    },
    uploadSizeTip() {
      return "大小不能超过 " + this.options.maxSize + "M";
    },
    uploadTips() {
      let tips = [this.uploadTypeTip(), this.uploadSizeTip()];
      if (!this.options.multiple) {
        return tips.join("，");
      }
      if (this.images.length > 0) {
        tips.push("已有" + this.images.length + "张图片");
      }
      const uploadFileNum = this.$refs.upload
        ? this.$refs.upload.uploadFiles.length
        : 0;
      if (uploadFileNum > 0) {
        tips.push("即将上传" + uploadFileNum + "张图片");
      }
      tips.push(
        "还可以选择" +
          (this.options.limit - this.images.length - uploadFileNum) +
          "张图片上传"
      );
      return tips.join("，");
    },
    /**
     * 上传错误处理
     * @param err
     * @param file
     * @param fileList
     */
    onUploadError(err, file, fileList) {
      ELEMENT.Message.info("服务器打了个盹^_^");
      // console.log(err)
      throw err;
    },
    /**
     * 上传成功处理
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess(response, file, fileList) {
      if (!this.options.multiple) {
        this.images = [];
      }
      this.images.push(response.item);
      this.uploadSuccessCount++;
      if (
        !this.options.multiple ||
        fileList.length === this.uploadSuccessCount
      ) {
        this.onConfirm();
        this.uploadSuccessCount = 0;
        this.$refs.upload.clearFiles();
      }
    },
    /**
     * 选择上传文件超过限制文件个数提示
     */
    onUploadExceedTip() {
      ELEMENT.Message.warning(
        "当前最多只能选择" + this.uploadNumberLimit() + "张图片上传"
      );
    },
    onRemove(imgIndex, img) {
      this.images.splice(imgIndex, 1);
      this.clearListSelected(img);
    },
    /**
     * upload
     */
    uploadRequest(params) {
      if (!this.options.uploadUrl) {
        throw new Error("uploadUrl is required");
      }
      this.fileData.append("files", params.file);
    }
  },
  mounted() {
    this.loadListImage();
  },
  computed: {}
};
</script>

<style lang="scss">
.elx-images {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 78px;
    height: 78px;
    line-height: 82px;
    border-radius: 5px;
  }
}
.elx-imgbox-dialog {
  $bg: #f6f6f6;
  .el-badge {
    vertical-align: bottom;
  }
  .el-dialog {
    width: 720px;
    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
    }
    .el-dialog__body {
      padding: 0;
      background: $bg;
    }
  }
  .el-tabs {
    .el-tabs__header {
      margin-right: 0;
      margin-top: 5px;
      .el-tabs__nav-wrap::after {
        background: $bg;
      }
    }
    .el-tabs__item.is-active {
      background: #fff;
    }
    .el-tabs--left .el-tabs__nav-wrap {
      padding-top: 15px;
    }
    .el-tabs__content {
      height: 560px;
      background: #fff;
    }
  }
  .elx-foot {
    padding: 15px 0 0 10px;
    .el-button {
      margin: 0 0 0 10px;
    }
  }
  .pick-block {
    position: relative;
    .elx-img-list-loading {
      position: absolute;
      z-index: 9;
      left: 0;
      right: 0;
      width: 100%;
      height: 450px;
      background: #fff;
      text-align: center;
      .el-icon-loading {
        font-size: 50px;
        color: #409eff;
        line-height: 250px;
      }
    }
    .elx-img-list {
      padding: 10px;
      height: 433px;
      .img-item {
        $imgSize: 100px;
        float: left;
        margin: 10px;
        width: $imgSize;
        cursor: pointer;
        position: relative;
        font-size: 12px;
        img {
          width: $imgSize;
          height: $imgSize;
          display: block;
        }
        .title {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          background: $bg;
          padding: 0 5px;
        }
        .label {
          position: absolute;
          z-index: 9;
          left: 0;
          bottom: 24px;
          width: 100%;
          height: 21px;
          line-height: 21px;
          text-align: center;
          color: #fff;
          &:after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 21px;
            background: #000;
            opacity: 0.3;
            z-index: -1;
          }
        }
        .selected {
          position: absolute;
          right: -3px;
          top: -3px;
          width: 100%;
          height: 100%;
          border: 3px solid #409eff;
          border-radius: 3px;
          text-align: right;
          .icon {
            background: #409eff;
            text-align: center;
            height: 24px;
            width: 24px;
            line-height: 24px;
            display: inline-block;
            font-size: 16px;
            color: #fff;
            border-radius: 0 0 0 3px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
      &::after {
        content: " ";
        display: table;
        height: 0;
        clear: both;
        visibility: hidden;
      }
    }
    .el-pagination {
      background: #f9f9f9;
      position: relative;
      padding: 5px;
      margin: 0 24px 0 20px;
      text-align: right;
      float: none;
      * {
        background: none;
      }
    }
  }
  .upload-block {
    .upload-img-preview {
      padding: 20px;
      /* 上传图片预览改为使用背景图片按比例缩放方式 */
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .el-upload-list--picture-card .el-upload-list__item .wp {
        width: 90px;
        height: 90px;
        line-height: 98px;
        background-size: cover;
        background-position: 50% 50%;
      }
      .el-upload-list--picture-card .el-upload-list__item-status-label i {
        margin-top: 12px;
        vertical-align: top;
      }
    }
    .upload-tip {
      padding: 0 20px;
      font-size: 13px;
      color: #999;
    }
    .upload-title {
      font-size: 16px;
      color: #666;
      padding: 20px 0 0 20px;
    }
  }
}
.el-upload-list__item-actions {
  a {
    i {
      color: #fff;
    }
  }
}
</style>