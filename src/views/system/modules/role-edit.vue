<script setup lang="ts">
import { reactive, ref } from "vue";
import { enableOptions } from "@/constants/constants";
import * as roleApi from "@/api/sys/role";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
const checkRoleCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入角色编码"));
  } else {
    const id = pageData.formData.id;
    roleApi.checkCode(value, id).then((res: any) => {
      if (res.success) {
        if (res.result) {
          callback(new Error("编码重复"));
        }
      }
    });
    callback();
  }
};
const formRef = ref<FormInstance>();
const pageData: any = reactive({
  dialogVisible: false,
  title: "新增角色",
  formLoading: false,
  isUpdate: false,
  formData: {
    roleCode: "",
    roleName: "",
    description: "",
    enabled: 1
  },
  formRules: {
    roleCode: [
      { required: true, message: "请输入角色编码", trigger: "blur" },
      { validator: checkRoleCode, trigger: "blur" }
    ],
    roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    enabled: [{ required: true, message: "请选择状态", trigger: "change" }]
  }
});
const emits = defineEmits(["ok", "close"]);
const open = (data?: any, title?: string) => {
  pageData.formData = data || {
    roleCode: "",
    roleName: "",
    description: "",
    enabled: 1
  };
  pageData.title = title || "新增角色";
  pageData.isUpdate = !!pageData.formData.id;
  pageData.dialogVisible = true;
};
const handleClose = () => {
  pageData.dialogVisible = false;
  emits("close");
};
const handleConfirm = () => {
  formRef.value!.validate((isValid: boolean) => {
    if (isValid) {
      const { id } = pageData.formData;
      if (id) {
        _update();
      } else {
        _save();
      }
    } else {
      message("表单校验失败", { type: "warning" });
    }
  });
};
const _save = () => {
  pageData.formLoading = true;
  const _data = cloneDeep(pageData.formData);
  roleApi
    .roleSave(_data)
    .then((res: any) => {
      if (res.success) {
        _confirm();
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.formLoading = false;
    });
};
const _update = () => {
  pageData.formLoading = true;
  const _data = cloneDeep(pageData.formData);
  roleApi
    .roleUpdate(pageData.formData.id, _data)
    .then((res: any) => {
      if (res.success) {
        _confirm();
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.formLoading = false;
    });
};
const _confirm = () => {
  pageData.dialogVisible = false;
  emits("ok");
};
defineExpose({ open });
defineOptions({ name: "RoleEdit" });
</script>

<template>
  <el-dialog
    v-model="pageData.dialogVisible"
    :title="pageData.title"
    destroy-on-close
    :width="800"
    class="el-dialog-header"
  >
    <div class="el-dialog-content">
      <el-form
        :model="pageData.formData"
        style="width: 70%"
        label-width="auto"
        :rules="pageData.formRules"
        ref="formRef"
        :loading="pageData.formLoading"
      >
        <el-form-item label="角色编码" prop="roleCode">
          <el-input
            v-model="pageData.formData.roleCode"
            clearable
            placeholder="请输入角色编码"
            :disabled="pageData.isUpdate"
          />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="pageData.formData.roleName"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="pageData.formData.description"
            :autosize="{ minRows: 3 }"
            clearable
            placeholder="文本输入，不得超过200"
            max="200"
          />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio-group v-model="pageData.formData.enabled">
            <el-radio
              v-for="(item, index) in enableOptions"
              :label="item.value"
              :key="index"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
