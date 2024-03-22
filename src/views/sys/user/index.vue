<script setup lang="ts">
import deptTree from "./tree.vue";
import { useUser } from "./utils/hook";

import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { SearchForm } from "@/components/ReSearchForm";

const {
  permission,
  deptTreeData,
  searchData,
  tableData,
  pagination,
  buttonClass,
  handleRestPwd,
  openDrawer,
  handleCurrentDept,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleDelete,
  onSearch
} = useUser();

const tableRef = ref();

defineOptions({
  name: ""
});
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <dept-tree
      ref="treeRef"
      :tree-data="deptTreeData"
      :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
      @tree-select="handleCurrentDept"
    />
    <div
      :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-200px)]']"
    >
      <SearchForm
        :show="searchData.show"
        :form-items="searchData.formItems"
        :data-source="searchData.dataSource"
        :permission="permission.query"
        @search-form="handleSetSearchForm"
        @search="onSearch"
      />
      <PureTableBar
        :columns="tableData.columns"
        :table-ref="tableRef?.getTableRef()"
      >
        <template #title>
          <el-button
            v-auth="permission.save"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="openDrawer()"
          >
            新增用户
          </el-button>
        </template>

        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            row-key="id"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            align-whole="center"
            table-layout="auto"
            :loading="tableData.loading"
            :size="size"
            :data="tableData.dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @page-current-change="handleChangeCurrentPage"
            @page-size-change="handleChangePageSize"
          >
            <template #operation="{ row }">
              <el-button
                v-auth="permission.update"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon('ri:edit-fill')"
                :disabled="row.admin"
                @click="openDrawer('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                v-auth="permission.delete"
                :title="`是否删除用户: ${row.username}`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon('ri:delete-bin-fill')"
                    :disabled="row.admin"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown :disabled="row.admin">
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ri:more-fill')"
                />
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-auth="permission.resetPwd"
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ri:lock-password-fill')"
                      @click="handleRestPwd(row)"
                    >
                      重置密码
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
