<template>
  <div>
    <file-pond
      ref="pond"
      :label-idle="label"
      :name="name"
      :allow-multiple="multiple"
      :allowRevert="false"
      :accepted-file-types="accept"
      :maxParallelUploads="1"
      :allowImagePreview="true"
      :maxFiles="1"
      labelFileProcessing="上传中"
      labelFileProcessingComplete="上传完成"
      labelFileProcessingAborted="取消上传"
      labelFileProcessingError="上传错误"
      labelTapToCancel="点击取消"
      labelTapToRetry="点击重试"
      :files="fileList"
      :server="server"
      @init="handleFilePondInit"
    ></file-pond>
  </div>
</template>
<script>
import axios from "axios";

import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
// Plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'


const FilePond = vueFilePond(FilePondPluginImagePreview)

export default {
  name: "FilePondUpload",
  components: {
    FilePond
  },
  props: {
    name: {
      type: String,
      required: false,
      default: "file"
    },
    filed: {
      type: String,
      required: false,
      default: ""
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    accept: {
      type: String,
      required: false,
      default: ""
    },
    label: {
      type: String,
      required: false,
      default: "点击选择文件或将文件拖拽到此处"
    },
    uploadHandler: {
      type: Function,
      required: true
    },
    loadOptions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const formData = new FormData();
          formData.append(fieldName, file, file.name);
          const CancelToken = axios.CancelToken;
          const source = CancelToken.source();
          this.uploadHandler(
            formData,
            progressEvent => {
              progress(
                progressEvent.lengthComputable,
                progressEvent.loaded,
                progressEvent.total
              );
            },
            source.token,
            this.filed,
            file
          )
            .then(response => {
              load(response)
              console.info("success",response)
              this.$emit("success", response, file);
            })
            .catch(failure => {
              console.info("failure")
              console.info("success",failure)
              this.$emit("failure", failure, file);
              error();
            });
          return {
            abort: () => {
              abort();
              source.cancel("Upload operation canceled by the user.");
            }
          };
        }
      },
      fileList: []
    };
  },
  computed: {
    // ...mapGetters(["options"])
  },
  methods: {
    handleFilePondInit() {},
    handleClearFileList() {
      this.$refs.pond.removeFiles();
    }
  }
};
</script>