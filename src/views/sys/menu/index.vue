<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { useMenu } from "./utils/hook";
import { reactive, ref } from "vue";
import { SearchForm } from "@/components/ReSearchForm";

const tableRef = ref();

const {
  formItems,
  searchForm,
  tableForm,
  tableColumns,
  handleSearchFrom,
  onSearch,
  handleGetChild,
  openForm,
  handleDeleteMenu
} = useMenu(tableRef);

const permission = reactive<any>({
  query: ["sys:permission:list"],
  add: ["sys:permission:add"],
  edit: ["sys:permission:update"],
  delete: ["sys:permission:delete"]
});

const handleOpenForm = (title = "新增", data?: any) => {
  openForm(title, data);
};
defineOptions({
  name: "menuManager"
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchForm.show"
      :form-items="formItems"
      :permission="permission.query"
      @search-form="handleSearchFrom"
      @search="onSearch"
    />

    <PureTableBar
      :columns="tableColumns"
      :table-ref="tableRef?.getTableRef()"
      :isExpandAll="false"
      @refresh="onSearch"
    >
      <template #title>
        <el-button
          v-auth="permission.add"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="handleOpenForm('新增')"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          :data="tableForm.dataList"
          :loading="tableForm.loading"
          adaptive
          :adaptiveConfig="{ offsetBottom: 45 }"
          align-whole="center"
          row-key="id"
          :size="size"
          :columns="dynamicColumns"
          :lazy="true"
          :load="handleGetChild"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
              @click="handleOpenForm('修改', row)"
            >
              修改
            </el-button>
            <el-button
              v-show="row.menuType !== 3"
              v-auth="permission.add"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:add-circle-fill')"
              @click="handleOpenForm('新增', { parentId: row.id })"
            >
              新增
            </el-button>
            <el-popconfirm
              :title="`是否确认删除菜单名称为${row.title}的这条数据${row?.children?.length > 0 ? '。注意下级菜单也会一并删除，请谨慎操作' : ''}`"
              @confirm="handleDeleteMenu(row)"
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
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>
