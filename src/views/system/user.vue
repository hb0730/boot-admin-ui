<script setup lang="ts">
import { reactive } from "vue";
import UserList from "./modules/user-list.vue";
defineOptions({
  name: "user"
});
const pageData: any = reactive({
  mode: "table"
});
const handleSwitchMode = (mode: String) => {
  pageData.mode = mode;
};
</script>

<template>
  <el-card :shadow="'never'">
    <template #default>
      <el-row>
        <template v-if="pageData.mode !== 'table'">
          <el-col :span="5" />
          <el-col :span="19">
            <user-list :mode="pageData.mode" @switch-mode="handleSwitchMode" />
          </el-col>
        </template>
        <template v-else>
          <user-list :mode="pageData.mode" @switch-mode="handleSwitchMode" />
        </template>
      </el-row>
    </template>
  </el-card>
</template>

<style lang="scss" scoped></style>
