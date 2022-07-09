<script lang="ts">
export default { name: "DictEntryEdit" };
</script>
<script setup lang="ts">
import { toRef, reactive, ref } from "vue";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { dictEntryApi } from "/@/api/system/dist_entry";
import SpanLoading from "/@/components/loading";
const dictEntryFormRef = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const pageData = reactive({
  loading: false,
  dictEntryRules: {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    value: [{ required: true, message: "请输入值", trigger: "blur" }]
  },
  dataSource: {},
  dictEntryInfo: {},
  dictInfo: {},
  isUpdate: false,
  dialogVisible: false
});
const props = defineProps({
  position: {
    require: false,
    default: "right",
    type: String
  }
});
const position = toRef(props, "position");
const handleDialogClose = () => {
  pageData.dialogVisible = false;
  dictEntryFormRef.value!.clearValidate();
  emit("refresh");
  // pageData.isUpdate = false;
  // pageData.dataSource = {};
  // pageData.dictEntryInfo = {};
  // pageData.dictInfo = {};
};
const open = (
  mode: string,
  info: Object,
  dictInfo: Object,
  dataSource: Object
) => {
  if (mode === "update") {
    pageData.isUpdate = true;
  } else {
    pageData.isUpdate = false;
  }
  pageData.dictInfo = dictInfo;
  pageData.dictEntryInfo = info;
  pageData.dataSource = dataSource;
  pageData.dialogVisible = true;
};
const handlerSave = () => {
  dictEntryFormRef.value!.validate((isValid, fields) => {
    if (isValid) {
      if (pageData.isUpdate) {
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
  pageData.loading = true;
  dictEntryApi
    .save(pageData.dictEntryInfo)
    .then(res => {
      if (res !== "fail") {
        successMessage("保存成功");
        handleDialogClose();
      }
    })
    .finally(() => (pageData.loading = false));
};
const update = async () => {
  pageData.loading = true;
  dictEntryApi
    .updateById(pageData.dictEntryInfo.id, pageData.dictEntryInfo)
    .then(res => {
      if (res !== "fail") {
        successMessage("保存成功");
        handleDialogClose();
      }
    })
    .finally(() => (pageData.loading = false));
};
defineExpose({ open });
</script>

<template>
  <el-dialog
    title="字典项信息"
    destroy-on-close
    v-model="pageData.dialogVisible"
    :before-close="handleDialogClose"
  >
    <span-loading v-loading="pageData.loading">
      <el-form
        label-width="auto"
        :model="pageData.dictEntryInfo"
        :label-position="position"
        ref="dictEntryFormRef"
        required-asterisk
        :rules="pageData.dictEntryRules"
        center
      >
        <el-form-item label="字典: " prop="parentId">
          <el-input
            :disabled="true"
            v-model="pageData.dictInfo.name"
            clearable
          />
        </el-form-item>
        <el-form-item required label="名称: " prop="name">
          <el-input v-model="pageData.dictEntryInfo.name" clearable />
        </el-form-item>
        <el-form-item required label="值: " prop="value">
          <el-input v-model="pageData.dictEntryInfo.value" clearable />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio-group v-model="pageData.dictEntryInfo.isEnabled">
            <el-radio
              v-for="(item, i) in pageData.dataSource.enabledOptions"
              :label="Number(item.value)"
              :key="i"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="pageData.dictEntryInfo.sort"
            placeholder="排序"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注: " prop="description">
          <el-input
            type="textarea"
            v-model="pageData.dictEntryInfo.description"
            placeholder="备注"
            clearable
          />
        </el-form-item>
      </el-form>
    </span-loading>

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
