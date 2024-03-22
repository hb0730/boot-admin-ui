import editForm from "../form.vue";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { h, onMounted, reactive, ref } from "vue";
import { enabledOptions, usePublicHooks } from "../../hooks";
import * as timingApi from "@/api/sys/timing";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

export function useTiming() {
  const { tagStyle } = usePublicHooks();

  const formRef = ref();
  const permission = reactive({
    query: "sys:quartz:job:list",
    save: "sys:quartz:job:save",
    update: "sys:quartz:job:update",
    delete: "sys:quartz:job:delete",
    run: "sys:quartz:job:run",
    pause: "sys:quartz:job:pause",
    resume: "sys:quartz:job:resume"
  });

  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: any;
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "任务名称",
        options: {
          prop: "jobName",
          placeholder: "请入任务名称搜索",
          filterable: true,
          clearable: true
        }
      },
      {
        type: "select",
        label: "任务状态",
        options: {
          prop: "enabled",
          placeholder: "选择任务状态搜索",
          filterable: true,
          clearable: true,
          dataSourceKey: "enabledOptions"
        }
      }
    ],
    dataSource: {
      enabledOptions: enabledOptions
    }
  });
  const tableData = reactive<{
    loading: boolean;
    dataList: any;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "任务名称",
        prop: "jobName"
      },
      {
        label: "任务类名/Bean名称",
        prop: "jobClassName"
      },
      {
        label: "参数",
        prop: "parameter"
      },
      {
        label: "cron表达式",
        prop: "cronExpression"
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
        label: "描述",
        prop: "description"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ]
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}任务`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          jobName: row?.jobName ?? "",
          jobClassName: row?.jobClassName ?? "",
          parameter: row?.parameter ?? "",
          cronExpression: row?.cronExpression ?? "",
          enabled: row?.enabled ?? false,
          description: row?.description ?? ""
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
              const { success } = await timingApi.timingUpdate(curData);
              if (success) {
                chores();
              }
            } else {
              const { success } = await timingApi.timingSave(curData);
              if (success) {
                chores();
              }
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
    const { success, data } = await timingApi.timingPage(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  async function handleRun(row: FormItemProps) {
    const { success } = await timingApi.timingRun(row.id);
    if (success) {
      message(`任务： ${row.jobName} 执行成功`, { type: "success" });
    }
  }
  async function handleResume(row: FormItemProps) {
    const { success } = await timingApi.timingResume(row.id);
    if (success) {
      message(`任务： ${row.jobName} 恢复成功`, { type: "success" });
      onSearch();
    }
  }
  async function handlePause(row: FormItemProps) {
    const { success } = await timingApi.timingPause(row.id);
    if (success) {
      message(`任务： ${row.jobName} 暂停成功`, { type: "success" });
      onSearch();
    }
  }
  async function handleDelete(row: FormItemProps) {
    const { success } = await timingApi.timingDelete(row.id);
    if (success) {
      message(`删除成功`, { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });
  return {
    permission,
    searchData,
    tableData,
    pagination,
    openDialog,
    onSearch,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    handleRun,
    handlePause,
    handleResume,
    handleDelete
  };
}
