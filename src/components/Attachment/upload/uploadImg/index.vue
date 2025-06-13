<script setup lang="ts">
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import type { FileTypes, UploadImageProps } from './types'
import { ref } from 'vue'
import { useUpload } from '../useUpload'
import { buildShortUUID } from '/src/utils'

const props = withDefaults(defineProps<UploadImageProps>(), {
  modelValue: '',
  uploadType: 'frontEnd',
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: (): FileTypes[] => ['image/jpeg', 'image/png', 'image/gif'],
  height: '150px',
  width: '150px',
  borderradius: '8px',
  showDelete: true,
  showBtnText: true,
})
const emits = defineEmits([
  'update:modelValue',
  'edit',
  'delete',
  'imagePreview',
])
const { uploadPreSignedUrl, uploadFile } = useUpload()

const id = ref(buildShortUUID('upload-image'))
const loading = ref(false)
function deleteImage() {
  emits('update:modelValue', '')
}
function editImage() {
  const dom = document.querySelector(`#${id.value} .el-upload__input`)
  dom && dom.dispatchEvent(new MouseEvent('click'))
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile: File) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes)) {
    ElMessage.warning('上传图片不符合所需的格式！')
    return
  }
  if (!imgSize) {
    ElMessage.warning(`上传图片大小不能超过${props.fileSize}MB！`)
    return
  }
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

async function httpRequest(options: UploadRequestOptions) {
  loading.value = true
  return props.uploadType === 'frontEnd'
    ? uploadPreSignedUrl(options)
    : uploadFile(options)
}

function uploadError() {
  loading.value = false
  ElMessage.error('上传失败！')
}

const uploadSuccess: UploadProps['onSuccess'] = (res: any) => {
  loading.value = false
  ElMessage.success('上传成功！')
  emits('update:modelValue', res.data)
}
</script>

<template>
  <div class="upload-box">
    <el-upload
      :id="id"
      v-loading="loading"
      :accept="props.fileType.join(',')"
      action="#"
      :before-upload="beforeUpload"
      class="upload" :class="[drag ? 'no-border' : '']"
      :disabled="disabled"
      :drag="drag"
      :multiple="false"
      :http-request="httpRequest"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      :show-file-list="false"
    >
      <template v-if="modelValue">
        <img :src="modelValue" class="upload-image">
        <div class="upload-handle" @click.stop>
          <div v-if="!disabled" class="handle-icon" @click="editImage">
            <ReIcon icon="i-ep:edit" />
            <span v-if="showBtnText">编辑</span>
          </div>
          <!-- <div class="handle-icon" @click="imagePreview(modelValue)">
            <Icon icon="ep:zoom-in" />
            <span v-if="showBtnText">详情</span>
          </div> -->
          <div
            v-if="showDelete && !disabled"
            class="handle-icon"
            @click="deleteImage"
          >
            <ReIcon icon="i-ep:delete" />
            <span v-if="showBtnText">删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <ReIcon icon="i-ep:plus" />
            <span>请上传图片</span>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.is-error {
  .upload {
    ::v-deep(.el-upload),
    ::v-deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

::v-deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    ::v-deep(.el-upload) {
      border: none !important;
    }
  }

  ::v-deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderradius);

        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }

      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);

        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
