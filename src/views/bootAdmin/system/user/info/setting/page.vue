<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户设置" name="userInfo">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userInfoForm"
              :model="userInfo"
              required-asterisk
              :rules="userInforules"
              :label-position="position"
              center
            >
              <el-form-item prop="nickName" required label="昵称">
                <el-input v-model="userInfo.nickName" clearable></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="phonenumber">
                <el-input v-model="userInfo.phonenumber" clearable></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="性別" prop="gender">
                <el-radio-group v-model="userInfo.gender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="-1">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button @click="updateInfo" type="primary">
                  <i class="fa fa-check"></i>
                  更新
                </el-button>
                <el-button @click="resetForm('info')" type="info">
                  <i class="fa fa-reply-all"></i>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="密码设置" name="passwrod">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userPasswordForm"
              :model="userPasswordInfo"
              required-asterisk
              :label-position="position"
              :rules="passwordRules"
              center
            >
              <el-form-item label="原密码" required prop="oldPassword">
                <el-input v-model="userPasswordInfo.oldPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword" label="新密码">
                <el-input type="password" v-model="userPasswordInfo.newPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword2" label="确认密码">
                <el-input type="password" v-model="userPasswordInfo.newPassword2" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="settingPassword">
                  <i class="fa fa-check"></i>提交
                </el-button>
                <el-button @click="resetForm('passwordForm')" type="info">
                  <i class="fa fa-reply-all"></i>重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>
<script>
import util from "@/libs/util.js";
import { mapActions } from "vuex";
import { MessageBox } from "element-ui";
import { title } from "faker/lib/locales/zh_CN";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.userPasswordInfo.oldPassword) {
        callback(new Error("原密码与新密码一致"));
      } else {
        if (this.userPasswordInfo.newPassword2 !== "") {
          this.$refs.userPasswordForm.validateField("newPassword2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userPasswordInfo.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      position: "left",
      activeName: "userInfo",
      userInfo: {
        nickName: "",
        gender: 1,
        phoneNumber: "",
        avatar: "",
        email: "",
      },
      userInforules: {
        nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
      userPasswordInfo: {
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
      },
      passwordRules: {
        oldPassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur",
          },
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getCurrentUserInfo();
  },
  methods: {
    ...mapActions("bootAdmin/user", [
      "userInfoBuyId",
      "updateUserInfoById",
      "updatePassword",
    ]),
    ...mapActions("d2admin/account", ["logout"]),
    /**
     * 获取当前用户信息
     */
    getCurrentUserInfo() {
      let _self = this;
      let userId = util.cookies.get("uuid");
      if (userId) {
        _self.userInfoBuyId({ id: userId }).then((result) => {
          _self.userInfo = result;
        });
      }
    },
    /**
     * 更新用户信息
     */
    updateInfo() {
      let _self = this;
      _self.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          let userId = util.cookies.get("uuid");
          if (userId) {
            let info = JSON.parse(JSON.stringify(_self.userInfo));
            let params = {
              nickName: info.nickName,
              email: info.email,
              phoneNumber: info.phoneNumber,
              gender: info.gender,
              avatar: "",
            };
            _self
              .updateUserInfoById({ url: userId, data: params })
              .then((result) => {
                this.$message.success("修改成功");
                _self.getCurrentUserInfo();
              });
          }
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    resetForm(name) {
      let _self = this;
      if (name == "info") {
        _self.getCurrentUserInfo();
      } else {
        _self.userPasswordForm = {};
      }
    },
    handleClick(tab, event) {
      let _self = this;
      if (tab.paneName == "userInfo") {
        _self.$refs.userPasswordForm.resetFields();
      } else {
        _self.$refs.userInfoForm.resetFields();
      }
    },
    /**
     * 重新设置密码
     */
    settingPassword() {
      let _self = this;
      _self.$refs.userPasswordForm.validate((valid) => {
        if (valid) {
          let userId = util.cookies.get("uuid");
          if (userId) {
            let params = JSON.parse(JSON.stringify(_self.userPasswordInfo));
            _self
              .updatePassword({ url: userId, data: params })
              .then((result) => {
                _self.activeName = "userInfo";
                _self.logout();
              });
          }
        } else {
          // 校验失败
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
  },
};
</script>