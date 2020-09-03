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
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button type="button" class="el-button filter-item el-button--success el-button--mini">
            <i class="fa fa-plus"></i>
            <span>新增</span>
          </button>
          <button type="button" class="el-button filter-item el-button--primary el-button--mini">
            <i class="fa fa-edit"></i>
            <span>修改</span>
          </button>
          <button type="button" class="el-button filter-item el-button--danger el-button--mini">
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
              >{{scope.row.isEnabled==1?'启动':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>菜单列表</span>
          <el-button
            class="el-button el-button--primary el-button--mini"
            style="float: right; padding: 6px 9px;"
          >
            <i class="el-icon-check"></i>保存
          </el-button>
        </div>
        <el-tree
          :data="menuTreeData"
          show-checkbox
          ref="tree"
          node-key="id"
          :props="treeProps"
          check-strictly
          :highlight-current="true"
          :expand-on-click-node="true"
          default-expand-all
        ></el-tree>
      </el-card>
    </el-col>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
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
      isEnabledOptions: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      roleList: [],
      menuTreeData: [],
      treeProps: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    let _self = this;
    _self.getTree();
  },
  methods: {
    ...mapActions("bootAdmin/menu", ["queryPermissionTree"]),
    getTree() {
      let _selft = this;
      _selft.queryPermissionTree().then((result) => {
        _selft.menuTreeData = result;
      });
    },
  },
};
</script>