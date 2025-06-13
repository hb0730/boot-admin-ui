<script setup lang="ts">
import type { PlusDialogInstance } from 'plus-pro-components'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessageBox, type UploadProps } from 'element-plus'
import { useUpload } from '@/components/Attachment'

const emits = defineEmits(['refresh', 'update:modelValue', 'close'])

const modelValue = defineModel({
  type: Boolean,
  default: false,
})

const fileList = ref<any[]>([])
const data = ref({ path: '' })
const loading = ref(false)
const uploadRef = ref<any>(null)
const previewImageUrl = ref('')
const previewVisible = ref(false)
const uploadNum = ref(0)
const uploadSuccessNum = ref(0)
const { uploadRequest } = useUpload()

const plusDialogRef = ref<Nullable<PlusDialogInstance>>(null)

function handleExceed() {
  ElMessage.warning('最多只能上传 5 张图片！')
}
watch(
  () => uploadNum.value,
  () => {
    if (uploadNum.value >= fileList.value.length) {
      loading.value = false
      if (uploadSuccessNum.value === fileList.value.length) {
        ElMessageBox.confirm('上传全部成功,是否继续上传？', '提示', {
          confirmButtonText: '继续上传',
          cancelButtonText: '取消',
          type: 'success',
        })
          .then(() => {
            uploadRef.value?.clearFiles()
          })
          .catch(() => {
            // 关闭弹窗
            handleClose()
          })
      }
      else {
        // message('存在上传失败的图片，如需请重新上传', { type: 'error' })
        ElMessage.error('存在上传失败的图片，如需请重新上传')
      }
      emits('refresh')
    }
  },
)
/** 上传错误提示 */
function submitFormError(): void {
  uploadNum.value++
}
/** 处理上传的文件发生变化 */
function handleFileChange(file: any) {
  data.value.path = file.name
}

/** 重置表单 */
function resetForm() {
  fileList.value = []
  loading.value = false
  uploadRef.value?.clearFiles()
}

function submitFormSuccess() {
  uploadNum.value++
  uploadSuccessNum.value++
}

/** 提交表单 */
function submitFileForm() {
  if (fileList.value.length === 0) {
    // message('请先选择文件！', { type: 'warning' })
    ElMessage.warning('请先选择文件！')
    return
  }
  loading.value = true
  previewVisible.value = false
  uploadRef.value?.submit()
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImageUrl.value = uploadFile.url!
  previewVisible.value = true
}

function handleClose() {
  resetForm()
  emits('close')
}

function handleUpload() {
  submitFileForm()
}
</script>

<template>
  <PlusDialog ref="plusDialogRef" v-model="modelValue" title="上传附件">
    <div v-loading="loading">
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        :data="data"
        action="#"
        multiple
        :auto-upload="false"
        drag
        accept="image/*"
        :on-exceed="handleExceed"
        :on-error="submitFormError"
        :on-change="handleFileChange"
        :on-success="submitFormSuccess"
        :http-request="uploadRequest"
        :on-preview="handlePictureCardPreview"
        :disabled="loading"
        list-type="picture-card"
      >
        <el-icon>
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip" style="color: red">
            提示：仅允许导入图片格式文件！
          </div>
        </template>
      </el-upload>

      <el-image-viewer
        v-if="previewVisible"
        :url-list="fileList.map(item => item.url)"
        @close="previewVisible = false"
      />
    </div>
    <template #footer>
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-popconfirm
        title="确定上传附件吗？"
        @confirm="handleUpload"
      >
        <template #reference>
          <el-button
            type="primary"
          >
            上传
          </el-button>
        </template>
      </el-popconfirm>
    </template>
  </PlusDialog>
</template>
