<script setup lang="ts">
import FormSearch, { type FormField } from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import UserResetPasswd from "./reset-passwd.vue";
import UserEdit from "./user-edit.vue";
import { PureTable } from "@pureadmin/table";
import { enableOptions } from "@/constants/constants";
import { reactive, computed, ref, onMounted } from "vue";
import * as $userApi from "@/api/sys/user";
import { queryList as orgQueryList } from "@/api/sys/org";
import { roleQueryList } from "@/api/sys/role";
import { onBeforeMount } from "vue";
import { hasAuth } from "@/router/utils";
import message from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { watch } from "vue";
const userEditRef = ref();
const userResetPasswdRef = ref();
defineOptions({
  name: "userList"
});
const props: any = defineProps({
  mode: {
    required: false,
    type: String,
    default: "table"
  },
  orgInfo: {
    required: false,
    type: Object,
    default: () => ({})
  }
});
const searchFormFields = computed((): FormField[] => {
  const fields: FormField[] = [
    {
      type: "input",
      label: "帐号",
      prop: "username",
      placeholder: "请输入帐号模糊查询"
    },
    {
      type: "input",
      label: "姓名",
      prop: "nickname",
      placeholder: "请输入姓名模糊查询"
    },
    {
      type: "input",
      label: "联系电话",
      prop: "phone",
      placeholder: "请输入联系电话精准查询"
    },
    {
      type: "select",
      label: "状态",
      prop: "enable",
      placeholder: "请选择",
      dataSourceKey: "enabledOptions",
      options: {
        keys: {
          label: "label",
          value: "value",
          prop: "value"
        },
        filterable: true
      }
    }
  ];
  if (props.mode === "table") {
    fields.unshift({
      type: "select",
      label: "所属机构",
      prop: "orgId",
      placeholder: "请选择所属机构",
      dataSourceKey: "orgList",
      options: {
        filterable: true,
        keys: {
          prop: "id",
          value: "id",
          label: "name"
        }
      }
    });
    return fields;
  } else {
    return fields;
  }
});
const pageData: any = reactive({
  mode: "table",
  permission: {
    query: ["user:query:page"],
    save: ["user:save"],
    update: ["user:update"],
    del: ["user:del"]
  },
  searchParam: {
    searchState: true,
    fields: [
      {
        type: "input",
        label: "帐号",
        prop: "username",
        placeholder: "请输入帐号模糊查询"
      },
      {
        type: "input",
        label: "姓名",
        prop: "nickname",
        placeholder: "请输入姓名模糊查询"
      },
      {
        type: "input",
        label: "联系电话",
        prop: "phone",
        placeholder: "请输入联系电话精准查询"
      },
      {
        type: "select",
        label: "状态",
        prop: "enable",
        placeholder: "请选择",
        dataSourceKey: "enabledOptions",
        options: {
          keys: {
            label: "label",
            value: "value",
            prop: "value"
          },
          filterable: true
        }
      }
    ],
    searchForm: {}
  },
  dataSource: {
    orgList: [],
    enabledOptions: enableOptions
  },
  /*按钮 */
  btnOpts: {
    size: "small",
    leftBtns: [
      {
        key: "add",
        label: "新增",
        type: "primary",
        icon: "ep:plus",
        state: true,
        permission: ["user:save"]
      },
      {
        key: "update",
        label: "修改",
        type: "success",
        icon: "ep:edit",
        state: false,
        permission: ["user:update"]
      }
    ],
    rightBtns: [
      {
        key: "search",
        label: "查询",
        icon: "ep:search",
        state: true,
        options: {
          circle: true
        }
      },
      {
        key: "refresh",
        label: "刷新",
        icon: "ep:refresh",
        state: true,
        options: {
          circle: true
        }
      },
      {
        key: "switch",
        label: "切换",
        icon: "ep:switch",
        state: true,
        options: {
          circle: true
        }
      }
    ]
  },
  tableParam: {
    list: [],
    columns: [
      {
        label: "用户帐号",
        prop: "username",
        slot: "username"
      },
      {
        label: "姓名",
        prop: "nickname",
        slot: "ellipsis"
      },
      {
        label: "所属机构",
        prop: "orgName",
        slot: "ellipsis"
      },
      {
        label: "状态",
        prop: "enable",
        slot: "enableScope"
      },
      {
        label: "更新人",
        prop: "modifiedBy",
        slot: "ellipsis"
      },
      {
        label: "更新时间",
        prop: "modified",
        slot: "ellipsis"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ],
    loading: false,
    pagination: {
      pageSize: 10,
      defaultPageSize: 10,
      currentPage: 1,
      background: true,
      total: 0
    }
  }
});
const btnClickHandle = (val: string) => {
  switch (val) {
    case "add":
      userEditRef.value!.open({ isEnabled: 1 }, pageData.dataSource, "add");
      break;
    case "update":
      break;
    case "search":
      _updateSearchState();
      break;
    case "refresh":
      _loadData();
      break;
    case "switch":
      switchTable();
      break;
    default:
      break;
  }
};
const switchTable = () => {
  emits("switchMode", props.mode === "table" ? "tree" : "table");
};
/**
 *  更新搜索表单
 * @param data .
 */
const _updateSearchFormData = (data: any) => {
  pageData.searchParam.searchForm = data;
};
/**
 * 点击搜索按钮
 */
const _searchForm = (data: any) => {
  pageData.searchParam.searchForm = data;
  _loadData();
};
/**
 * 重置
 */
const _resetSearchForm = (data?) => {
  pageData.searchParam.searchForm = data;
};
/**
 * 更新搜索表达的状态
 */
const _updateSearchState = () => {
  pageData.searchParam.searchState = !pageData.searchParam.searchState;
};
const handleChangePageSize = (val: any) => {
  pageData.tableParam.pagination.pageSize = val;
  _loadData();
};
const handleChangeCurrentPage = (val: any) => {
  pageData.tableParam.pagination.currentPage = val;
  _loadData();
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, pageData.searchParam.searchForm);
  param.current = pageData.tableParam.pagination.currentPage;
  param.size = pageData.tableParam.pagination.pageSize;
  if (props.orgInfo) {
    param.orgId = props.orgInfo.id;
  }
  return param;
};
const _loadData = (page?: number) => {
  const query = getQueryParams();
  if (page) {
    query.current = page;
  }
  pageData.tableParam.loading = true;
  $userApi
    .queryPage(query)
    .then((res: any) => {
      if (res.success) {
        pageData.tableParam.list = res.result.records;
        pageData.tableParam.pagination.total = Number(res.result.total);
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
const queryOrg = () => {
  const query = { isEnable: 1 };
  orgQueryList(query).then((res: any) => {
    if (res.success) {
      pageData.dataSource.orgList = res.result;
    }
  });
};
const queryRoles = () => {
  roleQueryList({ enabled: 1 }).then((res: any) => {
    if (res.success) {
      pageData.dataSource.roleList = res.result;
    }
  });
};
const handleEdit = (row: any) => {
  userEditRef.value!.open(row, pageData.dataSource, "edit");
};
const handleDel = (row: any) => {
  message.confirm("确认删除当前数据").then(() => {
    batchDel([row.id]);
  });
};
const batchDel = (ids: string[]) => {
  if (ids && ids.length > 0) {
    $userApi.del(ids).then((res: any) => {
      if (res.success) {
        message.success("删除成功");
        _loadData();
      } else {
        message.warning(res.message);
      }
    });
  }
};
const handleResetPasswd = (row: any) => {
  userResetPasswdRef.value!.open(row);
};
const handleDetail = (row: any) => {
  userEditRef.value!.open(row, pageData.dataSource, "detail");
};
watch(
  () => props.orgInfo,
  val => {
    if (val) {
      _loadData();
    }
  }
);
onBeforeMount(() => {
  queryOrg();
  queryRoles();
});
onMounted(() => {
  _loadData(1);
});
const emits = defineEmits(["switchMode"]);
</script>

<template>
  <div>
    <form-search
      :show="pageData.searchParam.searchState"
      :form-field="searchFormFields"
      :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData"
      @search="_searchForm"
      @reset="_resetSearchForm"
      :query-permission="pageData.permission.query"
    />
    <!--operate-->
    <table-buttons
      :size="pageData.btnOpts.size"
      :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns"
      @click="btnClickHandle"
    />
    <!--table-->
    <pure-table
      :data="pageData.tableParam.list"
      :columns="pageData.tableParam.columns"
      row-key="id"
      border
      stripe
      :header-row-class-name="'table-header'"
      :loading="pageData.tableParam.loading"
      :pagination="pageData.tableParam.pagination"
      @page-current-change="handleChangeCurrentPage"
      @page-size-change="handleChangePageSize"
    >
      <template #ellipsis="{ row, column }">
        <el-tooltip placement="top-start" :content="row[column.property]">{{
          row[column.property]
        }}</el-tooltip>
      </template>
      <template #username="{ row }">
        <el-link type="primary" @click="handleDetail(row)">{{
          row.username
        }}</el-link>
      </template>
      <template #enableScope="scope">
        <el-tag v-if="scope.row.enabled">启用</el-tag>
        <el-tag v-else type="info">禁用</el-tag>
      </template>
      <template #operation="{ row }">
        <div class="flex justify-center items-center">
          <el-link
            v-show="hasAuth(pageData.permission.update) && row.isManage !== 1"
            type="primary"
            @click="handleEdit(row)"
            >编辑</el-link
          >
          <el-divider
            v-show="hasAuth(pageData.permission.del) && row.isManage !== 1"
            direction="vertical"
          />
          <el-link
            v-show="hasAuth(pageData.permission.del) && row.isManage !== 1"
            type="primary"
            @click="handleDel(row)"
            >删除</el-link
          >
          <el-divider v-show="row.isManage !== 1" direction="vertical" />
          <el-dropdown v-show="row.isManage !== 1">
            <el-link type="primary"
              >更 多
              <el-icon class="el-icon--right">
                <component :is="useRenderIcon('ep:arrow-down')" />
              </el-icon>
            </el-link>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleResetPasswd(row)"
                  >重置密码</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </pure-table>
    <user-edit ref="userEditRef" @confirm="_loadData" />
    <user-reset-passwd ref="userResetPasswdRef" />
  </div>
</template>
