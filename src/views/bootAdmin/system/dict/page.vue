<template>
  <d2-container class="page">
    <el-row>
      <el-col
        style="padding-left: 5px; padding-right: 5px; margin-bottom: 10px;"
        :xs="24"
        :sm="24"
        :md="10"
        :lg="11"
        :xl="11"
      >
        <el-card>
          <el-row>
            <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
              <el-form-item>
                <el-input v-model="searchInfo.name" placeholder="名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="searchInfo.type" placeholder="类型" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  plain
                  size="medium"
                  @click="handleDictCurrentChange(1)"
                  icon="fa fa-search"
                >查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-row :gutter="2">
              <div class="avue-crud__menu">
                <div class="avue-crud__left">
                  <button
                    type="button"
                    class="el-button filter-item el-button--success el-button--mini"
                    @click="handlerAddNewDict"
                  >
                    <i class="fa fa-plus"></i>
                    <span>新增</span>
                  </button>
                  <button
                    type="button"
                    class="el-button filter-item el-button--primary el-button--mini"
                    @click="handlerDictEdit"
                  >
                    <i class="fa fa-edit"></i>
                    <span>修改</span>
                  </button>
                  <button
                    type="button"
                    class="el-button filter-item el-button--danger el-button--mini"
                    @click="handlerDictRemove"
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
                      action
                      :limit="1"
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
                    @click="getDictPage"
                    title="刷新"
                  >
                    <i class="el-icon-refresh"></i>
                  </button>
                </div>
              </div>
              <el-col :xs="10">
                <el-table
                  :data="dictDataList"
                  style="width: 100%;"
                  ref="dictListRef"
                  border
                  :fit="true"
                  highlight-current-row
                  :header-cell-style="{'text-align':'center'}"
                  @row-click="dictRoleTableRowClick"
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
                    label="名称"
                    sortable
                    resizable
                    :show-overflow-tooltip="true"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="type"
                    label="类型"
                    sortable
                    resizable
                    :show-overflow-tooltip="true"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="description"
                    label="备注"
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
                        @click="handlerDictUpdate(scope.row)"
                        type="primary"
                        icon="fa fa-pencil"
                        size="mini"
                      ></el-button>
                      <el-button
                        title="删除"
                        @click="handlerDictDelete(scope.row)"
                        type="danger"
                        icon="fa fa-trash"
                        size="mini"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  align="left"
                  @size-change="handleDictSizeChange"
                  @current-change="handleDictCurrentChange"
                  :current-page="searchInfo.pageNum"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="searchInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="searchInfo.total"
                ></el-pagination>
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
      <el-col
        style="padding-left: 5px; padding-right: 5px;"
        :xs="24"
        :sm="24"
        :md="14"
        :lg="13"
        :xl="13"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span>字典项列表</span>
            <el-button
              style="float: right; padding: 4px 10px;"
              icon="el-icon-plus"
              type="primary"
              :disabled="!ifAddEntry"
              @click="handlerEntryAddNew"
            >新增</el-button>
          </div>
          <el-table
            :data="entryDataList"
            style="width: 100%;"
            ref="dictEntryListRef"
            border
            :fit="true"
            highlight-current-row
            :header-cell-style="{'text-align':'center'}"
          >
            <el-table-column
              prop="name"
              label="名称"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="值"
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
              prop="description"
              label="备注"
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
                  @click="handlerEntryUpdate(scope.row)"
                  type="primary"
                  icon="fa fa-pencil"
                  size="mini"
                ></el-button>
                <el-button
                  title="删除"
                  @click="handlerEntryDelete(scope.row)"
                  type="danger"
                  icon="fa fa-trash"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            align="left"
            @size-change="handleDictEntrySizeChange"
            @current-change="handleDictEntryCurrentChange"
            :current-page="searchEntryInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchEntryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchEntryInfo.total"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="字典信息"
      :before-close="handleDictDialogClose"
      :visible.sync="dictDialogTableVisible"
      :destroy-on-close="!dictDialogTableVisible"
    >
      <el-form
        label-width="auto"
        :model="dictInfo"
        :label-position="position"
        ref="dictForm"
        required-asterisk
        :rules="dictRules"
        center
      >
        <el-form-item required label="名称" prop="name">
          <el-input v-model="dictInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="类型" prop="type">
          <el-input v-model="dictInfo.type" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="dictInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerDictSave" size="medium">保存</el-button>
        <el-button size="medium" @click="handleDictDialogClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="字典项信息"
      :before-close="handleDictEntryDialogClose"
      :visible.sync="dictEntryDialogTableVisible"
      :destroy-on-close="!dictEntryDialogTableVisible"
    >
      <el-form
        label-width="auto"
        :model="dictEntryInfo"
        :label-position="position"
        ref="dictEntryForm"
        required-asterisk
        :rules="dictEntryRules"
        center
      >
        <el-form-item label="字典" prop="parentId">
          <el-input :disabled="true" v-model="currentRowDictData.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="名称" prop="name">
          <el-input v-model="dictEntryInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="值" prop="value">
          <el-input v-model="dictEntryInfo.value" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="dictEntryInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
         <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="dictEntryInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerEntrySave" size="medium">保存</el-button>
        <el-button size="medium" @click="handleDictEntryDialogClose">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from "vuex";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      // 字典检索
      searchInfo: {
        name: "",
        type: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      // 字典列表
      dictDataList: [],
      // 字典信息
      dictInfo: {
        id: "",
        name: "",
        type: "",
        description: "",
      },
      dictRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
      },
      position: "left",
      dictDialogTableVisible: false,
      isDictUpdate: false,
      currentRowDictData: {},
      ifAddEntry: false,
      ////分录
      searchEntryInfo: {
        parentId: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      // 分录列表
      entryDataList: [],
      dictEntryDialogTableVisible: false,
      dictEntryInfo: {
        id: "",
        parentId: "",
        name: "",
        value: "",
        sort: 999,
        description:'',
      },
      dictEntryRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        value: [{ required: true, message: "请输入值", trigger: "blur" }],
      },
      isEntryUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getDictPage();
  },
  methods: {
    ...mapActions("bootAdmin/dict", [
      "dictSave",
      "dictUpdate",
      "dictDelete",
      "dictPage",
    ]),
    ...mapActions("bootAdmin/dictEntry", [
      "dictEntrySave",
      "dictEntryUpdate",
      "dictEntryDelete",
      "dictEntryPage",
    ]),
    getDictPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.dictPage({ data: params }).then((result) => {
        _self.dictDataList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    handleDictSizeChange(pageSize) {
      let _self = this;
      _self.searchInfo.pageSize = pageSize;
      _self.getDictPage();
    },
    handleDictCurrentChange(pageNum) {
      let _self = this;
      _self.searchInfo.pageNum = pageNum;
      _self.getDictPage();
    },
    /**
     * 关闭弹窗
     */
    handleDictDialogClose() {
      let _self = this;
      _self.dictDialogTableVisible = false;
      _self.initDictInfo();
      _self.getDictPage();
    },
    /**
     * 初始字典信息
     */
    initDictInfo() {
      let _self = this;
      _self.dictInfo = {
        id: "",
        name: "",
        type: "",
        description: "",
      };
    },
    /**
     * 新增字典
     */
    handlerAddNewDict() {
      let _self = this;
      _self.initDictInfo();
      _self.isDictUpdate = false;
      _self.dictDialogTableVisible = true;
      _self.getDictPage();
    },
    /**
     * 保存
     */
    handlerDictSave() {
      let _self = this;
      _self.$refs.dictForm.validate((valid) => {
        if (valid) {
          if (_self.isDictUpdate) {
            _self.updateDict();
          } else {
            _self.saveDict();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    updateDict() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictInfo));
      let id = _self.dictInfo.id;
      _self.dictUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDictDialogClose();
      });
    },
    saveDict() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictInfo));
      _self.dictSave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDictDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerDictUpdate(row) {
      let _self = this;
      _self.initDictInfo();
      _self.dictInfo = JSON.parse(JSON.stringify(row));
      _self.isDictUpdate = true;
      _self.dictDialogTableVisible = true;
    },
    /**
     * 修改
     */
    handlerDictEdit() {
      let _self = this;
      let info = _self.$refs.dictListRef.selection;
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
        _self.isDictUpdate = true;
        _self.initDictInfo();
        _self.dictInfo = JSON.parse(JSON.stringify(info[0]));
        _self.dictDialogTableVisible = true;
      }
    },
    /**
     * 删除
     */
    handlerDictDelete(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        _self.deleteDict(ids);
      });
    },
    handlerDictRemove() {
      let _self = this;
      let info = _self.$refs.dictListRef.selection;
      if (info.length > 0) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning",
        }).then(() => {
          let ids = [];
          info.forEach((item) => {
            ids.push(item.id);
          });
          _self.deleteDict(ids);
        });
      } else {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      }
    },
    deleteDict(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.dictDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.handleDictDialogClose();
        });
      }
    },
    /**
     * 表格点击
     */
    dictRoleTableRowClick(row, column, cell, event) {
      let _self = this;
      _self.currentRowDictData = JSON.parse(JSON.stringify(row));
      _self.searchEntryInfo.pageNum = 1;
      _self.ifAddEntry = true;
      _self.getDictEntryPage();
    },
    isNull(data) {
      if (data) {
        return true;
      } else {
        return false;
      }
    },
    //关闭分录弹窗
    handleDictEntryDialogClose() {
      let _self = this;
      _self.$refs.dictEntryForm.resetFields()
      _self.dictEntryDialogTableVisible = false;
      _self.getDictEntryPage();
    },
    /**
     * 分录分页
     */
    getDictEntryPage() {
      let _self = this;
      let info = _self.currentRowDictData;
      if (info) {
        _self.searchEntryInfo.parentId = info.id;
      }
      let params = JSON.parse(JSON.stringify(_self.searchEntryInfo));
      _self.dictEntryPage({ data: params }).then((result) => {
        _self.entryDataList = result.records;
        _self.searchEntryInfo.total = Number(result.total);
      });
    },
    initEntry() {
      let _self = this;
      _self.dictEntryInfo = {
        id: "",
        parentId: _self.currentRowDictData.id,
        name: "",
        value: "",
        sort: 999,
        description:'',
      };
    },
    /**
     * 分录新增
     */
    handlerEntryAddNew() {
      let _self = this;
      _self.isEntryUpdate = false;
      _self.initEntry();
      _self.dictEntryDialogTableVisible = true;
    },
    /**
     * 新增
     */
    handlerEntrySave() {
      let _self = this;
      if (!_self.currentRowDictData) {
        _self.$message.warning("请选择父项之后新增");
        return;
      }
      _self.$refs.dictEntryForm.validate((valid) => {
        if (valid) {
          if (_self.isEntryUpdate) {
            _self.updateDictEntry();
          } else {
            _self.saveDictEntry();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    updateDictEntry() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictEntryInfo));
      let id = _self.dictEntryInfo.id;
      _self.dictEntryUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDictEntryDialogClose();
      });
    },
    saveDictEntry() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictEntryInfo));
      params.parentId = _self.currentRowDictData.id;
      _self.dictEntrySave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDictEntryDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerEntryUpdate(row) {
      let _self = this;
      _self.isEntryUpdate = true;
      _self.dictEntryInfo = JSON.parse(JSON.stringify(row));
      _self.dictEntryDialogTableVisible = true;
    },
    /**
     * 删除
     */
    handlerEntryDelete(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(info.id);
        _self.deleteEntry(ids);
      });
    },
    deleteEntry(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.dictEntryDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.handleDictEntryDialogClose();
        });
      }
    },
    handleDictEntrySizeChange(pageSie) {
      let _self = this;
      _self.searchEntryInfo.pageSize = pageSie;
      _self.getDictEntryPage();
    },
    handleDictEntryCurrentChange(pageNum) {
      let _self = this;
      _self.searchEntryInfo.pageNum = pageNum;
      _self.getDictEntryPage();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table__body tr.current-row > td {
  background-color: #e8f4ff;
}
</style>