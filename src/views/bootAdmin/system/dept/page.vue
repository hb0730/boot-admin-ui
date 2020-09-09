<template>
  <d2-container class="page">
    <el-col :span="14">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              size="medium"
              @click="handlerAddNew"
              icon="el-icon-plus"
              plain
            >添加</el-button>
            <el-button
              type="danger"
              size="medium"
              @click="handlerDelete"
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
              :expand-on-click-node="false"
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
              :model="deptInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="rules"
              required-asterisk
            >
              <el-form-item label="上级组织：" prop="parentName">
                <treeselect
                  v-model="deptInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="组织名称：" prop="name">
                <el-input v-model="deptInfo.name" clearable></el-input>
              </el-form-item>
              <el-form-item required label="负责人：" prop="leader">
                <el-input v-model="deptInfo.leader" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系号码：" prop="phone">
                <el-input v-model="deptInfo.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系邮箱：" prop="email">
                <el-input v-model="deptInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="排序：" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="deptInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注：" prop="description">
                <el-input type="textarea" v-model="deptInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用：" prop="isEnabled">
                <el-radio-group v-model="deptInfo.isEnabled">
                  <el-radio
                    v-for="item in isEnabledOptions "
                    :key="Number(item.value)"
                    :label="Number(item.value)"
                  >{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div>
              <el-button
                type="primary"
                size="medium"
                @click="handlerSave"
                plain
                class="button"
                v-if="!isUpdate"
              >新增</el-button>
              <el-button
                type="primary"
                @click="handlerUpdate"
                size="medium"
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
import util from "@/libs/util"
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
        label: "name",
      },
      i: 0,
      position: "left",
      deptInfo: {
        id: "",
        name: "",
        leader: "",
        phone: "",
        email: "",
        parentId: -1,
        sort: 999,
        ancestors: "",
        description: "",
        isEnabled: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        leader: [
          { required: true, message: "请输入部门负责人", trigger: "blur" },
        ],
      },
      isEnabledOptions: [
      ],
      isUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getTree();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/dept", [
      "deptTree",
      "deptUpdate",
      "deptSave",
      "deptDelete",
    ]),
     /**
     * 数据字典
     */
    initDict(){
      let _self=this;
       _self.isEnabledOptions = util.dict.getDictValue("sys_common_status");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    getTree() {
      let _self = this;
      _self.deptTree().then((result) => {
        _self.treeData = result;
      });
    },
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
      _self.initDeptInfo();
      _self.deptInfo = {
        id: data.id,
        name: data.name,
        leader: data.leader,
        phone: data.phone,
        email: data.email,
        parentId: data.parentId,
        sort: data.sort,
        ancestors: data.ancestors,
        description: data.description,
        isEnabled: data.isEnabled,
      };

      _self.isUpdate = true;
    },
    initDeptInfo() {
      let _self = this;
      _self.$refs.form.resetFields();
      _self.deptInfo = {
        id: "",
        name: "",
        leader: "",
        phone: "",
        email: "",
        parentId: -1,
        sort: 999,
        ancestors: "",
        description: "",
        isEnabled: 0,
      };
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
        children: node.children,
      };
    },
    /**
     * 修改
     */
    handlerUpdate() {
      let _self = this;
      _self.$refs.form.validate((valid) => {
        if (valid) {
          _self.updateDept();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    updateDept() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.deptInfo));
      let id = _self.deptInfo.id;
      _self.deptUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.getTree();
        _self.initDeptInfo();
      });
    },
    /**
     * 新增
     */
    handlerAddNew() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      _self.isUpdate = false;
      let parentId = currentNodes.length > 0 ? currentNodes[0].id : -1;
      _self.initDeptInfo();
      _self.deptInfo.parentId = parentId;
    },
    handlerSave() {
      let _self = this;
      _self.$refs.form.validate((valid) => {
        if (valid) {
          _self.saveDept();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    saveDept() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.deptInfo));
      _self.deptSave({ data: params }).then((result) => {
        _self.$message.success("新增成功");
        _self.isUpdate = false;
        _self.initDeptInfo();
        _self.getTree();
      });
    },
    /**
     * 删除
     */
    handlerDelete() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length <= 0) {
        _self.$message.warning("请选择要删除的数据");
      } else {
        MessageBox.confirm("是否删除已选择的数据(包含下级)", "删除", {
          type: "warning",
        }).then(() => {
          let id = currentNodes[0].id;
          _self.deleteDept(id);
        });
      }
    },
    deleteDept(id) {
      let _self = this;
      if (id) {
        _self.deptDelete({ id: id }).then((result) => {
          _self.$message.success("删除成功");
          _self.getTree();
        });
      }
    },
  },
};
</script>