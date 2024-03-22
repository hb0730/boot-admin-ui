import editForm from "../form.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { isAllEmpty } from "@pureadmin/utils";
import { type Ref, h, onMounted, reactive, ref } from "vue";
import { listMenus } from "@/api/sys/permission";
import { menuTypes } from "@/api/sys/enums";
import type { FormItemProps, TableColumnsProps } from "./types";
import * as permissionApi from "@/api/sys/permission";
import { message } from "@/utils/message";
import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { addDrawer } from "@/components/ReDrawer";
import { menuTypeOptionMap } from "./enums";

export function useMenu(tableRef: Ref) {
  const searchForm = reactive<any>({
    show: true,
    searchData: {},
    dataSource: {
      menuType: []
    }
  });
  const tableForm = reactive<any>({
    loading: false,
    dataList: []
  });
  const formRef = ref();
  let tableMaps = ref(new Map());

  const getMenuType = (type, text = false) => {
    switch (type) {
      case 1:
        return text ? "菜单" : "primary";
      case 2:
        return text ? "iframe" : "warning";
      case 3:
        return text ? "外链" : "danger";
      case 4:
        return text ? "按钮" : "info";
    }
  };

  const formItems: SearchFormItems = [
    {
      type: "input",
      label: "菜单名称",
      options: {
        placeholder: "请输入菜单名称",
        prop: "title",
        clearable: true
      }
    }
  ];
  const tableColumns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.title}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menuType",
      align: "left",
      cellRenderer: ({ row, props }) => (
        <>
          <el-tag
            size={props.size}
            type={getMenuType(row.menuType)}
            effect="plain"
          >
            {menuTypeOptionMap[row.menuType]}
          </el-tag>
        </>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "权限标识",
      prop: "permission"
    },
    {
      label: "排序",
      prop: "rank",
      width: 100
    },
    {
      label: "隐藏",
      prop: "showLink",
      formatter: ({ showLink }) => (showLink ? "否" : "是"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  /*==========handle methods===============*/
  function handleSearchFrom(data: any) {
    searchForm.searchData = data;
  }

  async function onSearch() {
    tableForm.loading = true;
    listMenus<any, TableColumnsProps[]>(searchForm.searchData)
      .then(res => {
        const { success, data } = res;
        if (success) {
          data.forEach(el => {
            el.hasChildren = true;
          });
          tableForm.dataList = data;
        }
      })
      .finally(() => {
        tableForm.loading = false;
      });
  }
  async function handleGetChild(
    row: TableColumnsProps,
    treeNode: unknown,
    resolve: (date: TableColumnsProps[]) => void
  ) {
    // load 函数中的将当前行信息保存
    tableMaps.value.set(row.id, { row, treeNode, resolve });
    const { success, data } = await listMenus<any, TableColumnsProps[]>({
      parentId: row.id
    });
    if (success) {
      data.forEach(el => {
        el.hasChildren = true;
      });
      resolve(data);
    }
  }
  function openForm(title = "新增", row?: FormItemProps) {
    addDrawer({
      props: {
        formInline: {
          id: row?.id ?? undefined,
          menuType: row?.menuType ?? 1,
          parentId: row?.parentId ?? 0,
          title: row?.title ?? "",
          routeName: row?.routeName ?? "",
          path: row?.path ?? "",
          component: row?.component ?? "",
          rank: row?.rank ?? 99,
          redirect: row?.redirect ?? "",
          icon: row?.icon ?? "",
          frameSrc: row?.frameSrc ?? "",
          keepAlive: row?.keepAlive ?? false,
          showLink: row?.showLink ?? true,
          showParent: row?.showParent ?? true,
          enabled: row?.enabled ?? true,
          permission: row?.permission ?? ""
        }
      },
      title: `${title}菜单与权限`,
      width: "45%",
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
              await updateMenu(curData);
              chores();
            } else {
              await addMenu(curData);
              chores();
            }
          }
        });
      }
    });
  }

  /*====enums======*/
  function getMenuTypes() {
    menuTypes().then(res => {
      if (res.success) {
        searchForm.dataSource.menuType = res.data;
        searchForm.dataSource.menuType.forEach(e => {
          e.value = Number(e.value);
        });
      }
    });
  }

  async function addMenu(data: FormItemProps) {
    const { success } = await permissionApi.addMenu(data);
    if (success) {
      if (tableMaps.value.get(data.parentId)) {
        const _tableRef = tableRef.value.getTableRef();
        const { row, treeNode, resolve } = tableMaps.value.get(data.parentId);
        /*报错部分修改*/
        _tableRef.store.states.lazyTreeNodeMap.value[data.parentId]?.push({});
        handleGetChild(row, treeNode, resolve);
      }
    }
  }
  async function updateMenu(data: FormItemProps) {
    const { success } = await permissionApi.updateMenu(data);
    if (success) {
      if (tableMaps.value.get(data.id)) {
        const _tableRef = tableRef.value.getTableRef();
        const { row, treeNode, resolve } = tableMaps.value.get(data.id);
        /*报错部分修改*/
        _tableRef.store.states.lazyTreeNodeMap.value[data.id]?.push({});
        handleGetChild(row, treeNode, resolve);
      }
      // 刷新表格数据
      const _tableRef = tableRef.value.getTableRef();
      _tableRef.store.states.lazyTreeNodeMap.value[data.parentId]?.forEach(
        (e, index) => {
          if (e.id === data.id) {
            _tableRef.store.states.lazyTreeNodeMap.value[data.parentId][index] =
              data;
          }
        }
      );
    }
  }
  async function handleDeleteMenu(data: FormItemProps) {
    const { success } = await permissionApi.deleteMenu(data.id);
    if (success) {
      const _tableRef = tableRef.value.getTableRef();
      const { row, treeNode, resolve } = tableMaps.value.get(data.parentId);
      if (
        _tableRef.store.states.lazyTreeNodeMap.value[data.parentId]?.length > 1
      ) {
        //说明该节点下有多个子节点
        _tableRef.store.states.lazyTreeNodeMap[data.parentId] = [];
      } else {
        //说明该节点只有一个节点
        _tableRef.store.states.lazyTreeNodeMap.value[data.parentId] = [];
      }
      handleGetChild(row, treeNode, resolve);
    }
  }

  onMounted(() => {
    onSearch();
    getMenuTypes();
  });

  return {
    searchForm,
    tableForm,
    formItems,
    tableColumns,
    handleSearchFrom,
    onSearch,
    handleGetChild,
    openForm,
    handleDeleteMenu
  };
}
