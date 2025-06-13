<script setup lang="ts">
import { usePermission } from './utils/usePermission'

const {
  plusPageRef,
  currentRow,
  formVisible,
  formModel,
  formColumns,
  formRules,
  submitLoading,

  tableColumns,
  tableActionButtions,
  loadData,
  loadChild,

  handleAddNew,
  handleConfirm,
} = usePermission()
</script>

<template>
  <div class="main">
    <PlusPage
      ref="plusPageRef"
      :columns="tableColumns"
      :request="loadData"
      :pagination="false"
      :table="{
        lazy: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        actionBar: { buttons: tableActionButtions, fixed: 'right' },
        load: loadChild,
      }"
    >
      <template #table-title>
        <div class="table-title">
          <el-button v-auth="['sys:permission:add']" type="primary" @click="handleAddNew()">
            <template #icon>
              <ReIcon icon="i-ep:plus" class="el-icon" />
            </template>
            新增
          </el-button>
        </div>
      </template>
    </PlusPage>

    <PlusDialogForm
      v-model="formModel"
      v-model:visible="formVisible"
      :form="{
        columns: formColumns,
        rules: formRules,
        labelWidth: '100px',
        rowProps: {
          gutter: 30,
        },
      }"
      :dialog="{
        title: currentRow.value?.id ? '编辑权限' : '新增权限',
        width: '45%',
      }"
      @confirm="handleConfirm"
    >
      <template #plus-field-menuType="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-isRequireLogin="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-isHidden="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-isKeepAlive="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-isAffix="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-isFullScreen="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-status="{ prop, options }:any">
        <ElSegmented v-model="formModel[prop]" :options="options" />
      </template>
      <template #plus-field-icon="{ prop }">
        <IconPicker v-model="formModel[prop]" />
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
            <ElButton type="primary" :loading="submitLoading">
              确定
            </ElButton>
          </template>
        </ElPopconfirm>
      </template>
    </PlusDialogForm>
  </div>
</template>
