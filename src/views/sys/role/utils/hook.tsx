import { h, onMounted, reactive, ref } from "vue";
import editForm from "../form.vue";
import permissionTreeForm from "../tree.vue";
import type { OptionsType } from "@/components/ReSegmented";
import { RoleEnableOptions } from "./enums";
import type { PaginationProps } from "@pureadmin/table";
import { usePublicHooks } from "../../hooks";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import { pageRole } from "@/api/sys/role";
import * as roleApi from "@/api/sys/role";
import { message } from "@/utils/message";
import { isFunction } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";

export function useRole() {
  const formRef = ref();
  const treeRef = ref();

  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

  const permission = reactive({
    query: ["sys:role:list"],
    save: ["sys:role:add"],
    edit: ["sys:role:update"],
    delete: ["sys:role:delete"],
    assignPermission: ["sys:role:assignPermission"]
  });
  const searchData = reactive<{
    show: boolean;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
    data: any;
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "角色名称",
        options: {
          prop: "name",
          placeholder: "请输入角色名称",
          clearable: true
        }
      },
      {
        type: "input",
        label: "角色标识",
        options: {
          prop: "code",
          placeholder: "请输入角色标识",
          clearable: true
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
          clearable: true,
          dataSourceKey: "enabledOptions",
          selectOptionKey: {
            label: "label",
            value: "value",
            prop: "value"
          }
        }
      }
    ],
    dataSource: {
      enabledOptions: RoleEnableOptions
    }
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const tableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    columns: [
      {
        label: "角色名称",
        prop: "name"
      },
      {
        label: "角色标识",
        prop: "code"
      },
      {
        label: "状态",
        cellRenderer: scope => (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.enabled}
            active-value={true}
            inactive-value={false}
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChange(scope as any)}
          />
        ),
        minWidth: 90
      },
      {
        label: "备注",
        prop: "description",
        minWidth: 160
      },
      {
        label: "创建时间",
        prop: "created",
        minWidth: 160
      },
      {
        label: "操作",
        fixed: "right",
        width: 210,
        slot: "operation"
      }
    ],
    loading: false,
    dataList: []
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        row.enabled = !row.enabled ? false : true;
        const { success } = await updateRole(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "停用"}${row.name}`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  function openDialog(title = "新增", data?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          id: data?.id ?? undefined,
          name: data?.name ?? "",
          code: data?.code ?? "",
          description: data?.description ?? "",
          enabled: data?.enabled ?? true
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`保存成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              await updateRole(curData);
              chores();
            } else {
              await addRole(curData);
              chores();
            }
          }
        });
      }
    });
  }

  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  function handleChangeCurrentPage(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handleChangePageSize(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const { success, data } = await pageRole(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }
  /**
   * 角色赋权
   */
  function openPermission(row?: any) {
    addDrawer({
      title: "角色权限配置",
      props: {
        formInline: {
          role: row,
          selectedIds: []
        }
      },
      width: "45%",
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: [
        {
          label: "取消",
          bg: true,
          btnClick: ({ drawer: { options, index } }) => {
            const done = () =>
              closeDrawer(options, index, { command: "cancel" });
            if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
              options.beforeCancel(done, { options, index });
            } else {
              done();
            }
          }
        },
        {
          label: "确认",
          type: "primary",
          bg: true,
          confirm: true,
          tips: "是否更新当前角色的权限信息",
          btnClick: ({ drawer: { options, index } }) => {
            const done = () => closeDrawer(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => h(permissionTreeForm, { ref: treeRef }),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline;
        function chores() {
          message(`更新成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        await assignPermission(curData.role?.id, curData.selectedIds);
        chores();
      }
    });
  }
  async function handleDeleteRole(row: any) {
    const { success } = await deleteRole(row.id);
    if (success) {
      message(`已删除${row.name}`, { type: "success" });
      onSearch();
    }
  }
  async function addRole(data: FormItemProps) {
    return roleApi.saveRole(data);
  }
  async function updateRole(data: FormItemProps) {
    return roleApi.updateRole(data);
  }
  async function deleteRole(id: number) {
    return roleApi.deleteRole(id);
  }
  async function assignPermission(id: number, permissionIds?: number[]) {
    return roleApi.assignPermission(id, permissionIds);
  }
  onMounted(() => {
    onSearch();
  });

  return {
    searchData,
    pagination,
    tableData,
    permission,
    openDialog,
    handleSetSearchForm,
    onSearch,
    handleChangeCurrentPage,
    handleChangePageSize,
    handleDeleteRole,
    openPermission
  };
}
