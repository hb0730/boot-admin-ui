<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import * as $userApi from "@/api/sys/user";
import message from "@/utils/message";
const formRef = ref();

const checkUsername = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入帐号"));
  } else {
    if (pageData.mode === "add") {
      $userApi.hashUsername(value).then((res: any) => {
        if (res.success) {
          if (res.result) {
            callback(new Error("帐号已存在，请重新输入"));
          } else {
            callback();
          }
        } else {
          callback(new Error("帐号已存在，请重新输入"));
        }
      });
    }
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== pageData.formParam.infoForm.password) {
    callback(new Error("两次输入密码不正确"));
  } else {
    callback();
  }
};
const pageData: any = reactive({
  mode: "add",
  modalParam: {
    visible: false,
    title: "用户新增",
    closeOnclickModal: true
  },
  formParam: {
    formFields: [
      {
        type: "select",
        label: "所属机构",
        prop: "orgId",
        placeholder: "请选择所属机构",
        dataSourceKey: "orgList",
        options: {
          filterable: true,
          keys: {
            prop: "id",
            value: "id",
            label: "name"
          }
        }
      },
      {
        type: "input",
        label: "帐号",
        prop: "username",
        placeholder: "请输入帐号"
      },
      {
        type: "input",
        label: "姓名",
        prop: "nickname",
        placeholder: "请输入姓名"
      },
      {
        type: "input",
        label: "密码",
        prop: "password",
        placeholder: "请输入密码",
        options: {
          type: "password",
          showPassword: true
        }
      },
      {
        type: "input",
        label: "确认密码",
        prop: "confirmPassword",
        placeholder: "请输入确认密码",
        options: {
          type: "password",
          showPassword: true
        }
      },
      {
        type: "input",
        label: "联系电话",
        prop: "phone",
        placeholder: "请输入联系电话"
      },
      {
        type: "input",
        label: "邮箱",
        prop: "email",
        placeholder: "请输入邮箱"
      },
      {
        type: "select",
        label: "分配角色",
        prop: "roleIds",
        placeholder: "请选择分配角色",
        dataSourceKey: "roleList",
        options: {
          filterable: true,
          multiple: true,
          keys: {
            prop: "id",
            value: "id",
            label: "roleName"
          }
        }
      },
      {
        type: "select",
        label: "状态",
        prop: "isEnabled",
        placeholder: "请选择",
        dataSourceKey: "enabledOptions",
        options: {
          keys: {
            label: "label",
            value: "value",
            prop: "value"
          },
          filterable: true
        }
      }
    ],
    infoForm: {},
    rules: {
      orgId: [{ required: true, message: "请选择所属机构", trigger: "change" }],
      username: [
        { required: true, message: "请输入帐号", trigger: "blur" },
        { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" },
        { validator: checkUsername, trigger: "blur" },
        {
          pattern: /^[a-zA-Z0-9]{4,20}$/,
          message: "只能输入4-20个字母、数字",
          trigger: "blur"
        }
      ],
      nickname: [
        { required: true, message: "请输入姓名", trigger: "blur" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
      ],
      phone: [
        {
          pattern: /^1[3456789]\d{9}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }
      ],
      email: [
        {
          pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
          message: "请输入正确的邮箱",
          trigger: "blur"
        }
      ],
      enabled: [{ required: true, message: "请选择状态", trigger: "change" }],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
      ],
      confirmPassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
        { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
        { validator: validatePass2, trigger: "blur" }
      ]
    },
    loading: false
  },
  dataSource: {
    orgList: [],
    enabledOptions: [],
    roleList: []
  }
});
const showFormItem = computed(() => (item: any) => {
  if (pageData.mode === "add") {
    return true;
  }
  return item.prop !== "confirmPassword" && item.prop !== "password";
});
const formFields = computed(() => {
  const fields: any[] = [
    {
      type: "select",
      label: "所属机构",
      prop: "orgId",
      placeholder: "请选择所属机构",
      dataSourceKey: "orgList",
      options: {
        filterable: true,
        keys: {
          prop: "id",
          value: "id",
          label: "name"
        }
      }
    },
    {
      type: "input",
      label: "帐号",
      prop: "username",
      placeholder: "请输入帐号"
    },
    {
      type: "input",
      label: "姓名",
      prop: "nickname",
      placeholder: "请输入姓名"
    },

    {
      type: "input",
      label: "联系电话",
      prop: "phone",
      placeholder: "请输入联系电话"
    },
    {
      type: "input",
      label: "邮箱",
      prop: "email",
      placeholder: "请输入邮箱"
    },
    {
      type: "select",
      label: "分配角色",
      prop: "roleIds",
      placeholder: "请选择分配角色",
      dataSourceKey: "roleList",
      options: {
        filterable: true,
        multiple: true,
        keys: {
          prop: "id",
          value: "id",
          label: "roleName"
        }
      }
    },
    {
      type: "select",
      label: "状态",
      prop: "isEnabled",
      placeholder: "请选择",
      dataSourceKey: "enabledOptions",
      options: {
        keys: {
          label: "label",
          value: "value",
          prop: "value"
        },
        filterable: true
      }
    }
  ];
  if (pageData.mode === "add") {
    fields.splice(
      3,
      0,
      {
        type: "input",
        label: "密码",
        prop: "password",
        placeholder: "请输入密码",
        options: {
          type: "password",
          showPassword: true
        }
      },
      {
        type: "input",
        label: "确认密码",
        prop: "confirmPassword",
        placeholder: "请输入确认密码",
        options: {
          type: "password",
          showPassword: true
        }
      }
    );
  }
  return fields;
});
const formRules = computed(() => {
  const rule: any = {
    orgId: [{ required: true, message: "请选择所属机构", trigger: "change" }],
    username: [
      { required: true, message: "请输入帐号", trigger: "blur" },
      { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" },

      {
        pattern: /^[a-zA-Z0-9]{4,20}$/,
        message: "只能输入4-20个字母、数字",
        trigger: "blur"
      }
    ],
    nickname: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
    ],
    phone: [
      {
        pattern: /^1[3456789]\d{9}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ],
    email: [
      {
        pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
        message: "请输入正确的邮箱",
        trigger: "blur"
      }
    ],
    enabled: [{ required: true, message: "请选择状态", trigger: "change" }]
  };

  if (pageData.mode === "add") {
    rule["password"] = [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
    ];
    rule["confirmPassword"] = [
      { required: true, message: "请输入确认密码", trigger: "blur" },
      { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
      { validator: validatePass2, trigger: "blur" }
    ];
    rule.username.push({
      validator: checkUsername,
      trigger: "blur"
    });
  }

  return rule;
});
const disabledFields = computed(() => (item: any) => {
  if (pageData.mode === "add") {
    return false;
  }
  if (pageData.mode === "detail") {
    return true;
  }
  return item.prop === "orgId" || item.prop === "username";
});
const showBtn = computed(() => {
  if (pageData.mode === "detail") {
    return false;
  }
  return true;
});
const queryUserRoleId = () => {
  if (!pageData.formParam.infoForm.id) {
    return;
  }
  $userApi.queryRoleIds(pageData.formParam.infoForm.id).then((res: any) => {
    if (res.success) {
      pageData.formParam.infoForm.roleIds = res.result;
    }
  });
};
const open = (infoForm: any, dataSource: any, mode: string) => {
  pageData.mode = mode;
  pageData.formParam.infoForm = infoForm;
  pageData.dataSource = dataSource;
  if (mode !== "add") {
    queryUserRoleId();
  }
  if (mode === "detail") {
    pageData.modalParam.closeOnclickModal = true;
  } else {
    pageData.modalParam.closeOnclickModal = false;
  }
  pageData.modalParam.visible = true;
};
const initData = () => {
  pageData.formParam.infoForm = { isEnabled: 1 };
  pageData.formParam.loading = false;
  pageData.modalParam.closeOnclickModal = true;
  pageData.mode = "add";
  pageData.modalParam.visible = false;
};
const _handleClose = () => {
  initData();
  emits("close");
};
const handleCancel = () => {
  pageData.modalParam.visible = false;
};
const handleConfirm = () => {
  formRef.value!.validate((isValid: boolean) => {
    if (isValid) {
      if (pageData.mode === "add") {
        save();
      } else {
        update();
      }
    }
  });
};
const save = () => {
  pageData.formParam.loading = true;
  const params = pageData.formParam.infoForm;
  $userApi
    .save(params)
    .then((res: any) => {
      if (res.success) {
        initData();
        emits("confirm");
        message.success("保存成功");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const update = () => {
  pageData.formParam.loading = true;
  const params = pageData.formParam.infoForm;
  $userApi
    .update(params.id, params)
    .then((res: any) => {
      if (res.success) {
        initData();
        emits("confirm");
        message.success("保存成功");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
defineOptions({
  name: "UserEdit"
});
const emits = defineEmits(["close", "confirm"]);
defineExpose({ open });
</script>

<template>
  <div>
    <el-drawer
      v-model="pageData.modalParam.visible"
      :title="pageData.modalParam.title"
      destroy-on-close
      modal
      :close-on-click-modal="pageData.modalParam.closeOnclickModal"
      :before-close="_handleClose"
    >
      <template #header>
        <span style="font-weight: 700">{{ pageData.modalParam.title }}</span>
      </template>
      <el-form
        :model="pageData.formParam.infoForm"
        :rules="formRules"
        label-position="left"
        ref="formRef"
        v-loading="pageData.formParam.loading"
      >
        <el-form-item
          v-for="(item, index) in formFields"
          :label="item.label"
          :prop="item.prop"
          :key="index"
          class="form-row"
          v-show="showFormItem(item)"
        >
          <template v-if="item.type === 'input'">
            <el-input
              v-model="pageData.formParam.infoForm[item.prop]"
              clearable
              :type="item.options?.type ?? 'text'"
              :show-password="item.options?.showPassword ?? false"
              :disabled="disabledFields(item)"
            />
          </template>
          <template v-if="item.type === 'select'">
            <el-select
              style="width: 1000%"
              v-model="pageData.formParam.infoForm[item.prop]"
              :clearable="item.options?.clearable ?? false"
              :filterable="item.options?.filterable ?? false"
              :multiple="item.options?.multiple ?? false"
              :disabled="disabledFields(item)"
            >
              <el-option
                v-for="val in pageData.dataSource[item.dataSourceKey]"
                :label="val[item.options?.keys?.label ?? 'label']"
                :key="val[item.options?.keys?.value ?? 'value']"
                :value="val[item.options?.keys?.value ?? 'value']"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-popconfirm
          title="确定放弃编辑？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleCancel"
        >
          <template #reference>
            <el-button v-show="showBtn" plain>取 消</el-button>
          </template>
        </el-popconfirm>
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
              v-show="showBtn"
              v-loading="pageData.formParam.loading"
              >提 交</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
