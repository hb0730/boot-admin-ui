<script setup lang="ts">
import { ref } from "vue";
import { FormItem } from "./utils/types";
import { useFormRules } from "./utils/rules";
import ReCol from "@/components/ReCol";
import { usePublicHooks } from "../hooks";
const { switchStyle } = usePublicHooks();

const props = withDefaults(defineProps<FormItem>(), {
  formInline: () => ({
    id: undefined,
    jobName: "",
    jobClassName: "",
    parameter: "",
    cronExpression: "",
    enabled: true,
    description: ""
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="useFormRules(newFormInline)"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="newFormInline.jobName"
            clearable
            placeholder="请输入任务名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="任务类名" prop="jobClassName">
          <el-input
            v-model="newFormInline.jobClassName"
            clearable
            placeholder="请输入任务类名/Bean名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input
            v-model="newFormInline.cronExpression"
            clearable
            placeholder="请输入cron表达式"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="任务状态" prop="enabled">
          <el-switch
            v-model="newFormInline.enabled"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="参数内容" prop="parameter">
          <el-input
            v-model="newFormInline.parameter"
            clearable
            placeholder="请输入执行方法"
            type="textarea"
            :autosize="{ minRows: 2 }"
          />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="描述说明" prop="description">
          <el-input
            v-model="newFormInline.description"
            clearable
            placeholder="请输入描述说明"
            type="textarea"
            :autosize="{ minRows: 2 }"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
