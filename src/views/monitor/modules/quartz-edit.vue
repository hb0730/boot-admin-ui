<script setup lang="ts">
import { reactive, ref } from "vue";
import * as $quartzApi from "@/api/monitor/quartz";
import message from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { computed } from "vue";

const formRef = ref();
const cronSuccess = ref(false);
const validateCorn = (rule: any, value: any, callback: any) => {
  if (value === "") {
    showCronIcon.value = false;
    callback(new Error("请输入cron表达式"));
  } else {
    $quartzApi.checkCorn(value).then((res: any) => {
      if (res.success) {
        showCronIcon.value = true;
        callback();
      } else {
        showCronIcon.value = false;
        callback(new Error("cron表达式不正确"));
      }
    });
  }
};
const pageData: any = reactive({
  mode: "add",
  modalParam: {
    visible: false,
    title: "新增任务"
  },
  formParam: {
    infoForm: {},
    formFields: [],
    rules: {
      jobClassName: [
        { required: true, message: "请输入任务类名", trigger: "blur" }
      ],
      cronExpression: [
        { required: true, message: "请输入cron表达式", trigger: "blur" },
        { validator: validateCorn, trigger: "blur" }
      ]
    },
    loading: false
  }
});
const showCronIcon = computed({
  get: () => {
    return cronSuccess.value;
  },
  set: (val: boolean) => {
    cronSuccess.value = val;
  }
});
const open = (data: any, dataSource: any, mode: string) => {
  pageData.mode = mode;
  pageData.dataSource = dataSource;
  if (mode === "add") {
    data.status = 1;
  }
  pageData.formParam.infoForm = data;
  pageData.modalParam.visible = true;
};
const initData = () => {
  pageData.formParam.infoForm = { status: 1 };
  pageData.formParam.formFields = [];
  pageData.formParam.loading = false;
  pageData.modalParam.visible = false;
  cronSuccess.value = false;
};
const handleClose = () => {
  initData();
  emits("close");
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
  $quartzApi
    .save(pageData.formParam.infoForm)
    .then(() => {
      message.success("保存成功");
      initData();
      emits("confirm");
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const update = () => {
  pageData.formParam.loading = true;
  $quartzApi
    .update(pageData.formParam.infoForm.id, pageData.formParam.infoForm)
    .then(() => {
      message.success("修改成功");
      initData();
      emits("confirm");
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const emits = defineEmits(["close", "confirm"]);
defineOptions({
  name: "QuartzEdit"
});
defineExpose({
  open
});
</script>

<template>
  <div>
    <el-dialog
      v-model="pageData.modalParam.visible"
      :title="pageData.modalParam.title"
      :before-close="handleClose"
      destroy-on-clos
      :width="800"
      class="el-dialog-header"
    >
      <div class="el-dialog-content">
        <el-form
          :model="pageData.formParam.infoForm"
          :rules="pageData.formParam.rules"
          label-position="left"
          ref="formRef"
          style="width: 70%"
          v-loading="pageData.formParam.loading"
          label-width="100px"
        >
          <el-form-item label="任务类名" prop="jobClassName">
            <el-input
              clearable
              :max="255"
              v-model="pageData.formParam.infoForm['jobClassName']"
            />
          </el-form-item>
          <el-form-item label="cron表达式" prop="cronExpression">
            <el-input
              clearable
              :max="30"
              v-model="pageData.formParam.infoForm['cronExpression']"
            >
              <template #suffix>
                <component
                  v-if="showCronIcon"
                  :is="useRenderIcon('fa:check', { color: 'green' })"
                />
                <component
                  v-else
                  :is="useRenderIcon('fa:close', { color: 'red' })"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="参数" prop="parameter">
            <el-input
              clearable
              type="textarea"
              :max="255"
              v-model="pageData.formParam.infoForm['parameter']"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="pageData.formParam.infoForm['status']">
              <el-radio-button
                v-for="item in pageData.dataSource.statusOptions"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              clearable
              type="textarea"
              :max="255"
              v-model="pageData.formParam.infoForm['description']"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button plain @click="handleClose">取 消</el-button>
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
              >保存并安排任务</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-dialog>
  </div>
</template>
