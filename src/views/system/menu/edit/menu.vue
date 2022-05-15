<script lang="ts">
export default {
  name: "MenuEdit"
};
</script>
<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, PropType, toRef, watch, ref, toRaw, Ref } from "vue";
import { menuApi } from "/@/api/system/menu";
import { Menu, MenuTree } from "/@/api/model/system/menu_model";
import { TreeSelect } from "@pureadmin/components";
import { warnMessage } from "/@/utils/message";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { IconSelect } from "/@/components/ReIcon";
const treeProps = reactive({
  key: "id",
  value: "id",
  children: "children",
  label: "title"
});
const permission = reactive({
  add: ["menu:save"],
  edit: ["menu:update"]
});
const menuFormRef = ref<InstanceType<typeof ElForm>>();

const menuRules = reactive({
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  enname: [{ required: true, message: "请输入路由标题", trigger: "blur" }],
  path: [{ required: true, message: "请输入菜单地址", trigger: "blur" }]
});
const props = defineProps({
  treeMenu: Object as PropType<MenuTree[]>,
  position: {
    require: false,
    default: "left",
    type: String
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  menuInfo: Object as PropType<Menu>,
  isEnabledOptions: Object as PropType<DictEntryCache[]>
});
const emit = defineEmits<{ (e: "newSaveSuccess"): void }>();
const menuInfo = toRef(props, "menuInfo");
const isUpdate = toRef(props, "isUpdate");
const position = toRef(props, "position");
const treeMenu = toRef(props, "treeMenu");
const isEnabledOptions: Ref<DictEntryCache[]> = toRef(
  props,
  "isEnabledOptions"
);
const handlerAddNew = () => {
  menuFormRef.value!.validate(isValidate => {
    if (isValidate) {
      addNew();
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const addNew = async () => {
  const value = toRaw(menuInfo.value);
  await menuApi.save(value);
  menuFormRef.value!.resetFields();
  emit("newSaveSuccess");
};
const handlerUpdate = () => {
  menuFormRef.value!.validate(isValidate => {
    if (isValidate) {
      update();
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const update = async () => {
  const value = toRaw(menuInfo.value);
  await menuApi.updateById(value.id, value);
  menuFormRef.value!.resetFields();
  emit("newSaveSuccess");
};
watch(
  () => {
    return props.isUpdate;
  },
  () => {
    if (!props.isUpdate) {
      setTimeout(() => {
        menuFormRef.value!.resetFields();
      }, 0);
    }
  }
);
</script>

<template>
  <div>
    <div style="margin-top: 10%">
      <el-form
        ref="menuFormRef"
        :model="menuInfo"
        label-width="auto"
        :label-position="position"
        :rules="menuRules"
        size="default"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="iframe: " prop="iFrame">
              <el-radio-group v-model="menuInfo.iframe" size="default">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外链菜单: " prop="external">
              <el-radio-group v-model="menuInfo.external" size="default">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单缓存: " prop="cache">
              <el-radio-group v-model="menuInfo.cache" size="default">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单隐藏: " prop="hidden">
              <el-radio-group v-model="menuInfo.hidden">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单国际化: " prop="i18n">
              <el-radio-group v-model="menuInfo.i18n">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示父菜单: " prop="showParent">
              <el-radio-group v-model="menuInfo.showParent">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上级菜单: ">
          <TreeSelect
            v-model:value="menuInfo.parentId"
            show-search
            style="width: 100%"
            placeholder="请选择"
            allow-clear
            tree-default-expand-all
            :tree-data="treeMenu"
            :field-names="treeProps"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          />
        </el-form-item>
        <el-form-item required label="菜单名称: " prop="title">
          <el-input v-model="menuInfo.title" clearable />
        </el-form-item>
        <el-form-item required label="路由地址: " prop="path">
          <el-input v-model="menuInfo.path" clearable />
        </el-form-item>
        <el-form-item required label="组件名称: " prop="enname">
          <el-input v-model="menuInfo.enname" clearable />
        </el-form-item>
        <el-form-item label="组件路径: " prop="component">
          <el-input v-model="menuInfo.component" clearable />
        </el-form-item>
        <el-form-item label="图标: " prop="icon">
          <!-- <e-icon-picker
            style="width: 100%"
            v-model="menuInfo.icon"
            clearable
          /> -->
          <icon-select v-model="menuInfo.icon" />
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="menuInfo.sort"
            placeholder="排序"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注: " prop="description">
          <el-input
            type="textarea"
            v-model="menuInfo.description"
            placeholder="备注"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否启用: " prop="isEnabled">
          <el-radio-group v-model="menuInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions"
              :key="Number(item.value)"
              :label="Number(item.value)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          type="primary"
          size="default"
          plain
          class="footer-button"
          v-show="!isUpdate"
          @click="handlerAddNew"
          v-auth="permission.add"
          >新增</el-button
        >
        <el-button
          type="primary"
          size="default"
          plain
          class="footer-button"
          v-show="isUpdate"
          @click="handlerUpdate"
          v-auth="permission.edit"
          >修改</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
