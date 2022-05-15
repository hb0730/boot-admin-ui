<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { userOnlineApi } from "/@/api/monitor/user_online";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { filterObj } from "/@/utils/utils";
import { Page } from "/@/api/model/domain";
import { UserOnlineModel } from "/@/api/model/monitor/user_online_model";
const searchParam = reactive({
  dataSource: [],
  formInfo: {},
  form: [
    {
      name: "登录账号",
      key: "username",
      use: true,
      type: "input",
      tips: "精确查询"
    },
    {
      name: "登录ip",
      key: "ipaddr",
      use: true,
      type: "input",
      tips: "精确查询"
    }
  ]
});
const permission = reactive({
  delete: ["online:user:logout"]
});
const tableParam = reactive({
  loading: false,
  selection: [],
  tableData: [],
  /* 分页参数 */
  pagination: {
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) => {
      return range[0] + "-" + range[1] + " 共" + total + "条";
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0
  },
  tableColumns: [
    {
      label: "",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "selection",
      showOverflowTooltip: true
    },
    {
      label: "会话id",
      prop: "tokenId",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录账号",
      prop: "username",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录ip",
      prop: "ipaddr",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "浏览器",
      prop: "browser",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "操作系统",
      prop: "os",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录时间",
      prop: "loginTime",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "操作",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "opera",
      showOverflowTooltip: true
    }
  ]
});
const handlerSearchForm = data => {
  searchParam.formInfo = data;
};
const handlerSearch = () => {
  loadData();
};
const handlerReset = data => {
  searchParam.formInfo = data;
  loadData();
};
const handlerSelectionChange = selection => {
  tableParam.selection = selection;
};
const sizeChange = (pageSize: number) => {
  tableParam.pagination.pageSize = pageSize;
};
const currentChange = (pageNum: number) => {
  tableParam.pagination.current = pageNum;
};
const loadData = (page?: Number) => {
  if (page === 1) {
    tableParam.pagination.current = 1;
  }
  const params = getQueryParams();
  tableParam.loading = true;
  userOnlineApi
    .page(params)
    .then((res: Page<UserOnlineModel[]> | string) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<UserOnlineModel[]>).records;
        tableParam.pagination.total = Number(
          (res as Page<UserOnlineModel[]>).total
        );
      }
    })
    .finally(() => {
      tableParam.loading = false;
    });
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, searchParam.formInfo);
  param.pageNum = tableParam.pagination.current;
  param.pageSize = tableParam.pagination.pageSize;
  return filterObj(param);
};
const handlerLoginOut = (data?: any) => {
  if (data) {
    loginOutBatch([data.tokenId]);
  } else {
    if (tableParam.selection && tableParam.selection.length > 0) {
      const qps = tableParam.selection.map(v => v.tokenId);
      loginOutBatch(qps);
    } else {
      warnMessage("请正确选择");
    }
  }
};
const loginOutBatch = (tokens: string[]) => {
  if (tokens && tokens.length > 0) {
    confirm("是否注销已选择的用户")
      .then(() => {
        tableParam.loading = true;
        userOnlineApi
          .logoutBatch(tokens)
          .then(res => {
            if (res !== "fail") {
              successMessage("操作成功");
              loadData(1);
            }
          })
          .finally(() => {
            tableParam.loading = false;
          });
      })
      .catch(() => {});
  }
};
onMounted(() => {
  loadData(1);
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <!-- 查询区域 -->
    <search-view
      :search-form-config="searchParam.form"
      :data-source="searchParam.dataSource"
      @get-search-form="handlerSearchForm"
      @search-run="handlerSearch"
      @search-reset="handlerReset"
    />
    <!--opera-->
    <table-opera>
      <template v-slot:opera-left>
        <el-button
          type="danger"
          :icon="useRenderIcon('fa-sign-out')"
          v-auth="permission.delete"
          @click="handlerLoginOut()"
          >强退</el-button
        >
      </template>
      <template v-slot:opera-right>
        <!---->
        <el-button
          size="default"
          title="刷新"
          circle
          :icon="useRenderIcon('refresh-right')"
          @click="loadData(1)"
        />
      </template>
    </table-opera>
    <div>
      <el-table
        :data="
          tableParam.tableData.slice(
            (tableParam.pagination.current - 1) *
              tableParam.pagination.pageSize,
            tableParam.pagination.current * tableParam.pagination.pageSize
          )
        "
        v-loading="tableParam.loading"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handlerSelectionChange"
      >
        <template v-for="item in tableParam.tableColumns">
          <!--eslint-disable-next-line-->
          <el-table-column
            v-if="item.type === 'opera'"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          >
            <!---->
            <template v-slot="scope">
              <el-button
                size="small"
                type="danger"
                :icon="useRenderIcon('fa-sign-out')"
                v-auth="permission.delete"
                @click="handlerLoginOut(scope.row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
          <!--eslint-disable-next-line-->
          <el-table-column
            v-else
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          />
        </template>
        <!---->
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="tableParam.pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="tableParam.pagination.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          background
          v-model:total="tableParam.pagination.total"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </div>
    </div>
  </el-card>
</template>

<style scoped></style>
