<template>
  <d2-container>
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.number" placeholder="岗位编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.isEnabled" placeholder="岗位状态" clearable>
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
        <el-button plain type="primary" size="medium" @click="handleAddNew" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <el-col :xs="10">
        <el-table
          :data="postList"
          style="width: 100%;"
          border
          :fit="true"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="number"
            label="岗位编码"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="岗位名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="enname"
            label="岗位英文名称"
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
            label="岗位状态"
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
    <el-dialog title="岗位信息" :before-close="handleDialogClose" :visible.sync="dialogTableVisible">
      <el-form
        label-width="auto"
        :model="postInfo"
        :label-position="position"
        ref="postForm"
        required-asterisk
        :rules="postRules"
        center
      >
        <el-form-item required label="岗位编码" prop="number">
          <el-input v-model="postInfo.number" clearable></el-input>
        </el-form-item>
        <el-form-item required label="岗位名称" prop="name">
          <el-input v-model="postInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位英文名称" prop="enname">
          <el-input v-model="postInfo.enname" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="postInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item required label="岗位状态" prop="isEnabled">
          <el-radio-group v-model="postInfo.isEnabled">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="postInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button type="primary" icon="fa fa-floppy-o" @click="handleSave" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import {
  postSavePath,
  postAllPagePath,
  postUpdatePath,
  postDeletePath
} from "@/api/baseUrl";
import { mapActions } from "vuex";
import { MessageBox } from 'element-ui';
export default {
  data() {
    return {
      searchInfo: {},
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
      postList: [],
      dialogTableVisible: false,
      postInfo: {
        id: "",
        number: "",
        name: "",
        enname: "",
        sort: 0,
        isEnabled: 1,
        description: ""
      },
      isUpdate: false,
      position: "left",
      postRules: {
        name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入岗位编码", trigger: "blur" }
        ],
        isEnabled: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      isView: false,
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    let _self = this;
    _self.getPostPage();
  },
  methods: {
    ...mapActions("bootAdmin/post", [
      "postAllPage",
      "postSave",
      "postUpdate",
      "postDelete"
    ]),
    /*关闭弹出 */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
      _self.init();
      _self.getPostPage();
    },
    init() {
      let _self = this;
      this.postInfo = {
        id: "",
        number: "",
        name: "",
        enname: "",
        sort: 0,
        isEnabled: 1,
        description: ""
      };
    },
    /**新增 */
    handleAddNew() {
      let _self = this;
      _self.init();
      _self.isUpdate = false;
      _self.isView = false;
      _self.dialogTableVisible = true;
    },
    /**
     * 保存
     */
    handleSave() {
      let _self = this;
      _self.$refs.postForm.validate(valid => {
        if (valid) {
          if (_self.isUpdate) {
            _self.update();
          } else {
            _self.save();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    save() {
      let _self = this;
      let url = postSavePath;
      let params = JSON.parse(JSON.stringify(_self.postInfo));
      _self.postSave({ url: url, data: params }).then(result => {
        _self.handleDialogClose();
      });
    },
    update() {
      let _self = this;
      let url = postUpdatePath + "/" + _self.postInfo.id;
      let params = JSON.parse(JSON.stringify(_self.postInfo));
      _self.postUpdate({ url: url, data: params }).then(result => {
        _self.handleDialogClose();
      });
    },
    getPostPage() {
      let _self = this;
      let url =
        postAllPagePath + "/" + _self.pages.page + "/" + _self.pages.pageSize;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.postAllPage({ url: url, data: params }).then(result => {
        _self.postList = result.list;
        _self.pages.total = Number(result.total);
      });
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
      this.getPostPage();
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
      this.getPostPage();
    },
    /**
     * 查看
     */
    handleView(row) {
      let _self = this;
      _self.postInfo = row;
      _self.isView = true;
      _self.isUpdate = false;
      _self.dialogTableVisible = true;
    },
    /**
     * 修改
     */
    handleUpdate(row) {
      let _self = this;
      _self.postInfo = row;
      _self.isView = false;
      _self.isUpdate = true;
      _self.dialogTableVisible = true;
    },
    /**
     * 删除
     */
    handleDelete(row) {
      let _self = this;
       MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          _self.delete(row.id);
        });
    },
    delete(id) {
      let _self = this;
      let url = postDeletePath + "/" + id;
      _self.postDelete({ url: url, data: null }).then(reuslt => {
        _self.getPostPage();
      });
    }
  }
};
</script>