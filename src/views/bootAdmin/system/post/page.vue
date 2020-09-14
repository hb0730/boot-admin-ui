<template>
  <d2-container class="page">
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
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
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
            type="primary"
            @click="handlerAddNew"
            class="el-button filter-item el-button--success el-button--mini"
          >
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button
            type="primary"
            @click="handlerEdit"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button
            type="button"
            @click="handlerRemove"
            class="el-button filter-item el-button--danger el-button--mini"
          >
            <i class="fa fa-remove"></i>
            <span>删除</span>
          </button>
          <button
            class="el-button filter-item el-button--info el-button--mini"
            style="padding:0 0 0 0px"
          >
            <el-upload
              ref="upload"
              :limit="1"
              action
              :show-file-list="false"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <button class="el-button filter-item el-button--info el-button--mini">
                <i class="fa fa-upload"></i>
                <span>导入</span>
              </button>
            </el-upload>
          </button>
          <button
            type="button"
            @click="handlerExport"
            class="el-button filter-item el-button--warning el-button--mini"
          >
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
            @click="getPage"
            title="刷新"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="postList"
          style="width: 100%;"
          ref="postListRef"
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
              >{{getDictEntryInfo('sys_common_status',scope.row.isEnabled).label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
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
                title="修改"
                type="primary"
                @click="handlerUpdate(scope.row)"
                icon="fa fa-pencil"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                @click="handlerDelete(scope.row)"
                type="danger"
                icon="fa fa-trash"
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
          :total="Number(searchInfo.total)"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="岗位信息"
      :before-close="handleDialogClose"
      :visible.sync="dialogTableVisible"
      :destroy-on-close="!dialogTableVisible"
    >
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
        <el-form-item required label="岗位状态" prop="isEnabled">
          <el-radio-group v-model="postInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
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
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="postInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerSave" type="primary">保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      //检索
      searchInfo: {
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        number: "",
        name: "",
        isEnabled: "",
      },
      position: "left",
      isEnabledOptions: [],
      // 岗位列表
      postList: [],
      dialogTableVisible: false,
      // 岗位信息
      postInfo: {
        id: "",
        name: "",
        number: "",
        isEnabled: 0,
        sort: 999,
        description: "",
      },
      postRules: {
        name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
        number: [
          { required: true, message: "请输入岗位编码", trigger: "blur" },
        ],
      },
      isUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getPage();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/post", [
      "postSave",
      "postPage",
      "postUpdate",
      "postDelete",
      "postExport",
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
     * 关闭弹出
     */
    handleDialogClose() {
      let _self = this;
      _self.initPostInfo();
      _self.dialogTableVisible = false;
      _self.getPage();
    },
    handleSizeChange(pageSize) {
      let _self = this;
      _self.searchInfo.pageSize = pageSize;
      _self.getPage();
    },
    handleCurrentChange(pageNum) {
      let _self = this;
      _self.searchInfo.pageNum = pageNum;
      _self.getPage();
    },
    /**
     * 分页查询
     */
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.postPage({ data: params }).then((result) => {
        _self.postList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    /**
     * 初始化post信息
     */
    initPostInfo() {
      let _self = this;
      _self.postInfo = {
        id: "",
        name: "",
        number: "",
        isEnabled: 0,
        sort: 999,
        description: "",
      };
    },
    /**
     * 新增
     */
    handlerAddNew() {
      let _self = this;
      _self.initPostInfo();
      _self.isUpdate = false;
      _self.dialogTableVisible = true;
    },
    /**
     * 保存
     */
    handlerSave() {
      let _self = this;
      _self.$refs.postForm.validate((valid) => {
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
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.postInfo));
      let id = _self.postInfo.id;
      _self.postUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDialogClose();
      });
    },
    save() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.postInfo));
      _self.postSave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerUpdate(row) {
      let _self = this;
      _self.initPostInfo();
      _self.isUpdate = true;
      _self.postInfo = JSON.parse(JSON.stringify(row));
      _self.dialogTableVisible = true;
    },
    /**
     * 修改
     */
    handlerEdit() {
      let _self = this;
      let info = _self.$refs.postListRef.selection;
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
        _self.postInfo = info[0];
        _self.isUpdate = true;
        _self.dialogTableVisible = true;
      }
    },
    /**
     * 删除
     */
    handlerDelete(row) {
      let _self = this;
      if (row) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning",
        }).then(() => {
          const ids = [];
          ids.push(row.id);
          _self.delete(ids);
        });
      }
    },
    /**
     * 删除
     */
    handlerRemove() {
      let _self = this;
      let info = _self.$refs.postListRef.selection;
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
          _self.isParent = true;
          _self.delete(ids);
        });
      }
    },
    delete(ids) {
      let _self = this;
      let params = JSON.parse(JSON.stringify(ids));
      _self.postDelete({ data: params }).then((result) => {
        _self.$message.success("删除成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 导出
     */
    handlerExport() {
      let _self = this;
      MessageBox.confirm("是否导出当前全部数据", "导出", {
        type: "warning",
      }).then(() => {
        let params = JSON.parse(JSON.stringify(_self.searchInfo));
        _self.postExport({ data: params }).then((result) => {
          _self.$message.success("导出成功");
        });
      });
    },
  },
};
</script>