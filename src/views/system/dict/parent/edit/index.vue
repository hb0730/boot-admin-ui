<script lang="ts">
export default { name: "DictParentEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref } from "vue";
import { Dict } from "/@/api/model/system/dict_model";
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
  }
});
const props = defineProps({
  dataSource: Object as PropType<[]>,
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
    default: "left",
    type: String
  }
});
const dialogVisible = toRef(props, "dialogVisible");
const isUpdate = toRef(props, "isUpdate");
const dictInfo = toRef(props, "dictInfo");
const position = toRef(props, "position");
const dataSource = toRef(props, "dataSource");
const handleDialogClose = () => {
  dictFormRef.value!.clearValidate();
  emit("refresh");
};
const handlerSave = () => {
  dictFormRef.value!.validate(isValid => {
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
const save = () => {
  pageData.loading = true;
  dictApi
    .save(dictInfo.value)
    .then(res => {
      successMessage("保存成功");
      handleDialogClose();
    })
    .finally(() => (pageData.loading = false));
};
const update = () => {
  pageData.loading = true;
  dictApi
    .updateById(dictInfo.value.id, dictInfo.value)
    .then(res => {
      successMessage("修改成功");
      handleDialogClose();
    })
    .finally(() => (pageData.loading = false));
};
</script>

<template>
  <el-dialog
    title="字典信息"
    destroy-on-close
    v-model="dialogVisible"
    :before-close="handleDialogClose"
  >
    <span-loading v-loading="pageData.loading">
      <el-form
        label-width="auto"
        :model="dictInfo"
        :label-position="position"
        ref="dictFormRef"
        required-asterisk
        :rules="pageData.dictRules"
        center
      >
        <el-form-item required label="名称" prop="name">
          <el-input v-model="dictInfo.name" clearable />
        </el-form-item>
        <el-form-item required label="类型" prop="type">
          <el-input v-model="dictInfo.type" clearable />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio-group v-model="dictInfo.isEnabled">
            <el-radio
              v-for="(item, i) in dataSource.enabledOptions"
              :label="Number(item.value)"
              :key="i"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            type="textarea"
            v-model="dictInfo.description"
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
