<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="SMTP设置" name="smtp">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="mailRef"
              :model="info"
              required-asterisk
              :rules="rules"
              :label-position="position"
              center
            >
              <el-form-item label="SMTP地址:" required prop="host">
                <el-input v-model="info.host"></el-input>
              </el-form-item>
              <el-form-item label="发送协议:" required prop="protocol">
                <el-input v-model="info.protocol"></el-input>
              </el-form-item>
              <el-form-item label="SSL端口:" required prop="sslPort">
                <el-input v-model="info.sslPort"></el-input>
              </el-form-item>
              <el-form-item label="邮箱账号:" required prop="username">
                <el-input v-model="info.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱密码:" required prop="password">
                <el-input v-model="info.password" prefix-icon="el-icon-lock" show-password></el-input>
              </el-form-item>
              <el-form-item label="发件人:" required prop="fromName">
                <el-input v-model="info.fromName"></el-input>
              </el-form-item>
              <el-form-item label="是否启用:" prop="enabled">
                <el-switch :active-value="1" :inactive-value="0" v-model="info.enabled"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button @click="handlerSave" type="primary">保存</el-button>
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
              :model="testInfo"
              required-asterisk
              :rules="testRules"
              :label-position="position"
              center
            >
              <el-form-item label="收件人:" required prop="to">
                <el-input v-model="testInfo.to"></el-input>
              </el-form-item>
              <el-form-item label="主题:" required prop="subject">
                <el-input v-model="testInfo.subject"></el-input>
              </el-form-item>
              <el-form-item label="内容:" required prop="content">
                <el-input type="textarea" v-model="testInfo.content"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="handlerSend" type="primary">发送</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>
<script>
import util from "@/libs/util";
import { mapActions } from "vuex";
import { mailInfoPath, mailSavePath, mailTestPath } from "@/api/baseUrl";
export default {
  data() {
    return {
      activeName: "smtp",
      position: "left",
      rules: {
        host: [{ required: true, message: "请输入SMTP地址", trigger: "blur" }],
        protocol: [
          { required: true, message: "请输入发送协议", trigger: "blur" },
        ],
        sslPort: [
          { required: true, message: "请输入SSL端口", trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入邮箱账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入邮箱密码", trigger: "blur" },
        ],
        fromName: [
          { required: true, message: "请输入发件人", trigger: "blur" },
        ],
      },
      testRules: {
        to: [{ required: true, message: "请输入收件人", trigger: "blur" }],
        subject: [{ required: true, message: "请输入主题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      info: {},
      testInfo: {},
    };
  },
  mounted() {
    let _self = this;
    _self.initDict();
    _self.getInfo();
  },
  methods: {
    ...mapActions("bootAdmin/mail", ["mailInfo", "mailSave", "mailTest"]),
    /**
     * 获取数据字典类型
     */
    initDict() {
      let _self = this;
      _self.groupOptions = util.dict.getDictValue("sys_common_status");
    },
    handleClick(tab, event) {
      let _self=this;
      if (tab.name == "test") {
        this.$refs.mailRef.resetFields();
      } else {
        _self.getInfo()
        this.$refs.testRef.resetFields();
      }
    },
    handlerSave() {
      let _self = this;
      _self.$refs.mailRef.validate((valid) => {
        if (valid) {
          _self.save();
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    getInfo() {
      let _self = this;
      _self.mailInfo().then((result) => {
        _self.info = result;
      });
    },
    save() {
      let _self = this;
      let data = JSON.parse(JSON.stringify(_self.info));
      _self.mailSave({ data: data }).then((result) => {
        _self.$message.success("保存成功");
        _self.getInfo();
      });
    },
    handlerSend() {
      let _self = this;
      _self.$refs.testRef.validate((valid) => {
        if (valid) {
          _self.send();
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    send() {
      let _self = this;
      let data = JSON.parse(JSON.stringify(_self.testInfo));
      _self.mailTest({ data: data }).then((result) => {
        _self.$message.success("发送成功");
      });
    },
  },
};
</script>
<style >
</style>
