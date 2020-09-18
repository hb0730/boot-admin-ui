<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.code" placeholder="标识" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.isEnabled" placeholder="是否启用" clearable>
          <el-option
            v-for="item in isEnabledOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" @click="handleCurrentChange(1)" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            @click="handlerAddNew"
            class="el-button filter-item el-button--success el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button
            type="button"
            @click="handlerEdit"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button
            type="button"
            @click="handleDeleteIds"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button type="button" class="el-button filter-item el-button--warning el-button--mini">
            <i class="fa fa-download"></i>
            <span>导出</span>
          </button>
        </div>
        <div class="avue-crud__right">
          <button
            type="button"
            class="el-button el-tooltip el-button--default el-button--small is-circle"
            aria-describedby="el-tooltip-2497"
            tabindex="0"
            title="刷新"
            @click="handleDialogClose"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
    </el-row>
    <el-col :span="14">
      <el-card shadow="never" :body-style="{padding:0}">
        <div slot="header" class="clearfix">
          <span>角色列表</span>
        </div>
        <el-table
          v-loading="roleLoading"
          :data="roleList"
          style="width: 100%;"
          ref="roleListRef"
          border
          :fit="true"
          highlight-current-row
          :header-cell-style="{'text-align':'center'}"
          @row-click="roleTableRowClick"
        >
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="code"
            label="角色标识"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="isEnabled"
            label="角色状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
                disable-transitions
              >{{getDictEntryInfo('sys_common_status',scope.row.isEnabled).label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                title="修改"
                @click="handlerUpdate(scope.row)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                @click="handlerRemove(scope.row)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchInfo.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchInfo.total"
        ></el-pagination>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>菜单列表</span>
          <el-button
            :disabled="isMenuSave"
            class="el-button el-button--primary el-button--mini"
            style="float: right; padding: 6px 9px;"
            @click="handlerMenuSave"
          >
            <i class="el-icon-check"></i>保存
          </el-button>
        </div>
        <el-tree
          v-loading="menuLoading"
          :data="menuTreeData"
          show-checkbox
          default-expand-all
          ref="menuTree"
          node-key="id"
          :props="treeProps"
          :highlight-current="true"
        ></el-tree>
      </el-card>
    </el-col>
    <el-dialog
      title="角色信息"
      :before-close="handleDialogClose"
      :visible.sync="dialogTableVisible"
      :destroy-on-close="!dialogTableVisible"
    >
      <el-form
        label-width="auto"
        :model="roleInfo"
        :label-position="position"
        ref="roleForm"
        required-asterisk
        :rules="roleRules"
        center
      >
        <el-form-item required label="角色名称：" prop="name">
          <el-input v-model="roleInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="标识符：" prop="code">
          <el-input v-model="roleInfo.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据范围：">
          <treeselect
            v-model="roleInfo.deptIds"
            :multiple="true"
            :flat="true"
            :normalizer="normalizer"
            :options="deptTreeData"
          />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="roleInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input type="textarea" v-model="roleInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item required label="角色状态：" prop="isEnabled">
          <el-radio-group v-model="roleInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSave" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { MessageBox } from "element-ui";
export default {
  components: { Treeselect },
  data() {
    return {
      //遮罩层
      roleLoading: true,
      menuLoading: true,
      /**
       * 检索条件
       */
      searchInfo: {
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        name: "",
        code: "",
        isEnabled: "",
      },
      position: "left",
      //启用选项
      isEnabledOptions: [],

      /**菜单树 */
      menuTreeData: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      // 组织树
      deptTreeData: [],
      dialogTableVisible: false,
      /**角色信息 */
      roleInfo: {
        id: "",
        name: "",
        code: "",
        sort: 999,
        isEnabled: 0,
        deptIds: [],
      },
      //校验
      roleRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入标识符", trigger: "blur" }],
      },
      //是否修改
      isUpdate: false,
      /**列表 */
      roleList: [],
      //是否保存
      isMenuSave: true,
      //当前树形选中的info
      clickCurrentData: {},
    };
  },
  mounted() {
    let _self = this;
    _self.getMenuTree();
    _self.getDeptTree();
    _self.getPage();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/menu", ["queryPermissionTree"]),
    ...mapActions("bootAdmin/dept", ["deptTree"]),
    ...mapActions("bootAdmin/role", [
      "rolePage",
      "roleSave",
      "roleUpdate",
      "roleDelete",
      "rolePermissionUpdate",
    ]),
    /**
     * 数据字典
     */
    initDict() {
      let _self = this;
      _self.isEnabledOptions = util.dict.getDictValue("sys_common_status");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    /**
     * 角色信息
     */
    getPage() {
      let _self = this;
      _self.roleLoading = true;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.rolePage({ data: params }).then((result) => {
        _self.roleList = result.records;
        _self.searchInfo.total = Number(result.total);
        _self.roleLoading = false;
      });
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
        label: node.name,
        children: node.children,
      };
    },
    /**
     * 菜单权限树
     */
    getMenuTree() {
      let _self = this;
      _self.menuLoading = true;
      _self.queryPermissionTree().then((result) => {
        _self.menuTreeData = result;
        _self.menuLoading = false;
      });
    },
    /**组织树 */
    getDeptTree() {
      let _self = this;
      _self.deptTree().then((result) => {
        _self.deptTreeData = result;
      });
    },
    /**
     * 初始化角色信息
     */
    initRoleInfo() {
      let _self = this;
      _self.roleInfo = {
        id: "",
        name: "",
        code: "",
        sort: 999,
        isEnabled: 0,
        deptIds: [],
      };
    },
    handleSizeChange(sizePage) {
      let _self = this;
      _self.searchInfo.pageSize = sizePage;
      _self.handleDialogClose();
    },
    handleCurrentChange(pageNum) {
      let _self = this;
      _self.searchInfo.pageNum = pageNum;
      _self.handleDialogClose();
    },
    /**
     * 弹窗关闭
     */
    handleDialogClose() {
      let _self = this;
      _self.initRoleInfo();
      _self.dialogTableVisible = false;
      _self.getPage();
      _self.clickCurrentData = null;
      _self.showMenuSave();
    },
    /**
     * 新增
     */
    handlerAddNew() {
      let _self = this;
      _self.isUpdate = false;
      _self.dialogTableVisible = true;
      _self.initRoleInfo();
    },
    /**
     * 保存
     */
    handlerSave() {
      let _self = this;
      _self.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (_self.isUpdate) {
            _self.updateRole();
          } else {
            _self.saveRole();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    saveRole() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.roleInfo));
      console.info(params);
      _self.roleSave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerEdit() {
      let _self = this;
      let info = _self.$refs.roleListRef.selection;
      if (info.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else if (info.length > 1) {
        _self.$message({
          message: "请选择(有且只有一个)",
          type: "warning",
        });
      } else {
        let row = info[0];
        _self.isView = false;
        _self.isUpdate = true;
        _self.roleInfo = row;
        _self.dialogTableVisible = true;
      }
    },
    updateRole() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.roleInfo));
      let id = _self.roleInfo.id;
      _self.roleUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerUpdate(data) {
      let _self = this;
      _self.isUpdate = true;
      _self.initRoleInfo();
      _self.roleInfo = JSON.parse(JSON.stringify(data));
      _self.dialogTableVisible = true;
    },
    /**
     * 删除
     */
    handleDeleteIds() {
      let _self = this;
      let info = _self.$refs.roleListRef.selection;
      if (info.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else if (info.length > 0) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning",
        }).then(() => {
          let ids = [];
          info.forEach((item) => {
            ids.push(item.id);
          });
          _self.removeRole(ids);
        });
      }
    },
    /**
     * 删除
     */
    handlerRemove(data) {
      let _self = this;
      if (data) {
        MessageBox.confirm("是否删除当前数据", "删除", {
          type: "warning",
        }).then(() => {
          let array = [data.id];
          _self.removeRole(array);
        });
      }
    },
    removeRole(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.roleDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.handleDialogClose();
        });
      }
    },
    /**表格 */
    roleTableRowClick(row, column, cell, event) {
      let _self = this;
      _self.clickCurrentData = row;
      _self.showMenuSave();
    },
    /**
     * 显示
     */
    showMenuSave() {
      let _self = this;
      let info = _self.clickCurrentData;
      if (info) {
        if (info.permissionIds) {
          let menuIds = JSON.parse(JSON.stringify(info.permissionIds));
          _self.$refs.menuTree.setCheckedKeys(menuIds);
        } else {
          _self.$refs.menuTree.setCheckedKeys([]);
        }
        _self.isMenuSave = false;
      } else {
        _self.isMenuSave = true;
        _self.$refs.menuTree.setCheckedKeys([]);
      }
    },
    /**
     * 菜单保存
     */
    handlerMenuSave() {
      let _self = this;
      let menuArray = this.$refs.menuTree.getCheckedNodes(true, false);
      if (menuArray.length <= 0) {
        _self.$message.warning("请选择需要分配的数据");
        return;
      }
      let permissionArray = menuArray.filter((permission) => {
        return permission.isPermission;
      });
      if (permissionArray.length <= 0) {
        _self.$message.warning("请选择正确的菜单权限");
        return;
      }
      permissionArray = permissionArray.map((permission) => {
        return permission.id;
      });
      _self.updatePermission(permissionArray);
    },
    updatePermission(data) {
      let _self = this;
      //rolePermissionUpdate
      let id = _self.clickCurrentData.id;
      let params = JSON.parse(JSON.stringify(data));
      _self.rolePermissionUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDialogClose();
      });
    },
  },
};
</script>

<style scoped  lang="scss">
.el-table__body tr.current-row > td {
  background-color: #e8f4ff;
}
</style>