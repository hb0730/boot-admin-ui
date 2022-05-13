<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import { warnMessage } from "/@/utils/message";
import { deptApi } from "/@/api/system/dept";
import SpanLoading from "/@/components/loading";
const infoForm = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{ (e: "close"); (e: "ok") }>();
const props = {
  value: "id",
  label: "name",
  children: "children"
};
const pageData = reactive({
  loading: false,
  mode: "add",
  visible: false,
  title: "操作"
});
const formParam = reactive({
  formData: {
    id: undefined,
    parentId: -1,
    isEnabled: 1
  },
  dataSource: {},
  formField: [
    {
      name: "上级部门",
      key: "parentId",
      type: "treeSelect",
      showKey: "name",
      value: "id",
      dataList: "deptTree",
      tips: "请选择"
    },
    {
      name: "部门名称",
      key: "name",
      type: "input",
      required: true,
      tips: "请输入"
    },
    {
      name: "负责人",
      key: "leader",
      type: "input",
      tips: "请输入"
    },
    {
      name: "联系电话",
      key: "phone",
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
      name: "显示排序",
      key: "sort",
      type: "input-number",
      required: true,
      tips: "请输入"
    },
    {
      name: "部门状态",
      key: "isEnabled",
      type: "select-radio",
      dataList: "enabledOptions",
      tips: "请选择"
    },
    {
      name: "备注",
      key: "description",
      type: "textarea",
      tips: ""
    }
  ],
  formRules: {
    name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
    leader: [{ required: true, message: "请输入部门负责人", trigger: "blur" }],
    sort: [
      {
        type: "number",
        required: true,
        message: "请输入排序",
        trigger: "blur"
      },
      { type: "number", min: 0, message: "排序最小为0", trigger: "change" }
    ]
  }
});

const open = (mode: string, data: any, dataSource: any) => {
  pageData.mode = mode;
  switch (mode) {
    case "edit":
      edit(data);
      break;
    case "add":
      add(data);
      break;
  }
  formParam.dataSource = dataSource;
  pageData.visible = true;
};
const add = data => {
  pageData.title = "新增部门";
  if (data) {
    formParam.formData.parentId = data.id;
  } else {
    formParam.formData.parentId = -1;
  }
};
const edit = data => {
  pageData.title = "修改部门";

  formParam.formData = Object.assign(formParam.formData, data);
};
const drawerClose = () => {
  emit("close");
  initData();
};
const confirmClick = () => {
  infoForm.value!.validate(isValid => {
    if (!isValid) {
      warnMessage("表单校验失败");
      return;
    }
    switch (pageData.mode) {
      case "edit":
        update();
        break;
      case "add":
        save();
        break;
    }
  });
};
const update = async () => {
  pageData.loading = true;
  await deptApi.updateById(formParam.formData.id, formParam.formData);
  emit("ok");
  initData();
};
const save = () => {
  pageData.loading = true;
  deptApi
    .save(formParam.formData)
    .then(result => {
      if (result !== "fail") {
        emit("ok");
        initData();
      }
    })
    .finally(() => {
      pageData.loading = false;
    });
};
const initData = () => {
  pageData.visible = false;
  pageData.mode = "add";
  pageData.loading = false;
  formParam.formData = { id: undefined, isEnabled: 0, parentId: -1 };
  formParam.dataSource = {};
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
        inline
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
                    autosize
                    type="textarea"
                    style="min-height: 50px"
                    v-model="formParam.formData[item.key]"
                  />
                </template>
                <template v-else-if="item.type === 'treeSelect'">
                  <!---->
                  <el-tree-select
                    style="width: 92%"
                    v-model="formParam.formData[item.key]"
                    :data="formParam.dataSource[item.dataList]"
                    :props="props"
                    node-key="id"
                    clearable
                    check-strictly
                    filterable
                  />
                </template>
                <template v-else-if="item.type === 'select-radio'">
                  <el-radio-group v-model="formParam.formData[item.key]">
                    <el-radio
                      v-for="(item, i) in formParam.dataSource[item.dataList]"
                      :label="Number(item.value)"
                      :key="i"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
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
