<script setup lang="ts">
import { useAttachmentHook } from './utils/hook'

const {
  plusPageRef,
  columns,
  actionButtins,
  formVisible,
  formUploadRef,
  loadData,
  handleOpen,
  handleClose,
  handleRefresh,
} = useAttachmentHook()
</script>

<template>
  <div class="main">
    <PlusPage
      ref="plusPageRef"
      :columns="columns"
      :request="loadData"
      :table="{
        actionBar: {
          buttons: actionButtins,
        },
      }"
    >
      <template #table-title>
        <el-button
          type="primary"
          @click="handleOpen"
        >
          <template #icon>
            <ReIcon icon="i-ep:upload" class="el-icon" />
          </template>
          上传附件
        </el-button>
      </template>
      <template #plus-field-preview="{ row }">
        <template v-if="row.mediaType.includes('image')">
          <el-image
            preview-teleported
            :src="row.permalink"
            fit="cover"
            class="h-[100px] w-[100px]"
          />
        </template>
        <template v-else>
          {{ row.displayName }}
        </template>
      </template>
    </PlusPage>
    <MultipleUploadImg
      ref="formUploadRef"
      v-model="formVisible"
      @close="handleClose"
      @refresh="handleRefresh"
    />
  </div>
</template>
