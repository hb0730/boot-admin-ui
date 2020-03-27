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
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
        <el-button plain type="primary" @click="handleAddNew" size="medium" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <el-col :xs="10">
        <el-table
          :data="roleList"
          style="width: 100%;"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column type="selection"></el-table-column>
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
              <el-tooltip content="查看" placement="bottom" effect="light">
                <el-button type="text" @click="handleView(scope.row)" icon="fa fa-eye" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="修改" placement="bottom" effect="light">
                <el-button
                  type="text"
                  @click="handleUpdate(scope.row)"
                  icon="fa fa-pencil"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
                  icon="fa fa-trash"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="权限" placement="bottom" effect="light">
                <el-button type="text" icon="fa fa-key" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip content="组织" placement="bottom" effect="light">
                <el-button type="text" icon="fa fa-sitemap" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="角色信息" :before-close="handleDialogClose" :visible.sync="dialogTableVisible">
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
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="handleSave" icon="fa fa-floppy-o" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
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
  roleDeletePath
} from "@/api/baseUrl";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      isEnabledOptions: [
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ],
      position: "left",
      searchInfo: {},
      roleList: [],
      // 分页
      pages: {
        page: 1,
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
      isView: false
    };
  },
  mounted() {
    let _self = this;
    _self.getPageAll();
  },
  methods: {
    ...mapActions("bootAdmin/role", [
      "roleAllPage",
      "roleSave",
      "roleUpdate",
      "roleDelete"
    ]),
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPageAll();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      this.getPageAll();
    },
    /**
     * 获取分页后的角色
     */
    getPageAll() {
      let _self = this;
      let url =
        roleAllPagePath + "/" + _self.pages.page + "/" + _self.pages.pageSize;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.roleAllPage({ url: url, data: params }).then(result => {
        _self.roleList = result.list;
        _self.pages.total = Number(result.total);
      });
    },
    /**
     * 关闭弹框
     */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
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
     * 修改后保存
     */
    RoleUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.roleInfo));
      console.info(params);
      let url = roleUpdatePath + "/" + params.id;
      _self.roleUpdate({ url: url, data: params }).then(result => {
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
          _self.RoleDelete(row.id);
        });
      }
    },
    RoleDelete(id) {
      let _self = this;
      let url = roleDeletePath + "/" + id;
      _self.roleDelete({ url: url, data: null }).then(result => {
        _self.handleDialogClose();
      });
    }
  }
};
</script>
<style>
</style>