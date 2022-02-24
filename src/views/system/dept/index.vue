<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import DeptEdit from "./edit/index.vue";
import { Dept, DeptTree } from "/@/api/model/dept_model";
import { deptApi } from "/@/api/dept";
import { Result } from "/@/api/model/domain";
import { warnMessage } from "/@/utils/message";
import { ElTree } from "element-plus";
import { confirm } from "/@/utils/message/box";
const treeRef = ref<InstanceType<typeof ElTree>>();
const pageData = reactive<{
  i: number;
  isUpdate: boolean;
  checkedId: string;
  treeData: DeptTree[];
  treeProps: any;
  deptInfo: Dept;
}>({
  i: 0,
  isUpdate: false,
  checkedId: "",
  treeData: [],
  treeProps: {
    children: "children",
    label: "name"
  },
  deptInfo: {
    id: "",
    name: "",
    leader: "",
    phone: "",
    email: "",
    parentId: "-1",
    sort: 999,
    ancestors: "",
    description: "",
    isEnabled: 0
  }
});
const getTree = async () => {
  const result: Result<DeptTree[]> = await deptApi.getTreDept();
  if (result.code === "0") {
    pageData.treeData = result.data;
  } else {
    warnMessage(result.message);
  }
};
const initDeptInfo = (data: Dept) => {
  if (data) {
    pageData.deptInfo = data;
  } else {
    pageData.deptInfo = {
      id: "",
      name: "",
      leader: "",
      phone: "",
      email: "",
      parentId: "-1",
      sort: 999,
      ancestors: "",
      description: "",
      isEnabled: 0
    };
  }
};
const handleNodeChangeCheckEvent = (data, checked: boolean) => {
  pageData.i++;
  if (pageData.i % 2 === 0) {
    if (checked) {
      pageData.checkedId = data.id;
      treeRef.value!.setCheckedNodes([]);
      treeRef.value!.setCheckedNodes([data]);
    } else {
      treeRef.value!.setCheckedNodes([]);
    }
  }
};
const handleNodeCheckClickEvent = (data, _) => {
  pageData.deptInfo = data;
  initDeptInfo(data);
  pageData.isUpdate = true;
};
const handlerSave = () => {
  const nodes = treeRef.value!.getCheckedNodes();
  let parentId = "";
  if (nodes.length > 0) {
    parentId = nodes[0].id;
  } else {
    parentId = "-1";
  }
  initDeptInfo(null);
  pageData.deptInfo.parentId = parentId;
  pageData.isUpdate = false;
};
const handlerRefreshDept = () => {
  getTree();
  initDeptInfo(null);
  pageData.isUpdate = false;
};
const handlerDelete = () => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length < 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否要删除已选择数据")
    .then(() => {
      deptDelete(ids[0].toString());
    })
    .catch(() => {});
};
const deptDelete = async (id: string) => {
  const result: Result<string> = await deptApi.deleteById(id);
  if (result.code === "0") {
    handlerRefreshDept();
  } else {
    warnMessage(result.message);
  }
};
onMounted(() => {
  getTree();
});
</script>

<template>
  <div>
    <el-row>
      <el-col :span="14">
        <el-card shadow="never">
          <el-row>
            <el-col :span="24">
              <el-button
                type="primary"
                size="large"
                :icon="useRenderIcon('iconify-fa-check')"
                @click="handlerSave"
                plain
                >添加</el-button
              >
              <el-button
                type="danger"
                size="large"
                :icon="useRenderIcon('iconify-fa-trash')"
                @click="handlerDelete"
                plain
                >删除</el-button
              >
            </el-col>
          </el-row>
          <el-row style="padding-top: 10%">
            <el-col>
              <el-tree
                :data="pageData.treeData"
                show-checkbox
                ref="treeRef"
                node-key="id"
                :props="pageData.treeProps"
                check-strictly
                :highlight-current="true"
                :expand-on-click-node="true"
                default-expand-all
                @check-change="handleNodeChangeCheckEvent"
                @check="handleNodeCheckClickEvent"
              ></el-tree>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <DeptEdit
          :dept-info="pageData.deptInfo"
          :is-update="pageData.isUpdate"
          :tree-data="pageData.treeData"
          @refresh-dept="handlerRefreshDept"
        ></DeptEdit>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
