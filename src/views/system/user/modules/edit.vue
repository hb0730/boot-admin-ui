<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import SpanLoading from "/@/components/loading";
import { successMessage, warnMessage } from "/@/utils/message";
import { convertType } from "/@/utils/utils";
import { userApi } from "/@/api/system/user";

const emit = defineEmits<{ (e: "cancel"); (e: "ok") }>();
const infoForm = ref<InstanceType<typeof ElForm>>();
const pageData = reactive({
  mode: "add",
  visible: false,
  title: "操作",
  loading: false
});
const formParam = reactive({
  dataSource: {},
  formData: {
    id: undefined,
    roleIds: [],
    isEnabled: 0
  },
  formRules: {
    username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
    nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
    deptId: [{ required: true, message: "请选择所属部门", trigger: "blur" }]
  },
  formField: [
    {
      name: "用户账号",
      key: "username",
      disabled: pageData.mode === "edit",
      type: "input",
      tips: "请输入"
    },
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
      name: "所属部门",
      key: "deptId",
      type: "select-tree",
      dataList: "deptTree",
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      tips: "请输入"
    },
    {
      name: "岗位",
      key: "postIds",
      type: "select",
      label: "name",
      value: "id",
      multiple: true,
      dataList: "postOptions",
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
    },
    {
      name: "状态",
      key: "isEnabled",
      type: "select-radio",
      valueType: "Number",
      dataList: "enabledOptions",
      tips: "请输入"
    },
    {
      name: "角色",
      key: "roleIds",
      type: "select",
      label: "name",
      value: "id",
      multiple: true,
      dataList: "roleOptions",
      tips: "请输入"
    },
    {
      name: "备注",
      key: "description",
      type: "textarea",
      tips: "请输入"
    }
  ]
});
const open = (mode: string, data: any, dataSource: any) => {
  formParam.dataSource = dataSource;
  pageData.mode = mode;
  switch (mode) {
    case "add":
      add();
      break;
    case "edit":
      edit(data);
      break;
  }
  pageData.visible = true;
};
const edit = data => {
  formParam.formData = data;
  pageData.title = "修改用户";
};
const add = () => {
  pageData.title = "添加用户";
};
const drawerClose = () => {
  initData();
};
const drawerCancel = () => {
  pageData.visible = false;
  emit("cancel");
  initData();
};
const confirmClick = () => {
  infoForm.value?.validate(isValid => {
    if (isValid) {
      switch (pageData.mode) {
        case "add":
          save();
          break;
        case "edit":
          update();
          break;
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const initData = () => {
  pageData.visible = false;
  pageData.mode = "add";
  pageData.loading = false;
  formParam.dataSource = {};
  formParam.formData = { id: undefined, roleIds: [], isEnabled: 0 };
};
const update = () => {
  const params = Object.assign({}, formParam.formData);
  pageData.loading = true;
  userApi
    .updateById(params.id, params)
    .then(res => {
      if (res !== "fail") {
        emit("ok");
        initData();
      }
    })
    .finally(() => (pageData.loading = false));
};
const save = () => {
  const params = Object.assign({}, formParam.formData);
  pageData.loading = true;
  userApi
    .save(params)
    .then(res => {
      if (res !== "fail") {
        successMessage("用户更新成功,下次登录生效");
        emit("ok");
        initData();
      }
    })
    .finally(() => (pageData.loading = false));
};
defineExpose({ open });
</script>

<template>
  <el-drawer
    size="50%"
    v-model="pageData.visible"
    :title="pageData.title"
    destroy-on-close
    :close-on-click-modal="false"
    @close="drawerClose"
  >
    <span-loading v-loading="pageData.loading">
      <!--基本信息-->
      <el-form
        ref="infoForm"
        :model="formParam.formData"
        :rules="formParam.formRules"
        label-position="left"
        label-width="auto"
        label-suffix=":"
      >
        <el-row type="flex">
          <template v-for="(item, i) in formParam.formField">
            <!--eslint-disable-next-line-->
            <el-col :span="12">
              <el-form-item
                :key="i"
                :ref="item.key"
                :prop="item.key"
                label-width="auto"
                :label="item.name"
              >
                <!---->
                <template v-if="item.type === 'input'">
                  <el-input
                    v-if="item.key === 'username'"
                    v-model="formParam.formData[item.key]"
                    :placeholder="item.tips"
                    :max-length="item.max"
                    :disabled="pageData.mode === 'edit'"
                  />
                  <el-input
                    v-else
                    v-model="formParam.formData[item.key]"
                    :placeholder="item.tips"
                    :max-length="item.max"
                    :disabled="item.disabled"
                  />
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <el-input
                    type="textarea"
                    :rows="5"
                    v-model="formParam.formData[item.key]"
                  />
                </template>
                <template v-else-if="item.type === 'select-radio'">
                  <el-radio-group v-model="formParam.formData[item.key]">
                    <el-radio
                      v-for="option in formParam.dataSource[item.dataList]"
                      :label="convertType(option.value, item.valueType)"
                      :key="option.value"
                      >{{ option.label }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select
                    v-model="formParam.formData[item.key]"
                    :placeholder="item.tips"
                    style="width: 100%"
                    clearable
                    filterable
                    :multiple="item.multiple"
                  >
                    <el-option
                      v-for="option in formParam.dataSource[item.dataList]"
                      :key="option[item.value]"
                      :label="option[item.label]"
                      :value="convertType(option[item.value], item.valueType)"
                    />
                  </el-select>
                </template>
                <template v-else-if="item.type === 'select-tree'">
                  <el-tree-select
                    style="width: 100%"
                    v-model="formParam.formData[item.key]"
                    :data="formParam.dataSource[item.dataList]"
                    :props="item.props"
                    node-key="id"
                    clearable
                    check-strictly
                    filterable
                  />
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </span-loading>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerCancel">取消</el-button>
        <el-button
          :disabled="formParam.formData.isAdmin === 1"
          type="primary"
          @click="confirmClick"
          >确认</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
