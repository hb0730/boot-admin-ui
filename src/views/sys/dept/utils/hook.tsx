import editForm from "../form.vue";

import type { OptionsType } from "@/components/ReSegmented";
import { h, onMounted, reactive, ref } from "vue";
import * as deptApi from "@/api/sys/dept";
import { usePublicHooks } from "../../hooks";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { message } from "@/utils/message";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";

export function useDept() {
  const { tagStyle } = usePublicHooks();
  const formRef = ref();

  const permission = reactive({
    query: "sys:dept:query",
    add: "sys:dept:save",
    edit: "sys:dept:update",
    delete: "sys:dept:delete"
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
    formItems: [
      {
        type: "input",
        label: "部门编码",
        options: {
          placeholder: "请输入部门编码",
          clearable: true,
          prop: "code"
        }
      },
      {
        type: "input",
        label: "部门名称",
        options: {
          placeholder: "请输入部门名称",
          clearable: true,
          prop: "name"
        }
      },
      {
        type: "select",
        label: "部门状态",
        options: {
          placeholder: "请选择部门状态",
          clearable: true,
          prop: "enabled",
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
      enabledOptions: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 0
        }
      ]
    },
    data: {}
  });
  const tableData = reactive<{
    loading: boolean;
    data: any;
    columns: TableColumnList;
  }>({
    loading: false,
    data: [],
    columns: [
      {
        label: "部门编码",
        prop: "code"
      },
      {
        label: "部门名称",
        prop: "name"
      },
      {
        label: "排序",
        prop: "sort"
      },
      {
        label: "状态",
        prop: "enabled",
        cellRenderer: ({ row, props }) => (
          <el-tag size={props.size} style={tagStyle.value(row.enabled ? 1 : 0)}>
            {row.enabled ? "启用" : "停用"}
          </el-tag>
        )
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "备注",
        prop: "description"
      },
      {
        label: "操作",
        fixed: "right",
        width: 210,
        slot: "operation"
      }
    ]
  });
  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          parentId: row?.parentId ?? undefined,
          name: row?.name ?? "",
          code: row?.code ?? "",
          description: row?.description ?? "",
          enabled: row?.enabled ?? true,
          principal: row?.principal ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          sort: row?.sort ?? 99
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message("保存成功", {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              const { success } = await updateDept(curData);
              if (success) chores();
            } else {
              const { success } = await addDept(curData);
              if (success) chores();
            }
          }
        });
      }
    });
  }
  /*=======search===========*/
  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      sorts: "sort"
    };
    const { success, data } = await deptApi.deptTree(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.data = data;
    }
  }
  async function handleDelete(row: any) {
    tableData.loading = true;
    const { success } = await deleteDept(row.id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      message("删除成功", {
        type: "success"
      });
      onSearch();
    }
  }
  /*=========methods=============== */
  async function addDept(data: FormItemProps) {
    return deptApi.deptSave(data);
  }
  async function updateDept(data: FormItemProps) {
    return deptApi.deptUpdate(data);
  }
  async function deleteDept(id: number) {
    return deptApi.deptDelete(id);
  }

  onMounted(() => {
    onSearch();
  });
  return {
    permission,
    searchData,
    tableData,
    handleSetSearchForm,
    onSearch,
    openDialog,
    handleDelete
  };
}
