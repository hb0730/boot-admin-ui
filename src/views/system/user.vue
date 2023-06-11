<script setup lang="ts">
import { reactive } from "vue";
import UserList from "./modules/user-list.vue";
import UserOrgTree from "./modules/user-org.vue";
defineOptions({
  name: "user"
});
const pageData: any = reactive({
  mode: "table",
  orgInfo: {}
});
const handleSwitchMode = (mode: String) => {
  pageData.mode = mode;
  if (pageData.mode === "table") {
    pageData.orgInfo = {};
  }
};
const handleSwitchOrg = (org: any) => {
  pageData.orgInfo = org;
};
</script>

<template>
  <el-card :shadow="'never'">
    <template #default>
      <el-row>
        <template v-if="pageData.mode !== 'table'">
          <el-col :span="5">
            <user-org-tree @switch-org="handleSwitchOrg" />
          </el-col>
          <el-col :span="19">
            <user-list
              :mode="pageData.mode"
              :org-info="pageData.orgInfo"
              @switch-mode="handleSwitchMode"
            />
          </el-col>
        </template>
        <template v-else>
          <user-list
            :mode="pageData.mode"
            :org-info="pageData.orgInfo"
            @switch-mode="handleSwitchMode"
          />
        </template>
      </el-row>
    </template>
  </el-card>
</template>
