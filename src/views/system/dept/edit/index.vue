<script lang="ts">
export default { name: "DeptEdit" };
</script>
<script setup lang="ts">
import { PropType, reactive, ref, toRef, watch } from "vue";
import { Dept, DeptTree } from "/@/api/model/system/dept_model";
import VueSelectTree from "/@/components/tree-select/index.vue";
import { ElForm } from "element-plus";
import { warnMessage } from "/@/utils/message";
import { deptApi } from "/@/api/system/dept";
const formRef = ref<InstanceType<typeof ElForm>>();
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
const rules = reactive({
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  leader: [{ required: true, message: "请输入部门负责人", trigger: "blur" }]
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
const nodeClick = node => {
  if (node) {
    deptInfo.value.parentId = node.id;
  } else {
    deptInfo.value.parentId = null;
  }
};
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
              <VueSelectTree
                v-model="deptInfo.parentId"
                placeholder="顶级节点"
                :options="treeData"
                :data-props="treeProps"
                @nodeClick="nodeClick"
                style="width: 100%"
              >
              </VueSelectTree>
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
                  v-for="item in isEnabledOptions"
                  :key="Number(item.value)"
                  :label="Number(item.value)"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="form-button">
            <el-button
              type="primary"
              size="large"
              plain
              class="button"
              @click="handlerSave"
              >{{ isUpdate ? "修改" : "新增" }}</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped></style>
