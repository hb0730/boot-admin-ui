<script lang="ts">
export default { name: "PostEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref } from "vue";
import { Post } from "/@/api/model/post_model";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { postApi } from "/@/api/post";
const postForm = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);
const postRules = reactive({
  name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
  number: [{ required: true, message: "请输入岗位编码", trigger: "blur" }]
});
const props = defineProps({
  position: {
    require: false,
    default: "left",
    type: String
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  postInfo: Object as PropType<Post>,
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  }
});
const position = toRef(props, "position");
const dialogVisible = toRef(props, "dialogVisible");
const postInfo = toRef(props, "postInfo");
const isUpdate = toRef(props, "isUpdate");
const handleDialogClose = () => {
  postForm.value!.clearValidate();
  emit("refresh");
};
const handlerSave = () => {
  postForm.value!.validate(isValid => {
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
  await postApi.save(postInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
const update = async () => {
  await postApi.updateById(postInfo.value.id, postInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
</script>

<template>
  <div>
    <el-dialog
      title="岗位信息"
      destroy-on-close
      v-model="dialogVisible"
      :before-close="handleDialogClose"
    >
      <el-form
        label-width="auto"
        :model="postInfo"
        :label-position="position"
        ref="postForm"
        required-asterisk
        :rules="postRules"
        center
      >
        <el-form-item required label="岗位编码" prop="number">
          <el-input v-model="postInfo.number" clearable></el-input>
        </el-form-item>
        <el-form-item required label="岗位名称" prop="name">
          <el-input v-model="postInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="岗位状态" prop="isEnabled">
          <el-radio-group v-model="postInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions"
              :key="Number(item.value)"
              :label="Number(item.value)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="postInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            type="textarea"
            v-model="postInfo.description"
            placeholder="备注"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlerSave">保存</el-button>
          <el-button size="default" @click="handleDialogClose" plain
            >取 消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
