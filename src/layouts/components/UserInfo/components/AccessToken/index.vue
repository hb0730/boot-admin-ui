<script setup lang="ts">
import { useAccessToken } from './utils/hook'

const {
  plusPageRef,
  plusDialogFormRef,
  openApiRef,
  dialogVisible,
  submitLoading,
  tableColumns,
  actionButtions,
  formModel,
  formColumns,
  formRules,
  openApisData,
  accessToken,
  accessTokenVisible,
  onLoad,
  handleAddNew,
  handleConfirm,
  handleCancel,
  handleAccessTokenConfirm,
} = useAccessToken()
</script>

<template>
  <LayInfo title="访问令牌管理">
    <PlusPage
      ref="plusPageRef"
      :columns="tableColumns"
      :table="{
        actionBar: {
          buttons: actionButtions,
        },
      }"
      :request="onLoad"
    >
      <template #table-title>
        <el-button type="primary" @click="handleAddNew">
          <template #icon>
            <ReIcon icon="i-ep:plus" class="el-icon" />
          </template>
          创建新令牌
        </el-button>
      </template>
    </PlusPage>
    <PlusDialogForm
      ref="plusDialogFormRef"
      v-model="formModel"
      v-model:visible="dialogVisible"
      :form="{
        columns: formColumns,
        rules: formRules,
      }"
      :dialog="{
        title: '创建新令牌',
        width: '50%',
      }"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #plus-field-openApis>
        <OpenApiTable
          ref="openApiRef"
          :data-list="openApisData"
        />
      </template>

      <template #dialog-footer="{ handleConfirm, handleCancel }">
        <ElButton
          @click="handleCancel"
        >
          取消
        </ElButton>
        <ElPopconfirm
          title="确认提交吗？"
          @confirm="handleConfirm"
        >
          <template #reference>
            <ElButton
              type="primary"
              :loading="submitLoading"
            >
              确定
            </ElButton>
          </template>
        </ElPopconfirm>
      </template>
    </PlusDialogForm>

    <PlusDialog
      v-model="accessTokenVisible"
      title="请立即复制并保存，Token 将仅显示一次。"
      width="35%"
    >
      <span>{{ accessToken }}</span>
      <template #footer>
        <ElButton
          type="primary"
          @click="handleAccessTokenConfirm"
        >
          复制
        </ElButton>
      </template>
    </PlusDialog>
  </LayInfo>
</template>
