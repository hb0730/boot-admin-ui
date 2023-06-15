<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import * as $configApi from "@/api/sys/config";
import message from "@/utils/message";
const formRef = ref();
const pageData: any = reactive({
  mode: "add",
  modalParam: {
    visible: false,
    title: "新增系统配置",
    closeOnclickModal: true
  },
  formParam: {
    infoForm: {},
    fields: [
      {
        type: "select",
        label: "配置类型",
        prop: "type",
        placeholder: "请选择配置类型",
        dataSourceKey: "configTypeOptions",
        options: {
          clearable: true,
          filterable: true,
          keys: {
            prop: "value",
            value: "value",
            label: "label"
          }
        }
      },
      {
        type: "input",
        label: "配置项",
        prop: "code",
        placeholder: "请输入配置项",
        max: 50,
        options: {
          clearable: true
        }
      },
      {
        type: "textarea",
        label: "配置值",
        prop: "value",
        placeholder: "请输入配置值",
        max: 255,
        options: {
          clearable: true
        }
      },
      {
        type: "input",
        label: "备注",
        prop: "memo",
        placeholder: "请输入备注",
        max: 255,
        options: {
          clearable: true
        }
      }
    ],
    rules: {
      type: [{ required: true, message: "请选择配置类型", trigger: "change" }],
      code: [{ required: true, message: "请输入配置项", trigger: "blur" }],
      value: [{ required: true, message: "请输入配置值", trigger: "blur" }]
    },
    loading: false
  },
  dataSource: {}
});
const disabledField = computed(() => (item: any) => {
  if (pageData.mode === "add") {
    return false;
  }
  return item.prop === "code" || item.prop === "type";
});
const showBtn = computed(() => {
  if (pageData.mode === "detail") {
    return false;
  }
  return true;
});
const initData = () => {
  pageData.modalParam.visible = false;
  pageData.modalParam.title = "新增系统配置";
  pageData.modalParam.closeOnclickModal = true;
  pageData.formParam.infoForm = {};
};
const _handleClose = () => {
  initData();
  emits("close");
};
const open = (data: any, dataSource: any, mode: string) => {
  pageData.mode = mode;
  pageData.dataSource = dataSource;
  pageData.formParam.infoForm = data;
  pageData.modalParam.visible = true;
};
const handleConfirm = () => {
  formRef.value!.validate((isValid: boolean) => {
    if (isValid) {
      if (pageData.mode === "add") {
        save();
      } else {
        update();
      }
    }
  });
};
const save = () => {
  pageData.formParam.loading = true;
  const data = pageData.formParam.infoForm;
  const params = {
    type: data.type,
    code: data.code,
    value: data.value,
    memo: data.memo
  };
  $configApi
    .save(params)
    .then((res: any) => {
      if (res.success) {
        message.success("新增成功");
        initData();
        emits("confirm");
        pageData.modalParam.visible = false;
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const update = () => {
  pageData.formParam.loading = true;
  const data = pageData.formParam.infoForm;
  const params = {
    id: data.id,
    type: data.type,
    code: data.code,
    value: data.value,
    memo: data.memo
  };
  $configApi
    .update(data.id, params)
    .then((res: any) => {
      if (res.success) {
        message.success("修改成功");
        initData();
        emits("confirm");
        pageData.modalParam.visible = false;
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const emits = defineEmits(["close", "confirm"]);
defineOptions({
  name: "ConfigEdit"
});
defineExpose({
  open
});
</script>

<template>
  <div>
    <el-drawer
      v-model="pageData.modalParam.visible"
      :title="pageData.modalParam.title"
      destroy-on-close
      modal
      :close-on-click-modal="pageData.modalParam.closeOnclickModal"
      :before-close="_handleClose"
    >
      <template #header>
        <span style="font-weight: 700">{{ pageData.modalParam.title }}</span>
      </template>
      <el-form
        :model="pageData.formParam.infoForm"
        :rules="pageData.formParam.rules"
        label-position="right"
        ref="formRef"
        v-loading="pageData.formParam.loading"
      >
        <el-form-item
          v-for="(item, index) in pageData.formParam.fields"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template v-if="item.type === 'input'">
            <el-input
              v-model="pageData.formParam.infoForm[item.prop]"
              :clearable="item.options?.clearable ?? true"
              :max="item.max ?? 255"
              :disabled="disabledField(item)"
            />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <el-input
              v-model="pageData.formParam.infoForm[item.prop]"
              :clearable="item.options?.clearable ?? true"
              :max="item.max ?? 255"
              :disabled="disabledField(item)"
              type="textarea"
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="pageData.formParam.infoForm[item.prop]"
              :filterable="item.options?.filterable ?? true"
              :clearable="item.options?.clearable ?? true"
              :placeholder="item.placeholder"
              style="width: 100%"
              :disabled="disabledField(item)"
            >
              <el-option
                v-for="su in pageData.dataSource[item.dataSourceKey]"
                :key="su[item.options?.keys?.prop ?? 'value']"
                :label="su[item.options?.keys?.label ?? 'label']"
                :value="su[item.options?.keys?.value ?? 'value']"
              />
            </el-select>
          </template>
        </el-form-item>
        <!---->
      </el-form>
      <template #footer>
        <el-button plain @click="_handleClose">取 消</el-button>
        <el-popconfirm
          title="确认提交?"
          @confirm="handleConfirm"
          confirm-button-text="确定"
          cancel-button-text="取消"
        >
          <template #reference>
            <el-button
              type="primary"
              plain
              v-show="showBtn"
              v-loading="pageData.formParam.loading"
              >提 交</el-button
            >
          </template>
        </el-popconfirm>
      </template>
      <!---->
    </el-drawer>
  </div>
</template>
