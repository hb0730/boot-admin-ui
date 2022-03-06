<script setup lang="ts">
import { ElForm } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { userApi } from "/@/api/system/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { dictStoreHook } from "/@/store/modules/dict";
import { successMessage, warnMessage } from "/@/utils/message";
import { cookies } from "/@/utils/storage/cookie";
const userPasswordForm = ref<InstanceType<typeof ElForm>>();
const userInfoForm = ref<InstanceType<typeof ElForm>>();

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value == pageData.userPasswordInfo.oldPassword) {
    callback(new Error("原密码与新密码一致"));
  } else {
    if (pageData.userPasswordInfo.newPassword2 !== "") {
      userPasswordForm.value!.validateField("newPassword2", () => {});
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== pageData.userPasswordInfo.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const pageData = reactive({
  position: "left",
  activeName: "userInfo",
  userInfo: {
    id: "",
    username: "",
    nickName: "",
    gender: 1,
    phoneNumber: "",
    avatar: "",
    email: ""
  },
  userInfoRules: {
    nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }]
  },
  userPasswordInfo: {
    oldPassword: "",
    newPassword: "",
    newPassword2: ""
  },
  passwordRules: {
    oldPassword: [
      {
        required: true,
        message: "请输入原密码",
        trigger: "blur"
      }
    ],
    newPassword: [{ validator: validatePass, trigger: "blur" }],
    newPassword2: [{ validator: validatePass2, trigger: "blur" }]
  },
  genders: []
});
const handleClick = (tab, _) => {
  if (tab.paneName == "userInfo") {
    userPasswordForm.value!.resetFields();
  } else {
    userInfoForm.value!.resetFields();
  }
};
const getDict = () => {
  pageData.genders = dictStoreHook().getEntry("sys_user_gender");
};
const getCurrentUserInfo = async () => {
  const userId = cookies.get("uuid");
  pageData.userInfo = await userApi.userInfo(userId);
};
const resetForm = (name: string) => {
  if (name == "info") {
    getCurrentUserInfo();
  } else {
    pageData.userPasswordInfo = {
      oldPassword: "",
      newPassword: "",
      newPassword2: ""
    };
    userPasswordForm.value!.resetFields();
  }
};
const updateInfo = () => {
  userInfoForm.value!.validate(async isValid => {
    if (isValid) {
      let userId = cookies.get("uuid");
      await userApi.updateUserInfoById(userId, pageData.userInfo);
      successMessage("修改成功");
      getCurrentUserInfo();
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const settingPassword = () => {
  userPasswordForm.value.validate(async isValid => {
    if (isValid) {
      const userId = cookies.get("uuid");
      await userApi.updatePassword(userId, pageData.userPasswordInfo);
      successMessage("修改成功,下次登录生效");
    } else {
      warnMessage("表单校验失败");
    }
  });
};
onMounted(() => {
  getDict();
  getCurrentUserInfo();
});
</script>

<template>
  <div>
    <el-tabs
      v-model="pageData.activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="用户设置" stretch name="userInfo">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userInfoForm"
              :model="pageData.userInfo"
              required-asterisk
              :rules="pageData.userInfoRules"
              :label-position="pageData.position"
              label-width="auto"
              size="large"
              center
            >
              <el-form-item prop="nickName" required label="昵称">
                <el-input
                  v-model="pageData.userInfo.nickName"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="phoneNumber">
                <el-input
                  v-model="pageData.userInfo.phoneNumber"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="pageData.userInfo.email"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="性別" prop="gender">
                <el-radio-group v-model="pageData.userInfo.gender">
                  <el-radio
                    v-for="item in pageData.genders"
                    :key="item.value"
                    :label="Number(item.value)"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateInfo"
                  :icon="useRenderIcon('fa fa-check')"
                  >更新</el-button
                >
                <el-button
                  type="info"
                  @click="resetForm('info')"
                  :icon="useRenderIcon('fa fa-reply-all')"
                >
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="密码设置" name="passwrod">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userPasswordForm"
              :model="pageData.userPasswordInfo"
              required-asterisk
              :label-position="pageData.position"
              :rules="pageData.passwordRules"
              label-width="auto"
              size="large"
              center
            >
              <el-form-item label="原密码" required prop="oldPassword">
                <el-input
                  v-model="pageData.userPasswordInfo.oldPassword"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword" label="新密码">
                <el-input
                  type="password"
                  v-model="pageData.userPasswordInfo.newPassword"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword2" label="确认密码">
                <el-input
                  type="password"
                  v-model="pageData.userPasswordInfo.newPassword2"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="settingPassword"
                  :icon="useRenderIcon('fa fa-check')"
                >
                  提交
                </el-button>
                <el-button
                  @click="resetForm('passwordForm')"
                  :icon="useRenderIcon('fa fa-reply-all')"
                  type="info"
                >
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped></style>
