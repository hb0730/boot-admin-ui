<script lang="ts">
export default { name: "DictParentEdit" };
</script>
<script setup lang="ts">
import { toRef, reactive, ref } from "vue";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { dictApi } from "/@/api/system/dict";
import SpanLoading from "/@/components/loading";
const permission = reactive({
  update: ["dict:save", "dict:update"]
});
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const dictFormRef = ref<InstanceType<typeof ElForm>>();
const pageData = reactive({
  loading: false,
  dictRules: {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    type: [{ required: true, message: "请输入类型", trigger: "blur" }]
  },
  dialogVisible: false,
  isUpdate: false,
  info: {},
  dataSource: {}
});
const props = defineProps({
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  },
  position: {
    require: false,
    default: "left",
    type: String
  }
});
const position = toRef(props, "position");
const open = (mode: string, data: Object, dataSource: Object) => {
  if (mode == "update") {
    pageData.isUpdate = true;
  } else {
    pageData.isUpdate = false;
  }
  pageData.info = data;
  pageData.dataSource = dataSource;
  pageData.dialogVisible = true;
};
const handleDialogClose = () => {
  pageData.dialogVisible = false;
  dictFormRef.value!.clearValidate();
  emit("refresh");
  pageData.isUpdate = false;
};
const handlerSave = () => {
  dictFormRef.value!.validate(isValid => {
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
const save = () => {
  pageData.loading = true;
  dictApi
    .save(pageData.info)
    .then(res => {
      successMessage("保存成功");
      handleDialogClose();
    })
    .finally(() => (pageData.loading = false));
};
const update = () => {
  pageData.loading = true;
  dictApi
    .updateById(pageData.info.id, pageData.info)
    .then(res => {
      successMessage("修改成功");
      handleDialogClose();
    })
    .finally(() => (pageData.loading = false));
};
defineExpose({ open });
</script>

<template>
  <el-dialog
    title="字典信息"
    destroy-on-close
    v-model="pageData.dialogVisible"
    :before-close="handleDialogClose"
  >
    <span-loading v-loading="pageData.loading">
      <el-form
        label-width="auto"
        :model="pageData.info"
        :label-position="position"
        ref="dictFormRef"
        required-asterisk
        :rules="pageData.dictRules"
        center
      >
        <el-form-item required label="名称" prop="name">
          <el-input v-model="pageData.info.name" clearable />
        </el-form-item>
        <el-form-item required label="类型" prop="type">
          <el-input v-model="pageData.info.type" clearable />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio-group v-model="pageData.info.isEnabled">
            <el-radio
              v-for="(item, i) in pageData.dataSource.enabledOptions"
              :label="Number(item.value)"
              :key="i"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            type="textarea"
            v-model="pageData.info.description"
            placeholder="备注"
            clearable
          />
        </el-form-item>
      </el-form>
    </span-loading>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          size="default"
          v-auth="permission.update"
          @click="handlerSave"
          >保存</el-button
        >
        <el-button size="default" @click="handleDialogClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
