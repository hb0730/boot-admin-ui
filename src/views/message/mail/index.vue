<script setup lang="ts">
import { ElForm } from "element-plus";
import { mailApi } from "/@/api/message/mail";
import { onMounted, reactive, ref } from "vue";
import { successMessage, warnMessage } from "/@/utils/message";
import { MailModel } from "/@/api/model/message/mail_model";
const mailRef = ref<InstanceType<typeof ElForm>>();
const testRef = ref<InstanceType<typeof ElForm>>();
const permission = reactive({
  save: ["mail:save"]
});
const pageData = reactive({
  activeName: "smtp",
  position: "left",
  rules: {
    host: [{ required: true, message: "请输入SMTP地址", trigger: "blur" }],
    protocol: [{ required: true, message: "请输入发送协议", trigger: "blur" }],
    sslPort: [{ required: true, message: "请输入SSL端口", trigger: "blur" }],
    username: [{ required: true, message: "请输入邮箱账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入邮箱密码", trigger: "blur" }],
    fromName: [{ required: true, message: "请输入发件人", trigger: "blur" }]
  },
  testRules: {
    to: [{ required: true, message: "请输入收件人", trigger: "blur" }],
    subject: [{ required: true, message: "请输入主题", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }]
  },
  info: {
    host: "",
    protocol: "",
    sslPort: null,
    username: "",
    password: "",
    fromName: "",
    enabled: 0
  },
  testInfo: {
    to: "",
    subject: "",
    content: ""
  }
});
const handleClick = (tab, _) => {
  if (tab.paneName == "test") {
    mailRef.value!.resetFields();
  } else {
    getInfo();
    testRef.value!.resetFields();
  }
};
const getInfo = async () => {
  pageData.info = await mailApi.info();
};
const handlerSave = () => {
  mailRef.value!.validate(async isValid => {
    if (isValid) {
      await mailApi.save<MailModel>(pageData.info);
      successMessage("保存成功");
      getInfo();
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const handlerSend = () => {
  testRef.value!.validate(async isValid => {
    if (isValid) {
      await mailApi.test(pageData.testInfo);
      successMessage("发送成功");
    } else {
      warnMessage("表单校验失败");
    }
  });
};
onMounted(() => {
  getInfo();
});
</script>

<template>
  <div>
    <el-tabs
      v-model="pageData.activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="SMTP设置" name="smtp">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="mailRef"
              :model="pageData.info"
              required-asterisk
              :rules="pageData.rules"
              :label-position="pageData.position"
              center
              label-width="auto"
            >
              <el-form-item label="SMTP地址:" required prop="host">
                <el-input v-model="pageData.info.host"></el-input>
              </el-form-item>
              <el-form-item label="发送协议:" required prop="protocol">
                <el-input v-model="pageData.info.protocol"></el-input>
              </el-form-item>
              <el-form-item label="SSL端口:" required prop="sslPort">
                <el-input v-model="pageData.info.sslPort"></el-input>
              </el-form-item>
              <el-form-item label="邮箱账号:" required prop="username">
                <el-input v-model="pageData.info.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱密码:" required prop="password">
                <el-input
                  v-model="pageData.info.password"
                  prefix-icon="el-icon-lock"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="发件人:" required prop="fromName">
                <el-input v-model="pageData.info.fromName"></el-input>
              </el-form-item>
              <el-form-item label="是否启用:" prop="enabled">
                <el-switch
                  :active-value="1"
                  :inactive-value="0"
                  v-model="pageData.info.enabled"
                ></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button
                  @click="handlerSave"
                  v-auth="permission.save"
                  type="primary"
                  >保存</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="测试发送" name="test">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="testRef"
              :model="pageData.testInfo"
              required-asterisk
              :rules="pageData.testRules"
              :label-position="pageData.position"
              label-width="auto"
              center
            >
              <el-form-item label="收件人:" required prop="to">
                <el-input v-model="pageData.testInfo.to"></el-input>
              </el-form-item>
              <el-form-item label="主题:" required prop="subject">
                <el-input v-model="pageData.testInfo.subject"></el-input>
              </el-form-item>
              <el-form-item label="内容:" required prop="content">
                <el-input
                  type="textarea"
                  v-model="pageData.testInfo.content"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="handlerSend" type="primary">发送</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped></style>
