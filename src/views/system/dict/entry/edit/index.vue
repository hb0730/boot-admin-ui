<script lang="ts">
export default { name: "DictEntryEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref } from "vue";
import { Dict, DictEntry } from "/@/api/model/dict_model";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { dictEntryApi } from "/@/api/dist_entry";
import { Result } from "/@/api/model/domain";
const dictEntryFormRef = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const pageData = reactive({
  dictEntryRules: {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    value: [{ required: true, message: "请输入值", trigger: "blur" }]
  }
});
const props = defineProps({
  dictEntryInfo: Object as PropType<DictEntry>,
  dictInfo: Object as PropType<Dict>,
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  },
  position: {
    require: false,
    default: "right",
    type: String
  }
});
const dialogVisible = toRef(props, "dialogVisible");
const dictInfo = toRef(props, "dictInfo");
const dictEntryInfo = toRef(props, "dictEntryInfo");
const position = toRef(props, "position");
const isUpdate = toRef(props, "isUpdate");
const handleDialogClose = () => {
  dictEntryFormRef.value!.clearValidate();
  emit("refresh");
};
const handlerSave = () => {
  dictEntryFormRef.value!.validate(isValid => {
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
  const result: Result<string> = await dictEntryApi.save(dictEntryInfo.value);
  if (result.code === "0") {
    successMessage("保存成功");
    handleDialogClose();
  } else {
    warnMessage(result.message);
  }
};
const update = async () => {
  const result: Result<string> = await dictEntryApi.updateById(
    dictEntryInfo.value.id,
    dictEntryInfo.value
  );
  if (result.code === "0") {
    successMessage("保存成功");
    handleDialogClose();
  } else {
    warnMessage(result.message);
  }
};
</script>

<template>
  <el-dialog
    title="字典项信息"
    destroy-on-close
    v-model="dialogVisible"
    :before-close="handleDialogClose"
  >
    <el-form
      label-width="auto"
      :model="dictEntryInfo"
      :label-position="position"
      ref="dictEntryFormRef"
      required-asterisk
      :rules="pageData.dictEntryRules"
      center
    >
      <el-form-item label="字典: " prop="parentId">
        <el-input :disabled="true" v-model="dictInfo.name" clearable></el-input>
      </el-form-item>
      <el-form-item required label="名称: " prop="name">
        <el-input v-model="dictEntryInfo.name" clearable></el-input>
      </el-form-item>
      <el-form-item required label="值: " prop="value">
        <el-input v-model="dictEntryInfo.value" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序: " prop="sort">
        <el-input-number
          style="width: 100%"
          controls-position="right"
          v-model="dictEntryInfo.sort"
          placeholder="排序"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="备注: " prop="description">
        <el-input
          type="textarea"
          v-model="dictEntryInfo.description"
          placeholder="备注"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlerSave" size="default"
          >保存</el-button
        >
        <el-button size="default" @click="handleDialogClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
