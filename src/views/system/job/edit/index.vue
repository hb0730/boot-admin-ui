<script lang="ts">
export default {
  name: "JobEdit"
};
</script>
<script setup lang="ts">
import { ElForm } from "element-plus";
import { toRef, PropType, reactive, Ref, ref } from "vue";
import { jobApi } from "/@/api/system/job";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { Job } from "/@/api/model/monitor/job_model";
import { successMessage, warnMessage } from "/@/utils/message";
const jobRef = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const pageData = reactive({
  jobRules: {
    name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
    group: [{ required: true, message: "请选择任务组", trigger: "change" }],
    beanName: [{ required: true, message: "请输入调用类", trigger: "blur" }],
    beanMethod: [
      { required: true, message: "请输入调用方法", trigger: "blur" }
    ],
    cron: [{ required: true, message: "请输入表达式", trigger: "blur" }]
  }
});
const props = defineProps({
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  },
  position: {
    require: false,
    default: "right",
    type: String
  },
  jobInfo: Object as PropType<Job>,
  groupOptions: Array as PropType<DictEntryCache[]>,
  isEnabledOptions: Array as PropType<DictEntryCache[]>,
  isUpdate: {
    require: false,
    default: false,
    type: Boolean
  }
});
const dialogVisible = toRef(props, "dialogVisible");
const jobInfo = toRef(props, "jobInfo");
const position = toRef(props, "position");
const groupOptions: Ref<DictEntryCache[]> = toRef(props, "groupOptions");
const isUpdate = toRef(props, "isUpdate");
const isEnabledOptions: Ref<DictEntryCache[]> = toRef(
  props,
  "isEnabledOptions"
);
const handleDialogClose = () => {
  jobRef.value!.clearValidate();
  emit("refresh");
};
const handlerSave = () => {
  jobRef.value!.validate(isValid => {
    if (isValid) {
      if (isUpdate.value) {
        update();
      } else {
        save();
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const save = async () => {
  await jobApi.save(jobInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
const update = async () => {
  await jobApi.updateById(jobInfo.value.id, jobInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
</script>

<template>
  <el-dialog
    title="任务信息"
    destroy-on-close
    v-model="dialogVisible"
    :before-close="handleDialogClose"
  >
    <el-form
      label-width="auto"
      :model="jobInfo"
      :label-position="position"
      ref="jobRef"
      required-asterisk
      :rules="pageData.jobRules"
      center
    >
      <el-row>
        <el-col :span="12">
          <el-form-item required label="名称" prop="name">
            <el-input v-model="jobInfo.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required label="任务分组" prop="group">
            <el-select
              style="width: 100%"
              v-model="jobInfo.group"
              placeholder="任务分组"
              clearable
            >
              <el-option
                v-for="item in groupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item required label="调用类" prop="beanName">
            <el-input v-model="jobInfo.beanName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item required label="调用方法" prop="beanMethod">
            <el-input v-model="jobInfo.beanMethod" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item required label="表达式" prop="cron">
            <el-input v-model="jobInfo.cron" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="personInCharge">
            <el-input v-model="jobInfo.personInCharge" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="警告邮箱" prop="email">
            <el-input v-model="jobInfo.email" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="isEnabled">
            <el-radio-group v-model="jobInfo.isEnabled">
              <el-radio
                v-for="item in isEnabledOptions"
                :key="Number(item.value)"
                :label="Number(item.value)"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="任务描述" prop="description">
        <el-input
          type="textarea"
          v-model="jobInfo.description"
          placeholder="备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="参数内容" prop="methodParams">
        <el-input
          type="textarea"
          v-model="jobInfo.methodParams"
          placeholder="参数内容"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default" @click="handlerSave" type="primary"
          >保存</el-button
        >
        <el-button @click="handleDialogClose" size="default">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
