<script setup lang="ts">
import { useDept } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";
import { SearchForm } from "@/components/ReSearchForm";
const {
  permission,
  searchData,
  tableData,
  handleSetSearchForm,
  onSearch,
  openDialog,
  handleDelete
} = useDept();

const tableRef = ref();

defineOptions({
  name: "DeptManger"
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />

    <PureTableBar
      :table-ref="tableRef?.getTableRef()"
      :columns="tableData.columns"
      @refresh="onSearch"
    >
      <template #title>
        <el-button
          v-auth="permission.add"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="() => openDialog()"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 45 }"
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="tableData.loading"
          :size="size"
          :data="tableData.data"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-auth="permission.edit"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:edit-fill')"
              @click="openDialog('修改', row)"
            >
              修改
            </el-button>
            <el-button
              v-auth="permission.add"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:add-circle-fill')"
              @click="openDialog('新增', { parentId: row.id })"
            >
              新增
            </el-button>
            <el-popconfirm
              :title="`是否确认删除部门名称为${row.name}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-auth="permission.delete"
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ri:delete-bin-fill')"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
