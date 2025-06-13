<script setup lang="ts">
import DictItems from './itemList.vue'
import { definedExtraKeys } from './utils/const'
import { useDict } from './utils/userDict'

const {
  dialogFormRef,
  plusPageRef,
  tableColumns,
  formColumns,
  formVisible,
  validateExtraParams,
  dictValueTypeOptions,
  tableActions,
  formModel,
  formRules,
  submitLoading,
  dictItemVisible,
  formSave,
  addNew,
  refreshCache,
  addExtraParam,
  removeExtraParam,
  onLoad,
} = useDict()
</script>

<template>
  <div class="main">
    <PlusPage
      ref="plusPageRef"
      :columns="tableColumns"
      :request="onLoad"
      :table="{
        actionBar: {
          buttons: tableActions,
        },
        hasIndexColumn: true,
      }"
    >
      <template #table-title>
        <div class="table-title">
          <el-button v-auth="['sys:dict:add']" type="primary" @click="addNew">
            <template #icon>
              <ReIcon icon="i-ep:plus" class="el-icon" />
            </template>
            新增
          </el-button>
        </div>
      </template>
      <template #table-toolbar>
        <ElButton
          type="primary"
          @click="refreshCache"
        >
          <template #icon>
            <ReIcon icon="i-ep:refresh" class="el-icon" />
          </template>
          刷新缓存
        </ElButton>
      </template>
    </PlusPage>
    <PlusDialogForm
      ref="dialogFormRef"
      v-model="formModel"
      v-model:visible="formVisible"
      :form="{
        columns: formColumns,
        rules: formRules,
        labelWidth: '100px',
      }"
      :dialog="{
        title: formModel.id ? '编辑字典' : '新增字典',
        width: '45%',
        confirmLoading: true,
      }"
      @confirm="formSave"
    >
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
      <template #plus-field-extraParams="">
        <div class="w-full flex flex-col">
          <!-- 额外参数 -->
          <ElDivider>额外参数</ElDivider>
          <ElFormItem
            v-for="(schema, index) in formModel.extraParams"
            :key="index"
            :prop="`extraParams.${index}.name`"
            :label="`额外参数 ${index + 1}`"
            class="!mb-4"
            :rules="[
              { required: true, message: '请输入参数名称', trigger: 'blur' },
              { validator: validateExtraParams, trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="schema.name"
              placeholder="参数名称"
            >
              <template #prepend>
                <ElSelect
                  v-model="schema.type"
                  placeholder="类型"
                  style="width: 115px"
                >
                  <ElOption
                    v-for="option in dictValueTypeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </ElOption>
                </ElSelect>
              </template>
              <template #append>
                <ElButton
                  text
                  @click="removeExtraParam(index)"
                >
                  <ReIcon icon="i-ep:delete" class="el-icon" />
                </ElButton>
              </template>
            </ElInput>
          </ElFormItem>
          <ElSpace>
            <ElCheckTag
              v-for="definedExtraKey in definedExtraKeys"
              :key="definedExtraKey.name"
              checked
              class="extra-key"
              @click="addExtraParam(definedExtraKey.name, definedExtraKey.type)"
            >
              {{ definedExtraKey.name }}
            </ElCheckTag>
            <!-- 添加参数 -->
            <ElCheckTag
              style="width: 140px; text-align: center;"
              checked
              class="extra-key"
              @click="addExtraParam(undefined, undefined)"
            >
              <ReIcon icon="i-ep:plus" class="el-icon" />
            </ElCheckTag>
          </ElSpace>
        </div>
      </template>
    </PlusDialogForm>

    <DictItems v-model:visible="dictItemVisible" :dict="formModel" />
  </div>
</template>

<style lang="scss" scoped>
.extra-key {
  cursor: pointer;
  font-weight: normal !important;
}
</style>

<style lang="scss" scoped>
// 移除el-input-group__append 样式
:deep(.el-input-group__append) {
  padding: 0 !important;
  margin: 0 !important;
  background-color: transparent !important;
  border-left: none !important;
}
</style>
