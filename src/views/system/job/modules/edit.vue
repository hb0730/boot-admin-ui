<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import SpanLoading from "/@/components/loading";
import { warnMessage } from "/@/utils/message";
import { convertType } from "/@/utils/utils";
import { jobApi } from "/@/api/system/job";

const emit = defineEmits<{ (e: "ok"); (e: "cancel") }>();
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
    group: undefined,
    isEnabled: 0
  },
  formRules: {
    name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
    group: [{ required: true, message: "请选择任务组", trigger: "change" }],
    beanName: [{ required: true, message: "请输入调用类", trigger: "blur" }],
    beanMethod: [
      { required: true, message: "请输入调用方法", trigger: "blur" }
    ],
    cron: [{ required: true, message: "请输入表达式", trigger: "blur" }]
  },
  formField: [
    {
      name: "任务名称",
      key: "name",
      type: "input",
      tips: "请输入"
    },
    {
      name: "任务分组",
      key: "group",
      valueType: "String",
      type: "select",
      tips: "请输入",
      dataList: "groupOptions"
    },
    {
      name: "调用类",
      key: "beanName",
      type: "input",
      tips: "请输入"
    },
    {
      name: "调用方法",
      key: "beanMethod",
      type: "input",
      tips: "请输入"
    },
    {
      name: "表达式",
      key: "cron",
      type: "input",
      tips: "请输入"
    },
    {
      name: "负责人",
      key: "personInCharge",
      type: "input",
      tips: "请输入"
    },
    {
      name: "警告邮箱",
      key: "email",
      type: "input",
      tips: "请输入"
    },
    {
      name: "状态",
      key: "isEnabled",
      valueType: "Number",
      type: "select-radio",
      dataList: "enabledOptions",
      tips: "请输入"
    },
    {
      name: "参数内容",
      key: "methodParams",
      type: "textarea",
      tips: "参数内容"
    },
    {
      name: "任务描述",
      key: "description",
      type: "textarea",
      tips: "任务描述"
    }
  ]
});
const open = (mode: string, data: any, dataSource: any) => {
  pageData.mode = mode;
  formParam.dataSource = dataSource;
  switch (mode) {
    case "add":
      break;
    case "edit":
      edit(data);
      break;
  }
  pageData.visible = true;
};
const edit = (data: any) => {
  formParam.formData = data;
};
const drawerClose = () => {
  initData();
};
const drawerCancel = () => {
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
const update = () => {
  const qps = {};
  const params = Object.assign(qps, formParam.formData);
  pageData.loading = true;
  jobApi
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
  const qps = {};
  const params = Object.assign(qps, formParam.formData);
  pageData.loading = true;
  jobApi
    .save(params)
    .then(res => {
      if (res !== "fail") {
        emit("ok");
        initData();
      }
    })
    .finally(() => (pageData.loading = false));
};
const initData = () => {
  pageData.visible = false;
  pageData.loading = false;
  pageData.mode = "add";
  formParam.dataSource = {};
  formParam.formData = { id: undefined, group: undefined, isEnabled: 0 };
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
                    v-model="formParam.formData[item.key]"
                    :placeholder="item.tips"
                    :max-length="item.max"
                  />
                </template>
                <template v-else-if="item.type === 'input-number'">
                  <!---->
                  <el-input-number
                    v-model="formParam.formData[item.key]"
                    controls-position="right"
                    style="width: 92.5%"
                    :placeholder="item.tips"
                    :max="item.max"
                    :min="item.min"
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
                  >
                    <el-option
                      v-for="option in formParam.dataSource[item.dataList]"
                      :key="option.value"
                      :label="option.label"
                      :value="convertType(option.value, item.valueType)"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </span-loading>
    <!---->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerCancel">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
