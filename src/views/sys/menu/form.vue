<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import { formRules } from "./utils/rule";
import {
  MenuEnableOptions,
  keepAliveOptions,
  menuTypeOptions,
  showLinkOptions,
  showParentOptions
} from "./utils/enums";
import { listTree } from "@/api/sys/permission";
import { IconSelect } from "@/components/ReIcon";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    menuType: 0,
    parentId: 0,
    title: "",
    routeName: "",
    path: "",
    component: "",
    rank: 99,
    redirect: " ",
    icon: "",
    frameSrc: "",
    keepAlive: false,
    showLink: true,
    showParent: false,
    enabled: true
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const menuTree = ref([]);

function getRef() {
  return ruleFormRef.value;
}

function loadMenuTree() {
  listTree().then(res => {
    if (res.success) {
      menuTree.value = res.data;
    }
  });
}
onMounted(() => {
  loadMenuTree();
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="82px"
    :rules="formRules"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单类型">
          <Segmented
            v-model="newFormInline.menuType"
            :options="menuTypeOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.menuType = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="menuTree"
            :props="{
              value: 'id',
              label: 'title',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.title }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType !== 4" :value="12" :xs="24" :sm="24">
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="newFormInline.routeName"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType !== 4" :value="12" :xs="24" :sm="24">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 1"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="组件路径">
          <el-input
            v-model="newFormInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="newFormInline.rank"
            class="!w-full"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 1"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="路由重定向">
          <el-input
            v-model="newFormInline.redirect"
            clearable
            placeholder="请输入默认跳转地址"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType !== 4"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单图标">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType === 4" :value="12" :xs="24" :sm="24">
        <!-- 按钮级别权限设置 -->
        <el-form-item label="权限标识" prop="permission">
          <el-input
            v-model="newFormInline.permission"
            clearable
            placeholder="请输入权限标识"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 1"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <!-- iframe -->
        <el-form-item label="链接地址">
          <el-input
            v-model="newFormInline.frameSrc"
            clearable
            placeholder="请输入 iframe 链接地址"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType < 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="缓存页面">
          <Segmented
            :modelValue="newFormInline.keepAlive"
            :options="keepAliveOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.keepAlive = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType !== 4"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单">
          <Segmented
            :modelValue="newFormInline.showLink"
            :options="showLinkOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.showLink = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType !== 4"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="父级菜单">
          <Segmented
            :modelValue="newFormInline.showParent"
            :options="showParentOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.showParent = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="启用">
          <Segmented
            :modelValue="newFormInline.enabled"
            :options="MenuEnableOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.enabled = value;
              }
            "
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
