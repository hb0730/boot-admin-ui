<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import ReSegmented from "@/components/ReSegmented";
import { RoleEnableOptions } from "./utils/enums";
import { setFormRule } from "./utils/rules";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    name: "",
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
    :rules="setFormRule(newFormInline)"
    label-width="82px"
  >
    <el-form-item label="角色标识" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入角色标识"
        :disabled="!!newFormInline.id"
      />
    </el-form-item>

    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="角色状态" prop="enabled">
      <ReSegmented
        v-model="newFormInline.enabled"
        :options="RoleEnableOptions"
        @change="
          ({ option: { value } }) => {
            newFormInline.enabled = value;
          }
        "
      />
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
