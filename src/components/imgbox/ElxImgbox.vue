<template>
  <div :class="'elx-imgbox' + (multiple ? '' : ' single-img')">
    <div class="elx-images">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          :tabindex="imgIndex"
          class="el-upload-list__item"
          v-for="(img, imgIndex) in theImages"
          :key="imgIndex"
        >
          <img :src="img.thumbPath" alt class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions">
            <!-- <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(img.path)">
              <i class="el-icon-zoom-in"></i>
            </span> -->
            <a class="el-upload-list__item-preview" :href="img.path" target="_blank"><i class="el-icon-zoom-in"></i></a>
            <span class="el-upload-list__item-delete" @click="onRemove(imgIndex, img)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </li>
      </ul>
      <div
        tabindex="0"
        class="el-upload el-upload--picture-card"
        v-if="(multiple && theImages.length < limit) || (!multiple && theImages.length == 0)"
        @click="onUpload"
      >
        <i class="el-icon-plus"></i>
      </div>
    </div>
    
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imageUrl" alt />
    </el-dialog>
  </div>
</template>

<script type="text/babel">
export default {
  name: "ElxImgbox",
  model: {
    prop: "images",
    event: "change"
  },
  props: {
    action: String, // 图片上传URL
    listUrl: String, // 图片列表数据URL
    uploadUrl: String, //上传路径
    multiple: { type: Boolean, default: true }, // 是否支持选取多个图片
    enableUpload: { type: Boolean, default: true }, // 是否启用图片上传
    limit: { type: Number, default: 10 }, // 最多可选择图片数量
    maxSize: { type: Number, default: 2 }, // 最大尺寸（M）
    withData: { type: Object, default: () => {} }, // 上传时附带的额外参数
    withCredentials: { type: Boolean, default: true }, // 支持发送 cookie 凭证信息
    headers: { type: Object, default: () => {} }, // 设置上传的请求头部
    images: { type: Array, default: () => [] }, // 已选图片
    activeTab: { type: String, default: "pick" }
  },
  data() {
    return {
      isLoading: true,
      theImages: this.images,
      uploadSuccessCount: 0,
      imgRes: {
        items: [],
        total: 0
      },
      dialogVisible: false,
      imageUrl: ""
    };
  },
  watch: {
    theImages: function() {
      this.$emit("change", this.theImages);
    }
  },
  methods: {
    onUpload() {
      this.$elxImgbox(
        {
          action: this.action,
          listUrl: this.listUrl, // 图片列表数据URL
          multiple: this.multiple, // 是否支持选取多个图片
          uploadUrl: this.uploadUrl,
          enableUpload: this.enableUpload, // 是否启用图片上传
          limit: this.limit, // 最多可选择图片数量
          maxSize: this.maxSize, // 最大尺寸（M）
          withData: this.withData, // 上传时附带的额外参数
          withCredentials: this.withCredentials, // 支持发送 cookie 凭证信息
          headers: this.headers, // 设置上传的请求头部
          activeTab: this.activeTab,
          callback: images => {
            this.theImages = images;
          }
        },
        this.theImages
      );
    },
    onRemove(imgIndex, img) {
      this.theImages.splice(imgIndex, 1);
    },
    /**
     * 预览
     */
    handlePictureCardPreview(url) {
      let _self = this;
      _self.imageUrl = url;
      _self.dialogVisible = true;
    }
  },
  mounted() {},
  computed: {}
};
</script>

<style lang="scss">
.elx-images {
  line-height: 0;
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 78px;
    height: 78px;
    line-height: 82px;
    border-radius: 5px;
  }
  .el-upload-list__item-actions {
    a {
      i {
        color: #fff;
      }
    }
  }
}
.single-img .el-upload-list--picture-card .el-upload-list__item {
  margin: 0;
}
</style>