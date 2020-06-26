<template>
  <d2-container class="page">
    <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
      <el-form-item>
        <el-input v-model="searchInfo.number" placeholder="字典编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.name" placeholder="字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInfo.isEnabled" placeholder="状态" clearable>
          <el-option
            v-for="item in isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" @click="handleSeach" icon="fa fa-search">查询</el-button>
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
            title="刷新"
            type="button"
            class="el-button el-tooltip el-button--default el-button--small is-circle"
            aria-describedby="el-tooltip-2497"
            tabindex="0"
            @click="getDictPageAll()"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="dictList"
          style="width: 100%;"
          ref="dictTableRef"
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
            label="编码"
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
            prop="dictType"
            label="类型"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template scope="scope">{{getMapValue('dict_type',scope.row.dictType)[0].label}}</template>
          </el-table-column>
          <el-table-column
            prop="isEnabled"
            label="状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isEnabled==1?'success':'danger'"
                disable-transitions
              >{{getMapValue('system_enabled',scope.row.isEnabled)[0].label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="备注"
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
                type="text"
                @click="handleUpdate(scope.row)"
                icon="fa fa-pencil"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                @click="handleDelete(scope.row)"
                type="text"
                icon="fa fa-trash"
                size="mini"
              ></el-button>
              <el-button
                title="字典项"
                @click="handleDataShow(scope.row)"
                type="text"
                icon="fa fa-plus-square"
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
    <el-dialog title="字典信息" :before-close="handleDialogClose" :visible.sync="dialogTableVisible">
      <el-form
        label-width="auto"
        :model="dictInfo"
        :label-position="position"
        ref="dictParentForm"
        required-asterisk
        :rules="dictParentRules"
        center
      >
        <el-form-item required label="编码" prop="number">
          <el-input v-model="dictInfo.number" clearable></el-input>
        </el-form-item>
        <el-form-item required label="名称" prop="name">
          <el-input v-model="dictInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="类型" prop="dictType">
          <el-select style="width:100%;" v-model="dictInfo.dictType" placeholder="请选择">
            <el-option
              v-for="item in mapInfo.get('dict_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="dictInfo.dictType" clearable></el-input> -->
        </el-form-item>
        <el-form-item required label="状态" prop="isEnabled">
          <el-radio-group v-model="dictInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="dictInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isParentView" class="dialog-footer">
        <el-button type="primary" icon="fa fa-floppy-o" @click="handleSave" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="字典项信息" :visible.sync="dialogDataTableVisible">
      <el-form ref="searchForm" :model="searchInfo" :inline="true" :label-position="position">
        <el-form-item>
          <el-button
            @click="handleDataAddNew"
            plain
            type="primary"
            size="medium"
            icon="el-icon-plus"
          >新增</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="2">
        <el-col :xs="10">
          <el-table
            :data="dataDictList"
            style="width: 100%;"
            border
            :fit="true"
            :header-cell-style="{'text-align':'center'}"
          >
            <el-table-column
              prop="dictType"
              label="字典类型"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictLabel"
              label="标签"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="dictValue"
              label="数据值"
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
                  type="text"
                  icon="fa fa-pencil"
                  @click="handleDataUpdate(scope.row)"
                  size="mini"
                ></el-button>
                <el-button
                  title="删除"
                  type="text"
                  @click="handleDataDelete(scope.row)"
                  icon="fa fa-trash"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            align="right"
            :current-page="dataSearchInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="dataSearchInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataSearchInfo.total"
            @size-change="handleSizeDataChange"
            @current-change="handleCurrentDataChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="字典项信息"
      :before-close="handleDataDialogClose"
      :visible.sync="dialogDataFormTableVisible"
    >
      <el-form
        label-width="auto"
        :model="dictInfo"
        :label-position="position"
        ref="dataDictForm"
        required-asterisk
        :rules="dataDictRules"
        center
      >
        <el-form-item label="类型" prop="dictType">
          <el-input disabled v-model="dictInfo.dictType" clearable></el-input>
        </el-form-item>
        <el-form-item required label="标签" prop="dictLabel">
          <el-input v-model="dictInfo.dictLabel" clearable></el-input>
        </el-form-item>
        <el-form-item required label="数据值" prop="dictValue">
          <el-input v-model="dictInfo.dictValue" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="dictInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="dictInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefeult">
          <el-radio-group v-model="dictInfo.isDefeult">
            <el-radio
              v-for="item in defaultOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-radio-group v-model="dictInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDataSave" type="primary" plain>保存</el-button>
        <el-button @click="handleDataDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  dictPageAllPath,
  dictSavePath,
  dictUpdatePath,
  dictDataPageAllPath,
  dictDeletePath
} from "@/api/baseUrl";
import util from "@/libs/util";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      searchInfo: {
        number: "",
        name: "",
        isEnabled: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      isEnabledOptions: [],
      defaultOptions: [],
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dataPages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dictList: [],
      dialogTableVisible: false,
      isParentUpdate: false,
      isParentView: false,
      dictParentRules: {
        number: [{ required: true, message: "请输入编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        dictType: [{ required: true, message: "请输入类型", trigger: "blur" }]
      },
      position: "left",
      dictInfo: {
        id: "",
        name: "",
        enname: "",
        number: "",
        parentId: "",
        dictType: "",
        dictValue: "",
        dictLabel: "",
        isDefeult: "",
        params: "",
        sort: 0,
        isEnabled: 1,
        description: ""
      },
      dialogDataTableVisible: false,
      dataSearchInfo: {
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      dataDictList: [],
      currentDictInfo: {},
      currentDataDictInfo: {},
      dialogDataFormTableVisible: false,
      dataDictRules: {
        dictLabel: [{ required: true, message: "请输入编码", trigger: "blur" }],
        dictValue: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      isDataUpdate: false,
      mapInfo: new Map(),
      isParent: false
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
    _self.getDictPageAll();
  },
  methods: {
    ...mapActions("bootAdmin/dict", [
      "dictSave",
      "dictPageAll",
      "dictDataPageAll",
      "dictUpdate",
      "dictDelete"
    ]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    handleSizeChange(val) {
      let _self = this;
      this.searchInfo.pageSize = val;
      _self.getDictPageAll();
    },
    handleCurrentChange(val) {
      let _self = this;
      this.searchInfo.pageNum = val;
      _self.getDictPageAll();
    },
    getDictPageAll() {
      let _self = this;
      let url = dictPageAllPath;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.dictPageAll({ url: url, data: params }).then(result => {
        _self.dictList = result.records;
        _self.searchInfo.total = Number(result.total);
      });
    },
    initInfo() {
      let _self = this;
      _self.dictInfo = {
        id: "",
        name: "",
        enname: "",
        number: "",
        parentId: "",
        dictType: "",
        dictValue: "",
        dictLabel: "",
        isDefeult: "",
        params: "",
        sort: 0,
        isEnabled: 1,
        description: ""
      };
    },
    /**
     * 新增
     */
    handleAddNew() {
      let _self = this;
      _self.isParentView = false;
      _self.isParentUpdate = false;
      _self.initInfo();
      _self.dialogTableVisible = true;
    },
    /**
     * 关闭父弹窗
     */
    handleDialogClose() {
      let _self = this;
      _self.initInfo();
      _self.searchInfo = {
        number: "",
        name: "",
        isEnabled: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      };
      _self.getDictPageAll();
      _self.dialogTableVisible = false;
    },
    /**
     * 保存
     */
    handleSave() {
      let _self = this;
      _self.$refs.dictParentForm.validate(valid => {
        if (valid) {
          if (_self.isParentUpdate) {
            _self.update();
          } else {
            _self.save();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 保存
     */
    save() {
      let _self = this;
      let url = dictSavePath;
      let parmas = JSON.parse(JSON.stringify(_self.dictInfo));
      _self.dictSave({ url: url, data: parmas }).then(result => {
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictInfo));
      let url = dictUpdatePath + "/" + params.id;
      _self.dictUpdate({ url: url, data: params }).then(result => {
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    handleUpdate(row) {
      let _self = this;
      _self.dictInfo = JSON.parse(JSON.stringify(row));
      _self.currentDictInfo = _self.dictInfo;
      _self.isParentUpdate = true;
      _self.isParentView = false;
      _self.dialogTableVisible = true;
    },
    /**
     * 修改
     */
    handleEdit() {
      let _self = this;
      let info = _self.$refs.dictTableRef.selection;
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
        _self.dictInfo = JSON.parse(JSON.stringify(info[0]));
        _self.currentDictInfo = _self.dictInfo;
        _self.isParentUpdate = true;
        _self.isParentView = false;
        _self.dialogTableVisible = true;
      }
    },
    /**
     * 获取字典项
     */
    handleDataShow(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      _self.currentDictInfo = info;
      _self.getDataDict(info.id);
      _self.dialogDataTableVisible = true;
    },
    handleSizeDataChange(val) {
      let _self = this;
      _self.dataSearchInfo.pageSize = val;
      _self.getDataDict(_self.currentDictInfo.id);
    },
    handleCurrentDataChange(val) {
      let _self = this;
      _self.dataSearchInfo.pageNum = val;
      _self.getDataDict(_self.currentDictInfo.id);
    },
    /**获取字典项值 */
    getDataDict(id) {
      let _self = this;
      if (id) {
        let url = dictDataPageAllPath + "/" + id;
        let params = JSON.parse(JSON.stringify(_self.dataSearchInfo));
        _self.dictDataPageAll({ url: url, data: params }).then(result => {
          _self.dataDictList = result.records;
          _self.dataSearchInfo.total = Number(result.total);
        });
      }
    },
    initDataDict() {
      let _self = this;
      _self.isDataUpdate = false;
      let currentDict = _self.currentDictInfo;
      _self.dictInfo = {
        id: "",
        name: "",
        enname: "",
        number: "",
        parentId: currentDict.id,
        dictType: currentDict.number,
        dictValue: "",
        dictLabel: "",
        isDefeult: 1,
        params: "",
        sort: 0,
        isEnabled: 1,
        description: ""
      };
    },
    /**
     * 字典项新增
     */
    handleDataAddNew() {
      let _self = this;
      _self.initDataDict();
      _self.dialogDataFormTableVisible = true;
    },
    /**
     * 关闭数据项表单弹窗
     */
    handleDataDialogClose() {
      let _self = this;
      _self.initDataDict();
      _self.searchInfo = {
        number: "",
        name: "",
        isEnabled: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0
      };
      let info = _self.currentDictInfo;
      _self.getDataDict(info.id);
      _self.dialogDataFormTableVisible = false;
    },
    /**
     * 保存数据项
     */
    handleDataSave() {
      let _self = this;
      _self.$refs.dataDictForm.validate(valid => {
        if (valid) {
          if (_self.isDataUpdate) {
            _self.dataUpdate();
          } else {
            _self.dataSave();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 保存数据项
     */
    dataSave() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictInfo));
      let url = dictSavePath;
      _self.dictSave({ url: url, data: params }).then(result => {
        _self.handleDataDialogClose();
      });
    },
    /**
     * 修改数据类型
     */
    dataUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.dictInfo));
      console.info(params);
      let url = dictUpdatePath + "/" + params.id;
      _self.dictUpdate({ url: url, data: params }).then(result => {
        _self.handleDataDialogClose();
      });
    },
    /**
     * 修改数据项
     */
    handleDataUpdate(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      _self.currentDataDictInfo = info;
      _self.isDataUpdate = true;
      _self.dictInfo = info;
      _self.dialogDataFormTableVisible = true;
    },
    /**
     * 删除
     */
    delete(id) {
      let _self = this;
      if (id) {
        let url = dictDeletePath;
        let params = JSON.parse(JSON.stringify(id));
        _self.dictDelete({ url: url, data: params }).then(result => {
          if (_self.isParent) {
            _self.getDictPageAll();
          } else {
            let info = _self.currentDictInfo;
            _self.getDataDict(info.id);
          }
        });
      }
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.isEnabledOptions = _self.getMapType("system_enabled");
        _self.defaultOptions = _self.getMapType("system_yes_no");
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
    /*
     * 数据项删除
     */
    handleDataDelete(row) {
      let _self = this;
      _self.isParent = false;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        _self.delete(ids);
      });
    },
    handleDelete(row) {
      let _self = this;
      _self.isParent = true;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        _self.delete(ids);
      });
    },
    /**
     * 查询
     */
    handleSeach() {
      let _self = this;
      _self.getDictPageAll();
    },
    /**
     * 删除
     */
    handleDeleteIds() {
      let _self = this;
      let info = _self.$refs.dictTableRef.selection;
      if (info.length > 0) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          let ids = [];
          info.forEach(item => {
            ids.push(item.id);
          });
          _self.isParent = true;
          _self.delete(ids);
        });
      }
    }
  }
};
</script>
<style >
</style>