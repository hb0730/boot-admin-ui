<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, toRef, PropType, ref, watch, toRaw } from "vue";
import { DeptTree } from "/@/api/model/dept_model";
import { Result } from "/@/api/model/domain";
import { Post } from "/@/api/model/post_model";
import { Role } from "/@/api/model/role_model";
import { User } from "/@/api/model/user_model";
import { userApi } from "/@/api/user";
import VueSelectTree from "/@/components/tree-select/index.vue";
import { successMessage, warnMessage } from "/@/utils/message";
const treeProps = reactive({
  id: "id",
  value: "id",
  children: "children",
  label: "name",
  disabled: "disabled",
  isLeaf: "isLeaf"
});
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);
const sexOptions = reactive([
  { label: "男", value: 1 },
  { label: "女", value: 2 },
  { label: "未知", value: 0 }
]);
const pageData = reactive({
  position: "right",
  userRules: {
    username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
    nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
    deptId: [{ required: true, message: "请选择所属部门", trigger: "blur" }]
  }
});
const userFormRef = ref<InstanceType<typeof ElForm>>();
const props = defineProps({
  userInfo: Object as PropType<User>,
  deptTreeData: Array as PropType<DeptTree[]>,
  postDataList: Array as PropType<Post[]>,
  roleDataList: Array as PropType<Role[]>,
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  }
});
const emit = defineEmits<{
  (e: "closeDialog"): void;
}>();
const dialogVisible = toRef(props, "dialogVisible");
const userInfo = toRef(props, "userInfo");
const deptTreeData = toRef(props, "deptTreeData");
const postDataList = toRef(props, "postDataList");
const roleDataList = toRef(props, "roleDataList");
const isUpdate = toRef(props, "isUpdate");
const handleDialogClose = () => {
  emit("closeDialog");
};
watch(
  () => {
    return props.dialogVisible;
  },
  () => {
    if (props.dialogVisible) {
      setTimeout(() => {
        userFormRef.value!.resetFields();
      }, 100);
    }
  }
);
const nodeClick = node => {
  if (node) {
    userInfo.value.deptId = node.id;
  } else {
    userInfo.value.deptId = null;
  }
};
const handlerSave = () => {
  userFormRef.value!.validate(isValid => {
    if (isValid) {
      if (isUpdate.value) {
        updateUser();
      } else {
        saveUser();
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const saveUser = async () => {
  const result: Result<string> = await userApi.saveUser(toRaw(userInfo.value));
  if (result.code === "0") {
    successMessage("成功");
    emit("closeDialog");
  } else {
    warnMessage(result.message);
  }
};
const updateUser = async () => {
  const result: Result<string> = await userApi.updateUserById(
    userInfo.value.id,
    toRaw(userInfo.value)
  );
  if (result.code === "0") {
    successMessage("成功");
    emit("closeDialog");
  } else {
    warnMessage(result.message);
  }
};
</script>

<template>
  <div>
    <el-dialog
      title="用户信息"
      destroy-on-close
      v-model="dialogVisible"
      :before-close="handleDialogClose"
    >
      <el-form
        label-width="auto"
        :model="userInfo"
        :label-position="pageData.position"
        ref="userFormRef"
        :rules="pageData.userRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item required label="用户账号: " prop="username">
              <el-input
                :disabled="isUpdate"
                v-model="userInfo.username"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="用户昵称: " prop="nickName">
              <el-input v-model="userInfo.nickName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号: " prop="phonenumber">
              <el-input v-model="userInfo.phonenumber" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱: " prop="email">
              <el-input v-model="userInfo.email" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="所属部门: " prop="deptId">
              <VueSelectTree
                v-model="userInfo.deptId"
                placeholder="顶级节点"
                :options="deptTreeData"
                :data-props="treeProps"
                @nodeClick="nodeClick"
                style="width: 100%"
              >
              </VueSelectTree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位: " prop="postIds">
              <el-select
                style="width: 100%"
                v-model="userInfo.postIds"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in postDataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别:" prop="gender">
              <el-select
                style="width: 100%"
                v-model="userInfo.gender"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="Number(item.value)"
                  :value="Number(item.value)"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="状态:" prop="isEnabled">
              <el-radio-group
                :disabled="userInfo.isAdmin == 1"
                v-model="userInfo.isEnabled"
              >
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
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                style="width: 100%"
                v-model="userInfo.roleIds"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roleDataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input
                type="textarea"
                v-model="userInfo.description"
                placeholder="备注"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :disabled="userInfo.isAdmin == 1"
          @click="handlerSave"
          size="default"
          >保存</el-button
        >
        <el-button size="default" @click="handleDialogClose">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
