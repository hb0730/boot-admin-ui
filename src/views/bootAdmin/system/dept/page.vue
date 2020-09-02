<template>
  <d2-container class="page">
    <el-col :span="14">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="medium" icon="el-icon-plus" plain>添加</el-button>
            <el-button type="danger" size="medium" icon="el-icon-delete" plain>删除</el-button>
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
              :model="depInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="rules"
              required-asterisk
            >
              <el-form-item required label="上级组织:" prop="parentName">
                <treeselect
                  v-model="depInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="组织名称" prop="name">
                <el-input v-model="depInfo.name" clearable></el-input>
              </el-form-item>
              <el-form-item required label="负责人" prop="leader">
                <el-input v-model="depInfo.leader" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系号码" prop="phone">
                <el-input v-model="depInfo.phone" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系邮箱" prop="email">
                <el-input v-model="depInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="depInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="depInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用" prop="isEnabled">
                <el-radio-group v-model="depInfo.isEnabled">
                  <el-radio
                    v-for="item in isEnabledOptions "
                    :key="Number(item.value)"
                    :label="Number(item.value)"
                  >{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="primary" size="medium" plain class="button" v-if="!isUpdate">新增</el-button>
              <el-button type="primary" size="medium" plain class="button" v-if="isUpdate">修改</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
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
      depInfo: {},
      rules: {},
      isEnabledOptions: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      isUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getTree();
  },
  methods: {
    ...mapActions("bootAdmin/dept", ["deptTree"]),
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
      _self.isUpdate = true;
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
  },
};
</script>