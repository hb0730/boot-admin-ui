<script setup lang="ts">
import { ElForm } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { userApi } from "/@/api/system/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { dictStoreHook } from "/@/store/modules/dict";
import { successMessage, warnMessage } from "/@/utils/message";
import { cookies } from "/@/utils/storage/cookie";
import SpanLoading from "/@/components/loading";
import { UpdatePassword, UserInfo } from "/@/api/model/system/user_model";
import { convertType } from "/@/utils/utils";
import { confirm } from "/@/utils/message/box";

const passwordInfoForm = ref<InstanceType<typeof ElForm>>();
const userInfoForm = ref<InstanceType<typeof ElForm>>();
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value == passwordInfoParam.formData.oldPassword) {
    callback(new Error("原密码与新密码一致"));
  } else {
    if (passwordInfoParam.formData.newPassword2 !== "") {
      passwordInfoForm.value!.validateField("newPassword2", () => {});
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== passwordInfoParam.formData.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const pageData = reactive({
  activeName: "userInfo"
});
const userInfoParam = reactive({
  loading: false,
  formData: {},
  formRules: {
    nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }]
  },
  dataSource: {
    genderOptions: []
  },
  formField: [
    {
      name: "用户昵称",
      key: "nickName",
      type: "input",
      tips: "请输入"
    },
    {
      name: "手机号",
      key: "phonenumber",
      type: "input",
      tips: "请输入"
    },
    {
      name: "邮箱",
      key: "email",
      type: "input",
      tips: "请输入"
    },
    {
      name: "性别",
      key: "gender",
      type: "select",
      label: "label",
      value: "value",
      valueType: "Number",
      multiple: false,
      dataList: "genderOptions",
      tips: "请输入"
    }
  ]
});
const passwordInfoParam = reactive({
  loading: false,
  formData: {},
  formRules: {
    oldPassword: [
      {
        required: true,
        message: "请输入原密码",
        trigger: "blur"
      }
    ],
    newPassword: [
      {
        required: true,
        message: "请输入新密码",
        trigger: "blur"
      },
      { validator: validatePass, trigger: "blur" }
    ],
    newPassword2: [
      {
        required: true,
        message: "请再次确认密码",
        trigger: "blur"
      },
      { validator: validatePass2, trigger: "blur" }
    ]
  },
  formField: [
    {
      name: "原密码",
      key: "oldPassword",
      type: "input",
      tips: "请输入"
    },
    {
      name: "新密码",
      key: "newPassword",
      type: "input",
      tips: "请输入"
    },
    {
      name: "确认密码",
      key: "newPassword2",
      type: "input",
      tips: "请输入"
    }
  ]
});

const getDict = () => {
  userInfoParam.dataSource.genderOptions =
    dictStoreHook().getEntry("sys_user_gender");
};
const getCurrentUserInfo = () => {
  const userId = cookies.get("uuid");
  userInfoParam.loading = true;
  userApi
    .userInfo(userId)
    .then((res: UserInfo | string) => {
      if (res !== "fail") {
        userInfoParam.formData = res;
      }
    })
    .finally(() => (userInfoParam.loading = false));
};
const handlerTabChange = (mode: string) => {
  handlerReset(mode);
};
const handlerReset = (mode: string) => {
  switch (mode) {
    case "userInfo":
      getCurrentUserInfo();
      break;
    case "password":
      passwordInfoForm.value?.clearValidate();
      passwordInfoParam.formData = {
        oldPassword: undefined,
        newPassword: undefined,
        newPassword2: undefined
      };
      break;
  }
};
const handlerUpdate = (mode: string) => {
  switch (mode) {
    case "userInfo":
      userInfoUpdate();
      break;
    case "password":
      passwordUpdate();
      break;
  }
};
const userInfoUpdate = () => {
  userInfoForm.value?.validate(isValid => {
    if (isValid) {
      confirm("是否更新当前用户信息")
        .then(() => {
          userInfoParam.loading = true;
          let userId = cookies.get("uuid");
          userApi
            .updateUserInfoById(userId, userInfoParam.formData as UserInfo)
            .then(res => {
              if (res !== "fail") {
                successMessage("更新成功，下次登录生效!");
                getCurrentUserInfo();
              }
            })
            .finally(() => {});
        })
        .catch(() => {});
    } else {
      warnMessage("表单校验失败!");
    }
  });
};
const passwordUpdate = () => {
  passwordInfoForm.value?.validate(isValid => {
    if (isValid) {
      confirm("是否更新当前用户密码")
        .then(() => {
          passwordInfoParam.loading = true;
          let userId = cookies.get("uuid");
          userApi
            .updatePassword(
              userId,
              passwordInfoParam.formData as UpdatePassword
            )
            .then(res => {
              if (res !== "fail") {
                successMessage("更新成功，下次登录生效!");
                getCurrentUserInfo();
              }
            })
            .finally(() => {});
        })
        .catch(() => {});
    } else {
      warnMessage("表单校验失败!");
    }
  });
};
onMounted(() => {
  getDict();
  getCurrentUserInfo();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <el-tabs v-model="pageData.activeName" @tab-change="handlerTabChange">
      <el-tab-pane label="用户设置" stretch name="userInfo">
        <!---->
        <span-loading v-loading="userInfoParam.loading">
          <el-row :gutter="24">
            <el-col :span="12" :offset="6">
              <el-form
                ref="userInfoForm"
                :model="userInfoParam.formData"
                :rules="userInfoParam.formRules"
                label-position="left"
                label-width="auto"
                label-suffix=":"
              >
                <template v-for="item in userInfoParam.formField">
                  <!--eslint-disable-next-line-->
                  <el-form-item
                    :ref="item.key"
                    :prop="item.key"
                    label-width="auto"
                    :label="item.name"
                  >
                    <!---->
                    <template v-if="item.type === 'input'">
                      <el-input
                        v-model="userInfoParam.formData[item.key]"
                        :placeholder="item.tips"
                        :max-length="item.max"
                        :disabled="item.disabled"
                      />
                    </template>
                    <template v-else-if="item.type === 'select'">
                      <el-select
                        v-model="userInfoParam.formData[item.key]"
                        :placeholder="item.tips"
                        style="width: 100%"
                        clearable
                        filterable
                        :multiple="item.multiple"
                      >
                        <el-option
                          v-for="option in userInfoParam.dataSource[
                            item.dataList
                          ]"
                          :key="option[item.value]"
                          :label="option[item.label]"
                          :value="
                            convertType(option[item.value], item.valueType)
                          "
                        />
                      </el-select>
                    </template>
                  </el-form-item>
                </template>
                <!---->
              </el-form>
              <el-col :span="12" :offset="6">
                <div class="button-group">
                  <el-button
                    type="primary"
                    :icon="useRenderIcon('fa-check')"
                    @click="handlerUpdate('userInfo')"
                    >更新</el-button
                  >
                  <el-button
                    type="info"
                    :icon="useRenderIcon('fa:reply-all')"
                    @click="handlerReset('userInfo')"
                    >重置</el-button
                  >
                </div>
              </el-col>
            </el-col>
          </el-row>
        </span-loading>
      </el-tab-pane>
      <el-tab-pane label="密码设置" name="passwrod">
        <!--password-->
        <!---->
        <span-loading v-loading="passwordInfoParam.loading">
          <el-row :gutter="24">
            <el-col :span="12" :offset="6">
              <el-form
                ref="passwordInfoForm"
                :model="passwordInfoParam.formData"
                :rules="passwordInfoParam.formRules"
                label-position="left"
                label-width="auto"
                label-suffix=":"
              >
                <!---->
                <template v-for="item in passwordInfoParam.formField">
                  <!--eslint-disable-next-line-->
                  <el-form-item
                    :ref="item.key"
                    :prop="item.key"
                    label-width="auto"
                    :label="item.name"
                  >
                    <!---->
                    <template v-if="item.type === 'input'">
                      <el-input
                        type="password"
                        show-password
                        v-model="passwordInfoParam.formData[item.key]"
                        :placeholder="item.tips"
                        :max-length="item.max"
                      />
                    </template>
                  </el-form-item>
                </template>
              </el-form>
              <el-col :span="12" :offset="6">
                <div class="button-group">
                  <el-button
                    type="primary"
                    :icon="useRenderIcon('fa-check')"
                    @click="handlerUpdate('password')"
                    >更新</el-button
                  >
                  <el-button
                    type="info"
                    :icon="useRenderIcon('fa:reply-all')"
                    @click="handlerReset('password')"
                    >重置</el-button
                  >
                </div>
              </el-col>
            </el-col>
          </el-row>
        </span-loading>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped lang="scss">
.button-group {
  padding: 20px 0;

  button {
    margin: 0 20px;
  }
}
</style>
