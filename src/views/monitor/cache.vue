<script setup lang="ts">
import { reactive, onMounted } from "vue";
import * as $cacheApi from "@/api/monitor/cache";
import { JsonViewer } from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import { computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import message from "@/utils/message";

const pageData: any = reactive({
  menuParam: {
    list: [],
    active: undefined
  },
  formParam: {
    infoForm: {
      key: "",
      prefix: "",
      desc: ""
    }
  }
});
const showJson = computed(() => {
  return JSON.parse(pageData.formParam.infoForm.value) ?? "";
});
const showRemoveBtn = computed(() => {
  return pageData.formParam.infoForm.key ? true : false;
});
const loadData = () => {
  $cacheApi.queryList().then((res: any) => {
    if (res.success) {
      pageData.menuParam.list = res.result;
    }
  });
};
const selectMenu = (index, _) => {
  pageData.formParam.infoForm = {};
  pageData.menuParam.active = index;
  if (index > -1) {
    pageData.formParam.infoForm = pageData.menuParam.list[index];
  }
};
const handleSearchInfo = () => {
  if (!pageData.formParam.infoForm.key) {
    message.error("请输入key");
    return;
  }
  $cacheApi.queryInfo(pageData.formParam.infoForm).then((res: any) => {
    if (res.success) {
      pageData.formParam.infoForm = res.result;
    }
  });
};
const handleRest = () => {
  pageData.formParam.infoForm = {
    type: "",
    prefix: "",
    key: "",
    value: ""
  };
};
const handleRemove = () => {
  if (!pageData.formParam.infoForm.key) {
    message.error("请输入key");
    return;
  }
  $cacheApi.remove(pageData.formParam.infoForm).then((res: any) => {
    if (res.success) {
      message.success("移除成功");
      pageData.formParam.infoForm.key = "";
      pageData.formParam.infoForm.value = "";
    }
  });
};
onMounted(() => {
  loadData();
});
defineOptions({
  name: "CacheList"
});
</script>

<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="6">
        <el-scrollbar>
          <el-menu
            :default-active="pageData.menuParam.active"
            class="menu"
            style="width: 100%"
            @select="selectMenu"
          >
            <el-menu-item index="-1">缓存分类</el-menu-item>
            <el-menu-item
              v-for="(record, index) in pageData.menuParam.list"
              :index="index.toString()"
              :key="index.toString()"
              :class="index == pageData.menuParam.active ? 'is-active-2' : ''"
            >
              {{ index + 1 }}、{{ record.name }}
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-col>
      <el-col :span="18">
        <el-card :shadow="'never'" :span="18">
          <template #default>
            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
              <el-form :inline="true" :model="pageData.formParam.infoForm">
                <el-row :gutter="24">
                  <el-col :md="6" :sm="12">
                    <el-form-item label="prefix">
                      <el-input
                        v-model="pageData.formParam.infoForm.prefix"
                        placeholder="前缀"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" :sm="12">
                    <el-form-item label="key">
                      <el-input
                        v-model="pageData.formParam.infoForm.key"
                        placeholder=""
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :sm="8">
                    <el-button type="primary" @click="handleSearchInfo">
                      <el-icon class="el-icon--left">
                        <component :is="useRenderIcon('ep:search')" />
                      </el-icon>
                      查 询
                    </el-button>
                    <el-button
                      type="primary"
                      style="margin-left: 8px"
                      @click="handleRest"
                    >
                      <el-icon class="el-icon--left">
                        <component :is="useRenderIcon('ep:refresh-left')" />
                      </el-icon>
                      重 置
                    </el-button>
                    <el-popconfirm
                      title="危险操作！确定移除该缓存KEY吗?"
                      style="margin-left: 8px"
                      @confirm="handleRemove"
                    >
                      <template #reference>
                        <el-button type="primary" v-show="showRemoveBtn">
                          <el-icon class="el-icon--left">
                            <component :is="useRenderIcon('ep:close')" />
                          </el-icon>
                          删 除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!--展示区域-->
            <div class="json-viewer">
              <template v-if="!pageData.formParam.infoForm.value">
                <el-skeleton :rows="10" />
              </template>
              <template v-else>
                <json-viewer
                  :value="pageData.formParam.infoForm.value"
                  :depth="4"
                  closed
                  copyable
                  sort
                />
                <el-divider />
                <json-viewer
                  :value="showJson"
                  :depth="4"
                  closed="false"
                  copyable
                  sort
                />
              </template>
            </div>
            <!--描述区域-->
            <div class="footer">
              <el-divider>缓存描述</el-divider>
              <p>{{ pageData.formParam.infoForm?.desc ?? "" }}</p>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  :deep(.el-menu-item) {
    color: var(--el-menu-text-color) !important;
    background-color: var(--el-menu-bg-color) !important;

    &:hover {
      color: var(--el-menu-hover-text-color) !important;
      background-color: var(--el-menu-hover-bg-color) !important;
    }
  }

  .is-active-2 {
    background-color: var(--el-color-primary-light-8) !important;
  }
}

.layout-theme-default
  body[layout="vertical"]
  .el-menu--vertical
  .el-menu-item:hover {
  color: var(--el-menu-hover-text-color) !important;
}

.layout-theme-default body[layout="vertical"] .el-menu--vertical .is-active {
  color: var(--el-menu-active-color) !important;
  border-right: 2px solid var(--el-menu-active-color);
}
</style>
