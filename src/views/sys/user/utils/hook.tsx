import "./reset.css";
import editForm from "../form.vue";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { PaginationProps } from "@pureadmin/table";
import * as userApi from "@/api/sys/user";
import { computed, h, onMounted, reactive, ref } from "vue";
import type { FormItemProps } from "./types";
import { addDrawer } from "@/components/ReDrawer";
import { deviceDetection, isAllEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { deptTree } from "@/api/sys/dept";
import { listRole } from "@/api/sys/role";
import { usePublicHooks } from "../../hooks";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElMessageBox,
  ElProgress
} from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { zxcvbn } from "@zxcvbn-ts/core";
import { watch } from "vue";

export function useUser() {
  const formRef = ref();
  const restPwdFormRef = ref();
  const currentDept = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

  // 当前密码强度（0-4）
  const curScore = ref();
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];

  const permission = reactive({
    query: "sys:user:list",
    save: "sys:user:save",
    update: "sys:user:update",
    delete: "sys:user:delete",
    resetPwd: "sys:user:resetPassword"
  });

  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });

  const deptTreeData = reactive<{ loading: boolean; dataList: any[] }>({
    loading: false,
    dataList: []
  });
  const roleData = ref();
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: any[];
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "用户账号",
        options: {
          prop: "username",
          placeholder: "请输入用户账号",
          clearable: true
        }
      },
      {
        type: "input",
        label: "用户名称",
        options: {
          prop: "nickname",
          placeholder: "请输入用户名称",
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
      enabledOptions: [
        {
          label: "启用",
          value: true
        },
        {
          label: "禁用",
          value: false
        }
      ]
    }
  });

  const tableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "用户名称",
        prop: "username",
        minWidth: 130
      },
      {
        label: "用户昵称",
        prop: "nickname",
        minWidth: 130
      },
      {
        label: "性别",
        prop: "gender",
        minWidth: 90,
        cellRenderer: ({ row, props }) => (
          <el-tag
            size={props.size}
            type={row.gender === 1 ? "danger" : null}
            effect="plain"
          >
            {row.gender === 1 ? "女" : "男"}
          </el-tag>
        )
      },
      {
        label: "部门",
        prop: "dept.name",
        minWidth: 90
      },
      {
        label: "状态",
        prop: "enabled",
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
        )
      },
      {
        label: "创建时间",
        minWidth: 90,
        prop: "created"
      },
      {
        label: "最后登陆时间",
        minWidth: 90,
        prop: "lastLoginTime"
      },
      {
        label: "操作",
        fixed: "right",
        width: 180,
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
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function openDrawer(title = "新增", row?: FormItemProps) {
    addDrawer({
      title: `${title}用户`,
      width: "40%",
      props: {
        formInline: {
          id: row?.id ?? undefined,
          roleIds: row?.roles?.map(e => e.id) ?? [],
          roleList: roleData.value,

          deptList: deptTreeData.dataList,
          deptId: row?.dept?.id ?? currentDept.value ?? "",

          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          enabled: row?.enabled ?? true
        }
      },
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        console.log(curData);
        function chores() {
          message("保存成功");
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            const data = convertData(curData);
            if (data.id) {
              const { success } = await userApi.updateUser(data);
              if (success) {
                chores();
              }
            } else {
              const { success } = await userApi.saveUser(data);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }
  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  function handleRestPwd(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={restPwdFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        restPwdFormRef.value.validate(async valid => {
          if (valid) {
            const { success } = await userApi.resetPassword(
              row.id,
              pwdForm.newPwd
            );
            if (success) {
              // 表单规则校验通过
              message(`已成功重置 ${row.username} 用户的密码`, {
                type: "success"
              });
              // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
          }
        });
      }
    });
  }
  function convertData(formData) {
    return {
      id: formData.id,
      username: formData.username,
      nickname: formData.nickname,
      phone: formData.phone,
      email: formData.email,
      enabled: formData.enabled,
      gender: formData.gender,
      dept: formData.deptId ? { id: formData.deptId } : undefined,
      roles: formData.roleIds.map(e => ({ id: e })) ?? []
    };
  }
  /*======tree========*/
  function handleCurrentDept({ id, selected }) {
    currentDept.value = id;
    searchData.data.deptId = selected ? id : "";
    pagination.currentPage = 1;
    onSearch();
  }
  /*=======search==========*/
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
  async function handleDelete(row: FormItemProps) {
    tableData.loading = true;
    const { success } = await userApi.deleteUser(row.id);
    if (success) {
      message("删除成功");
      onSearch();
    }
  }
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong>【<strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>】账号吗?`,
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
        const { success } = await userApi.updateUser(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "停用"}${row.username}`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const { success, data } = await userApi.userPage(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  async function loadDeptTree() {
    deptTreeData.loading = true;
    const { success, data } = await deptTree({ sorts: "sort" }).finally(() => {
      deptTreeData.loading = false;
    });
    if (success) {
      deptTreeData.dataList = data;
    }
  }
  async function loadRoles() {
    const { success, data } = await listRole({ sorts: "sort" });
    if (success) {
      roleData.value = data;
    }
  }

  onMounted(() => {
    loadRoles();
    loadDeptTree();
    onSearch();
  });
  return {
    permission,
    deptTreeData,
    searchData,
    tableData,
    pagination,
    buttonClass,
    handleRestPwd,
    openDrawer,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    handleDelete,
    onSearch,
    handleCurrentDept
  };
}
