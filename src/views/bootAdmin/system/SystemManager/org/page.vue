<template>
  <d2-container>
    <el-col :span="14">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-plus"
              @click="handleAddNew"
              plain
            >添加</el-button>
            <el-button
              type="danger"
              @click="handleDelete"
              size="medium"
              icon="el-icon-delete"
              plain
            >删除</el-button>
          </el-col>
        </el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-tree
              :data="treeData"
              show-checkbox
              ref="tree"
              node-key="id"
              :props="treeProps"
              check-strictly
              :highlight-current="true"
              default-expand-all
              @check-change="handleNodeChangeCheckEvent"
              @check="handleNodeCheckClickEvent"
            ></el-tree>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never">
        <el-row></el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-form
              ref="form"
              :model="orgInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="rules"
              required-asterisk
            >
              <el-form-item label="上级组织" prop="parentName">
                <!-- <el-input
                  v-model="orgInfo.parentName"
                  clearable
                  placeholder="-1为顶级组织(非修改)"
                ></el-input> -->
                 <treeselect
                  v-model="orgInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="组织编码" prop="number">
                <el-input v-model="orgInfo.number" clearable></el-input>
              </el-form-item>
              <el-form-item required label="组织名称" prop="name">
                <el-input v-model="orgInfo.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="组织英文名称" prop="enname">
                <el-input v-model="orgInfo.enname" clearable></el-input>
              </el-form-item>
              <el-form-item required label="负责人" prop="leader">
                <el-input v-model="orgInfo.leader" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系号码" prop="phone">
                <el-input v-model="orgInfo.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系邮箱" prop="email">
                <el-input v-model="orgInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="orgInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="orgInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用" prop="isEnabled">
                <el-radio-group v-model="orgInfo.isEnabled">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div>
              <el-button
                type="primary"
                size="medium"
                @click="handleSave"
                plain
                class="button"
                v-if="!isUpdate"
              >新增</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="handleUpdate"
                plain
                class="button"
                v-if="isUpdate"
              >修改</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  orgSavePath,
  orgTreePath,
  orgUpdatePath,
  orgDeletePath
} from "@/api/baseUrl";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { MessageBox } from "element-ui";
export default {
  components: { Treeselect },
  data() {
    return {
      treeData: [],
      treeProps: {
        children: "children",
        label: "name"
      },
      i: 0,
      orgInfo: {
        id: "",
        parentId: null,
        number: "",
        name: "",
        enname: "",
        leader: "",
        phone: "",
        email: "",
        sort: 0,
        description: "",
        isEnabled: 1
      },
      position: "left",
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        number: [{ required: true, message: "请输入编码", trigger: "blur" }],
        leader: [{ required: true, message: "请输入负责人", trigger: "blur" }]
      },
      isUpdate: false,
      currentInfo: {},
      isAll: -1
    };
  },
  mounted() {
    let _self = this;
    _self.GetOrgTreeAll();
  },
  methods: {
    ...mapActions("bootAdmin/org", [
      "orgSave",
      "orgTreeAll",
      "orgUpdate",
      "orgDelete"
    ]),
    /**
     * 选中change(单选)
     */
    handleNodeChangeCheckEvent(data, checked, node) {
      this.i++;
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([]);
          this.$refs.tree.setCheckedNodes([data]);
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([]);
          // 点击已经选中的节点，置空
        }
      }
    },
    /**
     * 选中
     * @param data
     * @param node
     */
    handleNodeCheckClickEvent(data, node) {
      let _self = this;
      _self.currentInfo = data;
      _self.orgInfo = {
        id: data.id,
        parentId: data.parentId,
        number: data.number,
        name: data.name,
        enname: data.enname,
        leader: data.leader,
        phone: data.phone,
        email: data.email,
        sort: data.sort,
        description: data.description,
        isEnabled: data.isEnabled
      };
      _self.isUpdate = true;
    },
    /**
     * 获取组织树
     */
    GetOrgTreeAll() {
      let _self = this;
      let url = orgTreePath + "/"+_self.isAll;
      _self.orgTreeAll({ url: url, data: null }).then(result => {
        _self.treeData = result;
      });
    },
    /**
     * 保存组织
     */
    handleSave() {
      let _self = this;
      _self.$refs.form.validate(valid => {
        if (valid) {
          _self.OrgSave();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 保存组织信息
     */
    OrgSave() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.orgInfo));
      let url = orgSavePath;
      _self.orgSave({ url: url, data: params }).then(result => {
        _self.GetOrgTreeAll();
        _self.orgInfo = {
          id: "",
          parentId:null,
          number: "",
          name: "",
          enname: "",
          leader: "",
          phone: "",
          email: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      });
    },
    /**
     * 新增
     */
    handleAddNew() {
      let _self = this;
      let info = _self.currentInfo;
      _self.orgInfo = {
        id: "",
        parentId: info.id,
        number: "",
        name: "",
        enname: "",
        leader: "",
        phone: "",
        email: "",
        sort: 0,
        description: "",
        isEnabled: 1
      };
      _self.isUpdate = false;
    },
    /**
     * 修改
     */
    handleUpdate() {
      let _self = this;
      _self.$refs.form.validate(valid => {
        if (valid) {
          _self.OrgUpdate();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 修改组织
     */
    OrgUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.orgInfo));
      let url = orgUpdatePath + "/" + params.id;
      _self.orgUpdate({ url: url, data: params }).then(result => {
        _self.GetOrgTreeAll();
        _self.orgInfo = {
          id: "",
          parentId: null,
          number: "",
          name: "",
          enname: "",
          leader: "",
          phone: "",
          email: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      });
    },
    /**
     * 删除
     */
    handleDelete() {
      let _self = this;
      let info = JSON.parse(JSON.stringify(_self.currentInfo));
      if (info.id) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          _self.OrgDelete(info.id);
        });
      }
    },
    /**
     * 删除组织
     */
    OrgDelete(id) {
      let _self = this;
      if (id) {
        let url = orgDeletePath + "/" + id;
        _self.orgDelete({ url: url, data: null }).then(result => {
          _self.GetOrgTreeAll();
        });
      }
    },
    /**
     * 树形
     */
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    }
  }
};
</script>
<style>
</style>