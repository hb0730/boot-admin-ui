<template>
  <d2-container class="page">
    <el-col :span="6">
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
    <el-col :span="8">
      <el-card shadow="never">
        <el-row></el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-form
              ref="menuForm"
              :model="menuInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="menuRules"
              aria-required
            >
              <el-form-item label="上级菜单：">
                <treeselect
                  v-model="menuInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="名称：" prop="title">
                <el-input v-model="menuInfo.title" clearable></el-input>
              </el-form-item>
              <el-form-item required label="路由标题：" prop="enname">
                <el-input v-model="menuInfo.enname" clearable></el-input>
              </el-form-item>
              <el-form-item required label="菜单地址：" prop="path">
                <el-input v-model="menuInfo.path" clearable></el-input>
              </el-form-item>
              <el-form-item  label="路由地址：" prop="component">
                <el-input v-model="menuInfo.component" clearable></el-input>
              </el-form-item>
              <el-form-item label="图标：" prop="icon">
                <e-icon-picker v-model="menuInfo.icon" clearable />
              </el-form-item>
              <el-form-item label="排序：" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="menuInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注：" prop="description">
                <el-input type="textarea" v-model="menuInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用：" prop="isEnabled">
                <el-radio-group v-model="menuInfo.isEnabled">
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
    <el-col :span="10">
      <el-card shadow="never">
        <el-row>
          <el-col></el-col>
        </el-row>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
// https://www.vue-treeselect.cn/#vuex-support
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      // 用于单选
      i: 0,
      position: "left",
      // 菜单树数据
      treeData: [],
      treeProps: {
        children: "children",
        label: "title",
      },
      // 菜单表单
      menuInfo: {
        id: "",
        parentId: -1,
        title: "",
        enname: "",
        path: "",
        component: "",
        icon: "",
        sort: 999,
        isEnabled: 0,
      },
      // 菜单表单规则
      menuRules: {},
      isEnabledOptions: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      isUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getMenuTree();
  },
  methods: {
    ...mapActions("bootAdmin/menu", ["queryTree"]),
    /**
     * 获取菜单树
     */
    getMenuTree() {
      let _self = this;
      _self.queryTree().then((result) => {
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
      _self.menuInfo = {
        id: data.id,
        parentId: data.parentId,
        title: data.title,
        enname: data.enname,
        path: data.path,
        component: data.component,
        icon: data.icon,
        sort: data.sort,
        isEnabled: data.isEnabled,
      };
      _self.isUpdate = true;
    },
    /**
     * 树形，选择器
     */
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children,
      };
    },
  },
};
</script>
<!--queryTree-->