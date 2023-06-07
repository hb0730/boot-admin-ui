<script setup lang="ts">
import { reactive } from "vue";
import * as $orgApi from "@/api/sys/org";
import { ref } from "vue";
import message from "@/utils/message";
defineOptions({
  name: "OrgEdit"
});
const formRef = ref();
const pageData: any = reactive({
  mode: "add",
  modalParam: {
    visible: false,
    title: "新增网点机构",
    closeOnclickModal: false
  },
  formParam: {
    fields: [
      {
        type: "select",
        label: "所属机构",
        prop: "parentId",
        placeholder: "请选择所属机构",
        dataSourceKey: "orgList",
        options: {
          filterable: true,
          keys: { prop: "id", value: "id", label: "name" }
        }
      },
      {
        type: "input",
        label: "机构名称",
        prop: "name",
        placeholder: "请输入机构名称"
      },
      {
        type: "input",
        label: "联系电话",
        prop: "linkTel",
        placeholder: "请输入联系电话"
      },
      {
        type: "select",
        label: "状态",
        prop: "isEnable",
        placeholder: "请选择",
        dataSourceKey: "enabledOptions",
        options: {
          keys: { label: "label", value: "value", prop: "value" },
          filterable: true
        }
      }
    ],
    infoFrom: {},
    rules: {
      parentId: [
        { required: true, message: "请选择所属机构", trigger: "change" }
      ],
      name: [{ required: true, message: "请输入机构名称", trigger: "blur" }]
    },
    loading: false
  },
  dataSource: {}
});
const initModal = () => {
  pageData.modalParam.closeOnclickModal = false;
  pageData.formParam.infoFrom = {};
  pageData.mode = "add";
  pageData.formParam.loading = false;
};
const _handleClose = () => {
  initModal();
  emits("close");
  pageData.modalParam.visible = false;
};
const open = (form: any, dataSource: any, mode: string) => {
  pageData.mode = mode;
  pageData.dataSource = dataSource;
  pageData.formParam.infoFrom = form;
  pageData.modalParam.visible = true;
};
const handleCancel = () => {
  initModal();
  emits("close");
  pageData.modalParam.visible = false;
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
  const data = pageData.formParam.infoFrom;
  $orgApi
    .save(data)
    .then(res => {
      if (res.success) {
        message.success("新增成功");
        pageData.modalParam.visible = false;
        emits("confirm");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const update = () => {
  pageData.formParam.loading = true;
  const data = pageData.formParam.infoFrom;
  $orgApi
    .update(data.id, data)
    .then(res => {
      if (res.success) {
        message.success("修改成功");
        pageData.modalParam.visible = false;
        emits("confirm");
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      pageData.formParam.loading = false;
    });
};
const emits = defineEmits(["close", "confirm"]);
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
        :model="pageData.formParam.infoFrom"
        :rules="pageData.formParam.rules"
        label-position="right"
        ref="formRef"
        v-loading="pageData.formParam.loading"
      >
        <el-row class="form-row">
          <el-col :span="24">
            <el-form-item
              label="所属机构"
              prop="parentId"
              style="font-weight: 700"
            >
              <el-select
                v-model="pageData.formParam.infoFrom['parentId']"
                style="width: 100%"
                clearable
                filterable
                placeholder="请选择所属机构"
                :disabled="pageData.mode === 'edit'"
              >
                <el-option
                  v-for="item in pageData.dataSource.orgList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="24">
            <el-form-item label="机构名称" prop="name">
              <el-input
                v-model="pageData.formParam.infoFrom['name']"
                clearable
                :disabled="pageData.mode === 'edit'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input
                v-model="pageData.formParam.infoFrom['linkMan']"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkTel">
              <el-input
                v-model="pageData.formParam.infoFrom['linkTel']"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="12">
            <el-form-item label="省" prop="provinceId" style="font-weight: 700">
              <el-select-v2
                v-model="pageData.formParam.infoFrom['provinceId']"
                filterable
                clearable
                :options="[]"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市" prop="cityId" style="font-weight: 700">
              <el-select-v2
                v-model="pageData.formParam.infoFrom['cityId']"
                filterable
                clearable
                :options="[]"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="12">
            <el-form-item label="区" prop="countyId" style="font-weight: 700">
              <el-select-v2
                v-model="pageData.formParam.infoFrom['countyId']"
                filterable
                clearable
                :options="[]"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="街道" prop="townId" style="font-weight: 700">
              <el-select-v2
                v-model="pageData.formParam.infoFrom['townId']"
                filterable
                clearable
                :options="[]"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="pageData.formParam.infoFrom['address']"
                placeholder="请输入地址信息"
                :max-length="100"
                allow-clear
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="24">
            <el-form-item label="经纬度" prop="longitude">
              <div>
                <div style="display: inline-block">
                  <el-input
                    v-model="pageData.formParam.infoFrom['longitude']"
                    placeholder="请输入经纬度信息"
                    :max-length="100"
                    allow-clear
                  />
                </div>
                <div style="display: inline-block; padding-left: 5px">
                  <el-link type="primary" :underline="false"
                    >点击获取经纬度</el-link
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="24">
            <el-form-item label="说明" prop="memo">
              <el-input
                type="textarea"
                placeholder="200文字以内"
                :max-length="200"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button plain @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          plain
          v-loading="pageData.formParam.loading"
          >确 定</el-button
        >
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-drawer .el-drawer__body) {
  border-top: 1px solid #e8e8e8 !important;
}

:deep(.el-drawer .el-drawer__footer) {
  border-top: 1px solid #e8e8e8 !important;
}

.form-row {
  margin-bottom: 20px;
}
</style>
