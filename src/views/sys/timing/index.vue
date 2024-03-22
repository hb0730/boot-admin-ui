<script setup lang="ts">
import searchForm from "@/components/ReSearchForm/src/searchForm";
import { useTiming } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const {
  permission,
  searchData,
  tableData,
  pagination,
  openDialog,
  onSearch,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleRun,
  handlePause,
  handleResume,
  handleDelete
} = useTiming();

const tableRef = ref();

defineOptions({
  name: "QuartzJobManager"
});
</script>

<template>
  <div class="main">
    <searchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />

    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
      @refresh="onSearch()"
    >
      <template #title>
        <el-button
          v-auth="permission.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="openDialog()"
        >
          新增任务
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="tableData.dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="pagination"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <template #operation="{ row }">
            <el-link
              v-auth="permission.update"
              :underline="false"
              type="primary"
              @click="openDialog('修改', row)"
            >
              修改</el-link
            >
            <el-divider v-auth="permission.run" direction="vertical" />

            <el-popconfirm
              :title="`是否执行: ${row.jobName}任务`"
              @confirm="handleRun(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.run"
                  :underline="false"
                  type="primary"
                >
                  执行</el-link
                >
              </template>
            </el-popconfirm>
            <el-divider
              v-auth="[permission.pause, permission.resume]"
              direction="vertical"
            />
            <el-popconfirm
              v-if="!row.enabled"
              :title="`支付恢复: ${row.jobName}任务`"
              @confirm="handleResume(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.resume"
                  :underline="false"
                  type="primary"
                  >恢复</el-link
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else
              :title="`是否暂停: ${row.jobName}任务`"
              @confirm="handlePause(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.pause"
                  :underline="false"
                  type="primary"
                  >暂停</el-link
                >
              </template>
            </el-popconfirm>
            <el-divider v-auth="permission.delete" direction="vertical" />
            <el-popconfirm
              :title="`是否删除任务: ${row.jobName}`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.delete"
                  :underline="false"
                  type="primary"
                  >删除</el-link
                >
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
