<script lang="ts">
export default { name: "RoleEdit" };
</script>
<script setup lang="ts">
import { Ref, toRef, PropType, reactive, ref } from "vue";
import { DeptTree } from "/@/api/model/dept_model";
import { Role } from "/@/api/model/role_model";
import TreeSelectV2 from "/@/components/tree-select2/index.vue";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { roleApi } from "/@/api/role";
import { Result } from "/@/api/model/domain";
const roleFormRef = ref<InstanceType<typeof ElForm>>();
const treeProps = reactive({
  id: "id",
  value: "id",
  children: "children",
  label: "name",
  disabled: "disabled",
  isLeaf: "isLeaf"
});
const roleRules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入标识符", trigger: "blur" }]
});
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const props = defineProps({
  dialogVisible: {
    require: false,
    type: Boolean,
    default: false
  },
  isUpdate: {
    require: true,
    type: Boolean,
    default: false
  },
  position: {
    require: false,
    type: String,
    default: "right"
  },
  roleInfo: Object as PropType<Role>,
  deptTreeData: Array as PropType<DeptTree[]>
});
const dialogVisible = toRef(props, "dialogVisible");
const roleInfo: Ref<Role> = toRef(props, "roleInfo");
const isUpdate = toRef(props, "isUpdate");
const position = toRef(props, "position");
const deptTreeData = toRef(props, "deptTreeData");

const handleDialogClose = () => {
  roleFormRef.value!.clearValidate();
  emit("refresh");
};
const handlerSave = () => {
  roleFormRef.value!.validate(isValid => {
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
const update = async () => {
  const result: Result<string> = await roleApi.update(
    roleInfo.value.id,
    roleInfo.value
  );
  if (result.code === "0") {
    handleDialogClose();
  } else {
    warnMessage(result.message);
  }
};
const save = async () => {
  const result: Result<string> = await roleApi.save(roleInfo.value);
  if (result.code === "0") {
    successMessage("保存成功");
    handleDialogClose();
  } else {
    warnMessage(result.message);
  }
};
</script>

<template>
  <div>
    <el-dialog
      title="角色信息"
      destroy-on-close
      v-model="dialogVisible"
      :before-close="handleDialogClose"
    >
      <el-form
        label-width="auto"
        :model="roleInfo"
        :label-position="position"
        ref="roleFormRef"
        :rules="roleRules"
        center
      >
        <el-form-item required label="角色名称: " prop="name">
          <el-input v-model="roleInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="标识符: " prop="code">
          <el-input v-model="roleInfo.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据范围:">
          <tree-select-v2
            :multiple="true"
            placeholder="请选择"
            style="width: 100%"
            :default-props="treeProps"
            v-model="roleInfo.deptIds"
            :options="deptTreeData"
          ></tree-select-v2>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="roleInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注: " prop="description">
          <el-input
            type="textarea"
            v-model="roleInfo.description"
            placeholder="备注"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item required label="角色状态: " prop="isEnabled">
          <el-radio-group v-model="roleInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions"
              :key="Number(item.value)"
              :label="Number(item.value)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" size="default" @click="handlerSave" plain
            >保存</el-button
          >
          <el-button size="default" plain @click="handleDialogClose"
            >取 消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
