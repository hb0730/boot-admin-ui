<template>
  <d2-container>
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.enname" placeholder="角色英文名称" clearable></el-input>
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
        <el-button plain size="medium" @click="handlerSearchRole" icon="fa fa-search">查询</el-button>
        <!-- <el-button plain type="primary" @click="handleAddNew" size="medium" icon="el-icon-plus">新增</el-button> -->
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            @click="handleAddNew"
            class="el-button filter-item el-button--success el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button
            @click="handleEdit"
            type="button"
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
            @click="getPageAll"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="roleList"
          style="width: 100%;"
          ref="roleListRef"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
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
            prop="enname"
            label="角色英文名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
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
              >{{scope.row.isEnabled==1?'启动':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="角色说明"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                title="查看"
                @click="handleView(scope.row)"
                icon="fa fa-eye"
                size="mini"
              ></el-button>
              <el-button
                title="修改"
                type="text"
                @click="handleUpdate(scope.row)"
                icon="fa fa-pencil"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                type="text"
                @click="handleDelete(scope.row)"
                icon="fa fa-trash"
                size="mini"
              ></el-button>
              <el-button
                title="权限"
                type="text"
                @click="handlePermissionSave(scope.row)"
                icon="fa fa-key"
                size="mini"
              ></el-button>
              <el-button
                title="数据范围"
                type="text"
                @click="handleOrgSave(scope.row)"
                icon="fa fa-sitemap"
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
      </el-col>
    </el-row>
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
        <el-form-item required label="角色名称" prop="name">
          <el-input v-model="roleInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="角色英文名称" prop="enname">
          <el-input v-model="roleInfo.enname" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="roleInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="roleInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item required label="角色状态" prop="isEnabled">
          <el-radio-group v-model="roleInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="handleSave" icon="fa fa-floppy-o" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="权限信息"
      :before-close="handlePermissionDialogClose"
      :visible.sync="dialogPermissionFormVisible"
    >
      <el-col :span="10">
        <el-card shadow="never">
          <el-tree
            class="dialog-main-tree"
            :data="menuTreeData"
            show-checkbox
            ref="tree"
            node-key="id"
            :props="treeProps"
            check-strictly
            :highlight-current="true"
            default-expand-all
            @current-change="handleNodeChangeEvent"
            @check="handleNodeCheckClickEvent"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-table
          :data="permissionList"
          ref="permissionTable"
          node-key="id"
          :props="permissionProps"
          check-strictly
          :highlight-current="true"
          default-expand-all
          style="width: 100%;"
          border
          :fit="true"
          @select="handleTableSelect"
          @select-all="handleTableSelect"
        >
          <el-table-column
            type="selection"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="mark"
            label="标识"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handlePermissionSizeChange"
          @current-change="handlePermissionCurrentChange"
          :current-page="permissionPages.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="permissionPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="permissionPages.total"
        ></el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerPermissionSave">更新</el-button>
        <el-button @click="handlePermissionDialogClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="数据范围信息"
      :before-close="handleOrgDialogClose"
      :visible.sync="dialogOrgFormVisible"
    >
      <el-tree
        :data="OrgTreeData"
        show-checkbox
        ref="orgTree"
        node-key="id"
        :props="treeProps"
        check-strictly
        :highlight-current="true"
        default-expand-all
        @current-change="handleOrgNodeChangeEvent"
        @check="handleOrgNodeCheckClickEvent"
      ></el-tree>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button
          type="primary"
          @click="handleOrgUpdate"
          icon="fa fa-floppy-o"
          size="medium"
          plain
        >保存</el-button>
        <el-button size="medium" @click="handleOrgDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  roleAllPagePath,
  roleSavePath,
  roleUpdatePath,
  roleDeletePath,
  menuTreePath,
  permissionPagePath,
  rolePermissionSavePath,
  rolePermissionAllPath,
  rolePermissionMapAllPath,
  orgTreePath,
  roleOrgAllPath,
  roleOrgSavePath
} from "@/api/baseUrl";
import { MessageBox } from "element-ui";
import util from "@/libs/util";
export default {
  data() {
    return {
      position: "left",
      searchInfo: {
        name: "",
        isEnabled: "",
        enname: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      roleList: [],
      // 分页
      permissionPages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isUpdate: false,
      dialogTableVisible: false,
      roleRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        enname: [{ required: true, message: "请输入英文名称", trigger: "blur" }]
      },
      roleInfo: {
        id: "",
        name: "",
        enname: "",
        sort: 0,
        description: "",
        isEnabled: 1
      },
      isView: false,
      dialogPermissionFormVisible: false,
      dialogOrgFormVisible: false,
      treeProps: {
        children: "children",
        label: "name"
      },
      menuTreeData: [],
      i: 0,
      permissionList: [],
      permissionProps: {
        value: "id",
        label: "name"
      },
      /*当前选中的菜单 */
      currentMenuInfo: {},
      /**当前已选权限表格 */
      currentPermissionMap: new Map(),
      /**角色权限 */
      rolePermission: [],
      /**当前选中的表格权限更新 */
      currentData: {},
      /**数据范围 */
      OrgTreeData: [],
      currentOrgList: [],
      isAll: 1,
      mapInfo: {},
      isEnabledOptions: []
    };
  },
  mounted() {
    let _self = this;
    _self.getPageAll();
    _self.getMenuTree();
    _self.getOrgTree();
    _self.getMap();
  },
  methods: {
    ...mapActions("bootAdmin/role", [
      "roleAllPage",
      "roleSave",
      "roleUpdate",
      "roleDelete",
      "rolePermissionAll",
      "rolePermissionSave",
      "rolePermissionMap",
      "roleOrgAll",
      "roleOrgSave"
    ]),
    ...mapActions("bootAdmin/menu", ["menuTree", "permissionPageList"]),
    ...mapActions("bootAdmin/org", ["orgTreeAll"]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPageAll();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      this.getPageAll();
    },
    handlePermissionSizeChange(val) {
      this.permissionPages.pageSize = val;
      this.getPermissionPageList(this.currentMenuInfo.id);
    },
    handlePermissionCurrentChange(val) {
      this.permissionPages.pageNum = val;
      this.getPermissionPageList(this.currentMenuInfo.id);
    },
    /**
     * 获取分页后的角色
     */
    getPageAll() {
      let _self = this;
      let url = roleAllPagePath;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.roleAllPage({ url: url, data: params }).then(result => {
        _self.roleList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    /**
     * 关闭弹框
     */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
      _self.roleInfo = {
        id: "",
        name: "",
        enname: "",
        sort: 0,
        description: "",
        isEnabled: 1
      };
      _self.getPageAll();
    },
    /**
     * 新增
     */
    handleAddNew() {
      let _self = this;
      _self.isUpdate = false;
      _self.isView = false;
      _self.roleInfo = {
        id: "",
        name: "",
        enname: "",
        sort: 0,
        description: "",
        isEnabled: 1
      };
      _self.dialogTableVisible = true;
    },
    /**
     * 保存
     */
    handleSave() {
      let _self = this;
      _self.$refs.roleForm.validate(valid => {
        if (valid) {
          if (_self.isUpdate) {
            _self.RoleUpdate();
          } else {
            _self.RoleSave();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 保存
     */
    RoleSave() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.roleInfo));
      let url = roleSavePath;
      _self.roleSave({ url: url, data: params }).then(result => {
        this.$message.success(result);
        _self.handleDialogClose();
      });
    },
    /**
     * 查看
     */
    handleView(row) {
      let _self = this;
      _self.isView = true;
      _self.roleInfo = {
        id: row.id,
        name: row.name,
        enname: row.enname,
        sort: row.sort,
        description: row.description,
        isEnabled: row.isEnabled
      };
      _self.dialogTableVisible = true;
    },

    /**
     * 修改
     */
    handleUpdate(row) {
      let _self = this;
      _self.isView = false;
      _self.isUpdate = true;
      _self.roleInfo = {
        id: row.id,
        name: row.name,
        enname: row.enname,
        sort: row.sort,
        description: row.description,
        isEnabled: row.isEnabled
      };
      _self.dialogTableVisible = true;
    },
    /**
     * 修改
     */
    handleEdit() {
      let _self = this;
      let info = _self.$refs.roleListRef.selection;
      if (info.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning"
        });
      } else if (info.length > 1) {
        _self.$message({
          message: "请选择(有且只有一个)",
          type: "warning"
        });
      } else {
        let row = info[0];
        _self.isView = false;
        _self.isUpdate = true;
        _self.roleInfo = {
          id: row.id,
          name: row.name,
          enname: row.enname,
          sort: row.sort,
          description: row.description,
          isEnabled: row.isEnabled
        };
        _self.dialogTableVisible = true;
      }
    },
    /**
     * 修改后保存
     */
    RoleUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.roleInfo));
      let url = roleUpdatePath + "/" + params.id;
      _self.roleUpdate({ url: url, data: params }).then(result => {
        this.$message.success(result);
        _self.handleDialogClose();
      });
    },
    /**
     * 删除
     */
    handleDelete(row) {
      let _self = this;
      if (row) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          let info = [];
          info.push(row.id);
          _self.RoleDelete(info);
        });
      }
    },
    RoleDelete(id) {
      let _self = this;
      let url = roleDeletePath;
      let params = JSON.parse(JSON.stringify(id));
      console.info(params);
      _self.roleDelete({ url: url, data: params }).then(result => {
        _self.$message.success(result);
        _self.handleDialogClose();
      });
    },
    /**
     * 获取当前角色权限
     */
    handlePermissionSave(row) {
      let _self = this;
      _self.currentData = row;
      _self.GetRolePermission();
    },
    /**
     * 关闭权限弹窗
     */
    handlePermissionDialogClose() {
      let _self = this;
      _self.dialogPermissionFormVisible = false;
      _self.currentMenuInfo = {};
      _self.currentPermissionMap.clear();
      _self.$refs.permissionTable.clearSelection();
      _self.getPageAll();
    },
    /**
     * node选中
     */
    handleNodeChangeEvent(data, node) {
      let _self = this;
      _self.currentMenuInfo = data;
      _self.getPermissionPageList(data.id);
    },
    /**
     * check选中
     * @param data
     * @param node
     */
    handleNodeCheckClickEvent(data, node) {
      let _self = this;
      _self.currentMenuInfo = data;
      _self.getPermissionPageList(data.id);
    },
    /**
     * 获取树形菜单
     */
    getMenuTree() {
      let _self = this;
      let url = menuTreePath + "/" + _self.isAll;
      _self.menuTree({ url: url, data: null }).then(result => {
        _self.menuTreeData = result;
      });
    },
    /**
     * 获取分页的权限信息
     */
    getPermissionPageList(id) {
      let _self = this;
      let url = permissionPagePath + "/" + id;
      let params = {
        pageSize: _self.permissionPages.pageSize,
        pageNum: _self.permissionPages.pageNum
      };
      _self.permissionPageList({ url: url, data: params }).then(result => {
        _self.permissionList = result.records;
        _self.permissionPages.total = Number(result.total);
        // 切换 菜单后重新选择表格权限
        this.$nextTick(() => {
          let permissionMap = _self.currentPermissionMap;
          let permissionList = _self.permissionList;
          permissionMap.forEach(value => {
            value.forEach(v => {
              permissionList.forEach(permission => {
                if (permission.id == v) {
                  _self.$refs.permissionTable.toggleRowSelection(
                    permission,
                    true
                  );
                }
              });
            });
          });
        });
      });
    },
    /**
     * 表格选中
     */
    handleTableSelect(selection) {
      let _self = this;
      let array = [];
      if (selection.length > 0) {
        selection.forEach(value => {
          array.push(value.id);
        });
      }
      _self.currentPermissionMap.set(_self.currentMenuInfo.id, array);
    },

    /**
     * 保存权限
     */
    handlerPermissionSave() {
      let _self = this;
      let permissionMap = _self.currentPermissionMap;
      let permissionId = [];
      permissionMap.set("all", []);
      permissionMap.forEach(v => {
        v.forEach(v1 => {
          permissionId.push(v1);
        });
      });
      _self.rolePermission = permissionId;
      _self.RolePermissionSave();
    },
    /**
     * 角色权限保存
     */
    RolePermissionSave() {
      let _self = this;
      let params = _self.rolePermission;
      let url = rolePermissionSavePath + "/" + _self.currentData.id;
      if (params || params.length > 0) {
        _self.rolePermissionSave({ url: url, data: params }).then(result => {
          this.$message.success(result);
          _self.handlePermissionDialogClose();
        });
      } else {
        _self.handlePermissionDialogClose();
      }
    },
    /**
     * 获取角色权限
     */
    GetRolePermission() {
      let _self = this;
      let url = rolePermissionMapAllPath + "/" + _self.currentData.id;
      _self.rolePermissionMap({ url: url, data: null }).then(result => {
        for (let key in result) {
          _self.currentPermissionMap.set(key, result[key]); //注意这里取的是下标0和1
        }
        _self.dialogPermissionFormVisible = true;
      });
    },
    /**
     * 关闭数据范围弹窗
     */
    handleOrgDialogClose() {
      let _self = this;
      _self.dialogOrgFormVisible = false;
      _self.currentData = {};
      _self.currentOrgList = [];
    },
    /**
     * 更新数据范围
     */
    handleOrgSave(row) {
      let _self = this;
      _self.currentData = row;
      _self.dialogOrgFormVisible = true;
      _self.getRoleOrg();
    },
    /**
     * node选中
     */
    handleOrgNodeChangeEvent(data, node) {
      let _self = this;
    },
    /**
     * check选中
     * @param data
     * @param node
     */
    handleOrgNodeCheckClickEvent(data, node) {
      let _self = this;
    },
    /**
     * 获取组织树
     */
    getOrgTree() {
      let _self = this;
      let url = orgTreePath + "/" + _self.isAll;
      _self.orgTreeAll({ url: url, data: null }).then(result => {
        _self.OrgTreeData = result;
      });
    },
    /**
     * 获取角色的数据范围
     */
    getRoleOrg() {
      let _self = this;
      let info = _self.currentData;
      let url = roleOrgAllPath + "/" + info.id;
      _self.roleOrgAll({ url: url, data: null }).then(result => {
        _self.currentOrgList = result;
        this.$nextTick(() => {
          _self.$refs.orgTree.setCheckedKeys(_self.currentOrgList, false);
        });
      });
    },

    /**
     * 保存数据范围
     */
    handleOrgUpdate() {
      let _self = this;
      _self.currentOrgList = _self.$refs.orgTree.getCheckedKeys(false);
      _self.OrgSave();
    },
    OrgSave() {
      let _self = this;
      let url = roleOrgSavePath + "/" + _self.currentData.id;
      let params = JSON.parse(JSON.stringify(_self.currentOrgList));
      _self.roleOrgSave({ url: url, data: params }).then(result => {
        _self.$message.success(result);
        _self.handleOrgDialogClose();
      });
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.isEnabledOptions = _self.getMapType("system_enabled");
      });
    },
    /**获取map值 */
    getMapValue(type, value) {
      let _self = this;
      return util.dicts.getMapValue(_self.mapInfo, type, value);
    },
    getMapType(type) {
      let _self = this;
      return util.dicts.getMapType(_self.mapInfo, type);
    },
    handlerSearchRole() {
      let _self = this;
      _self.getPageAll();
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
          type: "warning"
        });
      } else if (info.length > 0) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          let ids = [];
          info.forEach(item => {
            ids.push(item.id);
          });
          _self.RoleDelete(ids);
        });
      }
    }
  }
};
</script>
<style scoped>
</style>