<script setup lang="ts">
import type { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import SpanLoading from "/@/components/loading";
import { warnMessage } from "/@/utils/message";
import { postApi } from "/@/api/system/post";
import { convertType } from "/@/utils/utils";
const infoForm = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{ (e: "close"): void; (e: "ok"): void }>();
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
    isEnabled: 1,
    sort: 999
  },
  formRules: {
    name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
    number: [{ required: true, message: "请输入岗位编码", trigger: "blur" }]
  },
  formField: [
    {
      name: "岗位编码",
      key: "number",
      type: "input",
      tips: "请输入"
    },
    { name: "岗位名称", key: "name", type: "input", tips: "请输入" },
    {
      name: "岗位状态",
      key: "isEnabled",
      type: "select-radio",
      valueType: "Number",
      dataList: "enabledOptions",
      tips: "请选择"
    },
    {
      name: "显示排序",
      key: "sort",
      type: "input-number",
      required: true,
      tips: "请输入"
    },
    {
      name: "备注",
      key: "description",
      type: "textarea",
      tips: ""
    }
  ]
});
const open = (mode: string, data: any, dataSource: any) => {
  pageData.mode = mode;
  switch (mode) {
    case "add":
      add();
      break;
    case "edit":
      edit(data);
      break;
  }
  formParam.dataSource = dataSource;
  pageData.visible = true;
};
const edit = data => {
  formParam.formData = data;
};
const add = () => {
  // formParam.formData = { id: undefined, isEnabled: 1, sort: 999 };
};
const drawerClose = () => {
  initPageData();
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
  postApi
    .updateById(params.id, params)
    .then(res => {
      if (res !== "fail") {
        emit("ok");
        initPageData();
      }
    })
    .finally(() => {
      pageData.loading = false;
    });
};
const save = () => {
  const qps = {};
  const params = Object.assign(qps, formParam.formData);
  pageData.loading = true;
  postApi
    .save(params)
    .then(res => {
      if (res !== "fail") {
        emit("ok");
        initPageData();
      }
    })
    .finally(() => {
      pageData.loading = false;
    });
};
const initPageData = () => {
  pageData.visible = false;
  pageData.mode = "add";
  pageData.loading = false;
  formParam.dataSource = {};
  formParam.formData = { id: undefined, isEnabled: 1, sort: 999 };
};
defineExpose({ open });
</script>

<template>
  <!---->
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
        <!---->
        <template v-for="item in formParam.formField">
          <!--eslint-disable-next-line-->
          <el-form-item
            :ref="item.key"
            :prop="item.key"
            label-width="auto"
            :label="item.name"
          >
            <template v-if="item.type === 'input'">
              <el-input
                v-model="formParam.formData[item.key]"
                :placeholder="item.tips"
                :max-length="item.max"
                :min-length="item.min"
              />
            </template>
            <template v-if="item.type === 'input-number'">
              <el-input-number
                v-model="formParam.formData[item.key]"
                controls-position="right"
                style="width: 100%"
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
          </el-form-item>
        </template>
      </el-form>
    </span-loading>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerClose">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
