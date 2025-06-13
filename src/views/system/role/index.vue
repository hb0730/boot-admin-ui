<script setup lang="ts">
import Permission from './permission.vue'
import { useRole, useRoleForm } from './utils/useRole'

const {
  currentRow,
  searchModel,
  tableLoading,
  total,
  pageInfo,
  pageSizeList,
  tableData,
  tableColumns,
  showPermission,
  tableActionButtions,
  onLoad,
  onSearch,
  handleReset,
} = useRole(onEdit)

const {
  formItems,
  submitLoading,
  formModel,
  formVisible,
  defaultModel,
  formRules,
  handleCancel,
  handleConfirm,
} = useRoleForm()

function onAddNew() {
  formModel.value = { ...defaultModel }
  formVisible.value = true
}
function onEdit(row: any) {
  formModel.value = { ...row }
  formVisible.value = true
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <div class="main">
    <ElCard>
      <PlusSearch
        v-model="searchModel"
        :columns="tableColumns"
        @search="onSearch"
        @reset="handleReset"
      />
    </ElCard>
    <div class="mt-5">
      <div class="w-full flex">
        <ElCard class="role-card" :class="[showPermission ? '!w-[60vw]' : 'w-full']">
          <PlusTable
            :table-data="tableData"
            :columns="tableColumns"
            :pagination="{ total, modelValue: pageInfo, pageSizeList }"
            :loading-status="tableLoading"
            :action-bar="{ buttons: tableActionButtions, fixed: 'right' }"
            style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <template #title>
              <el-button v-auth="['sys:role:add']" type="primary" @click="onAddNew">
                <template #icon>
                  <ReIcon icon="i-ep:plus" class="el-icon" />
                </template>
                新增
              </el-button>
            </template>
          </PlusTable>
        </ElCard>
        <Transition name="fade-slide">
          <ElCard v-show="showPermission" class="permission-card ml-2 max-w-380px w-full overflow-auto px-2 pb-2">
            <Permission v-model="currentRow" @close="showPermission = false" />
          </ElCard>
        </Transition>
      </div>
    </div>
    <PlusDialogForm
      v-model="formModel"
      :visible="formVisible"
      :form="{
        columns: formItems,
        rules: formRules,
        submitLoading: true,
        labelWidth: '100px',
      }"
      :dialog="{
        title: formModel.id ? '编辑角色' : '新增角色',
        width: '45%',
      }"
      @cancel="handleCancel"
      @confirm="handleConfirm(onLoad)"
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
    </PlusDialogForm>
  </div>
</template>

<style lang="scss" scoped>
.role-card {
  transition: 0.5s;
}
.permission-card {
  :deep(.el-card__body) {
    padding: 0;
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s,
    transform 0.25s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
