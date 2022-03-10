<script lang="ts">
export default { name: "DeptEdit" };
</script>
<script setup lang="ts">
import { PropType, reactive, ref, toRef, watch, onMounted } from "vue";
import { Dept, DeptTree } from "/@/api/model/system/dept_model";
import { TreeSelect } from "@pureadmin/components";
import { ElForm } from "element-plus";
import { warnMessage } from "/@/utils/message";
import { deptApi } from "/@/api/system/dept";
import { dictStoreHook } from "/@/store/modules/dict";
const formRef = ref<InstanceType<typeof ElForm>>();
const treeProps = reactive({
  key: "id",
  value: "id",
  children: "children",
  label: "name"
});
const pageData = reactive({
  isEnabledOptions: []
});
const rules = reactive({
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  leader: [{ required: true, message: "请输入部门负责人", trigger: "blur" }]
});
const permission = reactive({
  add: ["dept:save"],
  edit: ["dept:update"],
  delete: ["dept:delete"]
});
const props = defineProps({
  deptInfo: Object as PropType<Dept>,
  treeData: Array as PropType<DeptTree[]>,
  isUpdate: {
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
const emit = defineEmits<{
  (e: "refreshDept"): void;
}>();
const deptInfo = toRef(props, "deptInfo");
const position = toRef(props, "position");
const treeData = toRef(props, "treeData");
const isUpdate = toRef(props, "isUpdate");
const handlerSave = () => {
  formRef.value!.validate(isValid => {
    if (isValid) {
      if (isUpdate.value) {
        deptUpdate();
      } else {
        deptSave();
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const deptSave = async () => {
  await deptApi.save(deptInfo.value);
  emit("refreshDept");
};
const deptUpdate = async () => {
  await deptApi.updateById(deptInfo.value.id, deptInfo.value);
  emit("refreshDept");
};
watch(
  () => {
    return props.deptInfo;
  },
  () => {
    setTimeout(() => {
      formRef.value!.clearValidate();
    }, 0);
  }
);
const getDict = () => {
  pageData.isEnabledOptions = dictStoreHook().getEntry("sys_common_status");
};
onMounted(() => {
  getDict();
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-row></el-row>
      <el-row style="padding-top: 10%">
        <el-col>
          <el-form
            ref="formRef"
            :model="deptInfo"
            label-width="auto"
            center
            :label-position="position"
            :rules="rules"
            required-asterisk
          >
            <el-form-item label="上级组织: " prop="parentName">
              <TreeSelect
                v-model:value="deptInfo.parentId"
                show-search
                style="width: 100%"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                :tree-data="treeData"
                :field-names="treeProps"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              ></TreeSelect>
            </el-form-item>
            <el-form-item required label="组织名称: " prop="name">
              <el-input v-model="deptInfo.name" clearable></el-input>
            </el-form-item>
            <el-form-item required label="负责人: " prop="leader">
              <el-input v-model="deptInfo.leader" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系号码: " prop="phone">
              <el-input v-model="deptInfo.phone" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱: " prop="email">
              <el-input v-model="deptInfo.email" clearable></el-input>
            </el-form-item>
            <el-form-item label="排序: " prop="sort">
              <el-input-number
                style="width: 100%"
                controls-position="right"
                v-model="deptInfo.sort"
                placeholder="排序"
                clearable
              ></el-input-number>
            </el-form-item>
            <el-form-item label="备注: " prop="description">
              <el-input
                type="textarea"
                v-model="deptInfo.description"
                placeholder="备注"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用: " prop="isEnabled">
              <el-radio-group v-model="deptInfo.isEnabled">
                <el-radio
                  v-for="item in pageData.isEnabledOptions"
                  :key="Number(item.value)"
                  :label="Number(item.value)"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="form-button">
            <el-button
              v-show="isUpdate"
              v-auth="permission.edit"
              type="primary"
              size="large"
              plain
              class="button"
              @click="handlerSave"
            >
              修改
            </el-button>
            <el-button
              v-show="!isUpdate"
              v-auth="permission.add"
              type="primary"
              size="large"
              plain
              class="button"
              @click="handlerSave"
            >
              新增
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped></style>
