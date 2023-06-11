<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import * as $userApi from "@/api/sys/user";
import message from "@/utils/message";
const userStore = useUserStoreHook();
const form = ref();
const pageData: any = reactive({
  mode: "self",
  modalParam: {
    visible: false,
    closeOnClickModal: true
  },
  currentData: {},
  formParam: {
    infoForm: {},
    loading: false
  }
});
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else if (
    value === pageData.formParam.infoForm.oldPassword &&
    pageData.mode === "self"
  ) {
    callback(new Error("输入新密码与旧密码不能相同"));
  } else {
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== pageData.formParam.infoForm.newPassword) {
    callback(new Error("两次输入密码不正确"));
  } else {
    callback();
  }
};
const username = computed(() => {
  if (pageData.currentData) {
    return pageData.currentData.username;
  }
  return userStore.username;
});
const formRules = computed(() => {
  const rules: any = {
    newPassword: [
      {
        required: true,
        message: "请输入新密码",
        trigger: "blur"
      },
      { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
      { validator: validatePass, trigger: "blur" }
    ],
    confirmPassword: [
      {
        required: true,
        message: "请输入确认密码",
        trigger: "blur"
      },
      { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
      { validator: validatePass2, trigger: "blur" }
    ]
  };
  if (username.value === userStore.username) {
    rules.oldPassword = [
      {
        required: true,
        message: "请输入原密码",
        trigger: "blur"
      }
    ];
  }
  return rules;
});
const formFields = computed(() => {
  const fields: any[] = [
    {
      type: "input",
      label: "新密码",
      prop: "newPassword",
      placeholder: "请输入新密码"
    },
    {
      type: "input",
      label: "确认密码",
      prop: "confirmPassword",
      placeholder: "请输入确认密码"
    }
  ];
  if (username.value === userStore.username) {
    fields.splice(1, 0, {
      type: "input",
      label: "原密码",
      prop: "oldPassword",
      placeholder: "请输入原密码"
    });
  }
  return fields;
});
const open = (data?: any) => {
  pageData.currentData = data;
  if (data) {
    pageData.mode = "other";
  }
  pageData.modalParam.visible = true;
};
const initData = () => {
  pageData.formParam.infoForm = {};
  pageData.currentData = undefined;
  pageData.modalParam.visible = false;
};
const handleClose = () => {
  initData();
  emits("close");
};
const handleConfirm = () => {
  form.value!.validate((isValid: boolean) => {
    if (isValid) {
      if (pageData.mode === "self") {
        changePasswd();
      } else {
        resetPasswd();
      }
    }
  });
};
const changePasswd = () => {
  const data = pageData.formParam.infoForm;
  pageData.formParam.loading = true;
  $userApi
    .changePasswd(username.value, data)
    .then((res: any) => {
      if (res.success) {
        message.success("更新密码成功,下次登陆生效");
        initData();
        emits("confirm");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const resetPasswd = () => {
  const data = pageData.formParam.infoForm;
  pageData.formParam.loading = true;
  $userApi
    .resetPasswd(username.value, data)
    .then((res: any) => {
      if (res.success) {
        message.success("重置密码成功,下次登陆生效");
        initData();
        emits("confirm");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const emits = defineEmits(["close", "confirm"]);
defineExpose({
  open
});
defineOptions({
  name: "UserResetPasswd"
});
</script>

<template>
  <div>
    <el-dialog
      title="重置密码"
      v-model="pageData.modalParam.visible"
      :close-on-click-modal="pageData.modalParam.closeOnClickModal"
      width="30%"
      @close="handleClose"
    >
      <!---->
      <div class="flex justify-center items-center m-5">
        <div class="font-bold text-lg">{{ username }}</div>
      </div>
      <el-form
        :model="pageData.formParam.infoForm"
        :rules="formRules"
        ref="form"
        label-width="100px"
        class="w-full"
        v-loading="pageData.formParam.loading"
      >
        <el-form-item
          v-for="(item, index) in formFields"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template v-if="item.type === 'input'">
            <el-input
              v-model="pageData.formParam.infoForm[item.prop]"
              :placeholder="item.placeholder"
              type="password"
              show-password
              clearable
            />
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="handleClose">取消</el-button>
          <el-popconfirm
            title="确认提交?"
            @confirm="handleConfirm"
            confirm-button-text="确定"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button
                type="primary"
                plain
                v-loading="pageData.formParam.loading"
                >提 交</el-button
              >
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
