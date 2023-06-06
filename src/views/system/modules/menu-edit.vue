<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  MenuTypeOptions,
  ifNumberOptions,
  ifOptions,
  ifEnableOptions
} from "@/constants/constants";
import * as permissionApi from "@/api/sys/permission";
import FromQuestion from "@/components/form-question/index.vue";
import { IconSelect } from "@/components/icon-select";
import type { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";
const formRef = ref<FormInstance>();
const pageData: any = reactive({
  isShow: false,
  title: "新增菜单/权限",
  formLoading: false,
  treeMenus: [],
  menuIcon: "",
  formData: {
    menuType: 0,
    isFrame: 0,
    showLink: true,
    enabled: true,
    keepAlive: false,
    showParent: true
  },
  formRules: {},
  dirFormRules: {
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" }
    ],
    title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    rank: [{ required: true, message: "请输入排序", trigger: "blur" }],
    path: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
  },
  menuFormRules: {
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" }
    ],
    title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    rank: [{ required: true, message: "请输入排序", trigger: "blur" }],
    path: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
  },
  permissionFormRules: {
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" }
    ],
    title: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
    perms: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
    rank: [{ required: true, message: "请输入排序", trigger: "blur" }]
  }
});
const emits = defineEmits(["close", "ok"]);
const open = (action: "save" | "update", data?: any, title?: string) => {
  pageData.title = title;
  const menuType = data?.menuType | 0;
  if (menuType === 0) {
    pageData.formRules = pageData.dirFormRules;
  } else if (menuType === 1) {
    pageData.formRules = pageData.menuFormRules;
  } else {
    pageData.formRules = pageData.permissionFormRules;
  }
  queryTreeMenu();
  switch (action) {
    case "save":
      pageData.formData = {
        menuType: 0,
        isFrame: 0,
        showLink: true,
        enabled: true,
        keepAlive: false,
        showParent: true
      };
      if (data) {
        pageData.formData = Object.assign(pageData.formData, data);
      }

      break;
    case "update":
      pageData.formData = cloneDeep(data);
      break;
  }
  pageData.isShow = true;
};
/**
 * 查询菜单树形列表
 */
const queryTreeMenu = () => {
  pageData.formLoading = true;
  permissionApi
    .treeMenus({})
    .then((res: any) => {
      if (res.success) {
        pageData.treeMenus = res.result;
      }
    })
    .finally(() => {
      pageData.formLoading = false;
    });
};
const handleChangeMenuType = (val: number) => {
  setTimeout(function () {
    formRef.value!.clearValidate([
      "menuType",
      "title",
      "rank",
      "path",
      "perms"
    ]);
  }, 30);

  if (val === 0) {
    pageData.formRules = pageData.dirFormRules;
  } else if (val === 1) {
    pageData.formRules = pageData.menuFormRules;
  } else {
    pageData.formRules = pageData.permissionFormRules;
  }
};
const handleConfirm = () => {
  formRef.value!.validate((isValid: boolean) => {
    if (isValid) {
      if (pageData.formData.id) {
        _update();
      } else {
        _save();
      }
    } else {
      message("表单校验失败", { type: "warning" });
    }
  });
};
const _update = () => {
  pageData.formLoading = true;
  const data = cloneDeep(pageData.formData);
  permissionApi
    .updatePermission(pageData.formData.id, data)
    .then((res: any) => {
      if (res.success) {
        _handleConfirm();
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.formLoading = false;
    });
};
const _save = () => {
  pageData.formLoading = true;
  const data = cloneDeep(pageData.formData);
  permissionApi
    .savePermission(data)
    .then((res: any) => {
      if (res.success) {
        _handleConfirm();
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.formLoading = false;
    });
};
/**
 * 关闭之前会调用
 */
const _handleClose = () => {
  pageData.isShow = false;
  emits("close");
};
const _handleConfirm = () => {
  pageData.isShow = false;
  emits("ok");
};
defineOptions({ name: "MenuEdit" });
defineExpose({ open });
</script>

<template>
  <el-drawer
    size="40%"
    v-model="pageData.isShow"
    destroy-on-close
    modal
    :close-on-click-modal="false"
    :title="pageData.title"
    :before-close="_handleClose"
  >
    <el-form
      ref="formRef"
      :model="pageData.formData"
      v-loading="pageData.formLoading"
      :rules="pageData.formRules"
      label-position="left"
    >
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group
          v-model="pageData.formData.menuType"
          @change="handleChangeMenuType"
        >
          <el-radio-button
            v-for="(item, index) in MenuTypeOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="菜单图标"
        prop="icon"
        v-if="pageData.formData.menuType !== 2"
      >
        <icon-select v-model="pageData.formData.icon" style="width: 100%" />
      </el-form-item>
      <el-form-item
        label="是否外链"
        prop="isFrame"
        v-if="pageData.formData.menuType !== 2"
      >
        <template #label>
          <from-question
            label="是否外链"
            description="选择是外链则路由地址需要以`http(s)://`开头"
          />
        </template>
        <el-radio-group v-model="pageData.formData.isFrame">
          <el-radio-button
            v-for="(item, index) in ifNumberOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="菜单可见"
        props="showLink"
        v-if="pageData.formData.menuType !== 2"
      >
        <template #label>
          <from-question
            label="菜单可见"
            description="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
          />
        </template>
        <el-radio-group v-model="pageData.formData.showLink">
          <el-radio-button
            v-for="(item, index) in ifOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        prop="title"
        v-if="pageData.formData.menuType !== 2"
      >
        <el-input
          v-model="pageData.formData.title"
          clearable
          placeholder="请输入菜单名称"
        />
      </el-form-item>
      <el-form-item
        label="是否缓存"
        prop="keepAlive"
        v-if="pageData.formData.menuType === 1"
      >
        <template #label>
          <from-question
            label="是否缓存"
            description="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
          />
        </template>
        <el-radio-group v-model="pageData.formData.keepAlive">
          <el-radio-button
            v-for="(item, index) in ifOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="显示父级菜单"
        prop="showParent"
        v-if="pageData.formData.menuType === 1"
      >
        <el-radio-group v-model="pageData.formData.showParent">
          <el-radio-button
            v-for="(item, index) in ifOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="组件名称"
        prop="name"
        v-if="pageData.formData.menuType === 1"
      >
        <el-input
          v-model="pageData.formData.name"
          clearable
          placeholder="组件名称"
        />
      </el-form-item>
      <el-form-item
        label="组件路径"
        prop="component"
        v-if="pageData.formData.menuType === 1"
      >
        <template #label>
          <from-question
            label="组件路径"
            description="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
          />
        </template>
        <el-input
          v-model="pageData.formData.component"
          clearable
          placeholder="请输入组件路径"
        />
      </el-form-item>
      <el-form-item
        label="路由地址"
        prop="path"
        v-if="pageData.formData.menuType !== 2"
      >
        <template #label>
          <from-question
            label="路由地址"
            description="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
          />
        </template>
        <el-input
          v-model="pageData.formData.path"
          clearable
          placeholder="请输入路由地址"
        />
      </el-form-item>
      <el-form-item
        label="菜单状态"
        prop="enabled"
        v-if="pageData.formData.menuType !== 2"
      >
        <template #label>
          <from-question
            label="菜单状态"
            description="选择停用则路由将不会出现在侧边栏，也不能被访问"
          />
        </template>
        <el-radio-group v-model="pageData.formData.enabled">
          <el-radio-button
            v-for="(item, index) in ifEnableOptions"
            :label="item.value"
            :key="index"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="权限名称"
        prop="title"
        v-if="pageData.formData.menuType === 2"
      >
        <el-input
          v-model="pageData.formData.title"
          clearable
          placeholder="请输入权限名称"
        />
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="perms"
        v-if="pageData.formData.menuType === 2"
      >
        <template #label>
          <from-question
            label="权限标识"
            description="控制器中定义的权限字符，如：@PreAuthorize(`@permission.hashPermission('menu:query')`)"
          />
        </template>
        <el-input
          v-model="pageData.formData.perms"
          clearable
          placeholder="请输入权限标识"
        />
      </el-form-item>
      <el-form-item label="显示排序" prop="rank">
        <el-input-number
          style="width: 100%"
          v-model="pageData.formData.rank"
          :min="0"
          :max="999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="pageData.formData.parentId"
          :data="pageData.treeMenus"
          :props="{ children: 'children', label: 'title' }"
          node-key="id"
          accordion
          filterable
          check-strictly
          clearable
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="demo-drawer__footer">
        <el-button @click="_handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
