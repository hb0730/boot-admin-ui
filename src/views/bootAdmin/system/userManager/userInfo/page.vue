<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用戶信息" name="userInfo">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userInfoForm"
              :model="userInfoForm"
              required-asterisk
              :rules="rules"
              :label-position="position"
              center
            >
              <el-form-item label="用户账号" prop="username">
                <el-input v-model="userInfoForm.username" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item prop="nickName" required label="昵称">
                <el-input v-model="userInfoForm.nickName" clearable></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="phonenumber">
                <el-input v-model="userInfoForm.phonenumber" clearable></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfoForm.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="性別" prop="sex">
                <el-radio-group v-model="userInfoForm.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="-1">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="avatar" label="头像">
                <el-upload
                  class="avatar-uploader"
                  :action="imageUploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="avatar" :src="avatar" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
      <el-tab-pane label="密码管理" name="second">
        <el-row :gutter="20">
          <el-col :span="10" :offset="6">
            <el-form
              ref="userPasswordForm"
              :model="userPasswordForm"
              required-asterisk
              :label-position="position"
              :rules="passwordRules"
              center
            >
              <el-form-item label="原密码" required prop="oldPassword">
                <el-input v-model="userPasswordForm.oldPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword" label="新密码">
                <el-input type="password" v-model="userPasswordForm.newPassword" clearable></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword2" label="确认密码">
                <el-input type="password" v-model="userPasswordForm.newPassword2" clearable></el-input>
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
import {
  userInfoPath,
  userUpdateInfoPath,
  userUpdatePasswordPath,
  imageFileUploadPath
} from "@/api/baseUrl";
export default {
  name: "userManger-userInfo",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.userPasswordForm.oldPassword) {
        callback(new Error("原密码与新密码一致"));
      } else {
        if (this.userPasswordForm.newPassword2 !== "") {
          this.$refs.userPasswordForm.validateField("newPassword2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userPasswordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      avatar: "",
      activeName: "userInfo",
      position: "left",

      userInfoForm: {},
      imageUploadUrl: process.env.VUE_APP_API + imageFileUploadPath,
      userPasswordForm: {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      },
      // 表单校验
      rules: {
        nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }]
      },
      /**
       * 密码校验
       */
      passwordRules: {
        oldPassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword2: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getCurrentUserInfo();
  },
  methods: {
    ...mapActions("bootAdmin/user", [
      "userInfo",
      "userUpdateInfo",
      "userUpdatePassword"
    ]),
    ...mapActions("d2admin/account", ["logout"]),
    handleClick(tab, event) {
      
    },
    /**
     * 获取当前用户信息
     */
    getCurrentUserInfo() {
      let _self = this;
      let userId = util.cookies.get("uuid");
      if (userId) {
        let url = userInfoPath + "/" + userId;
        _self.userInfo({ url: url, data: "" }).then(result => {
          _self.userInfoForm = result;
        });
      }
    },
    /**
     * 重置
     */
    resetForm(type) {
      let _self = this;
      if (type == "info") {
        _self.getCurrentUserInfo();
      } else {
        _self.userPasswordForm = {};
        _self.avatar = "";
      }
    },
    /**
     * 修改用户信息
     */
    updateInfo() {
      let _self = this;
      _self.$refs.userInfoForm.validate(valid => {
        if (valid) {
          let userId = util.cookies.get("uuid");
          if (userId) {
            let info = JSON.parse(JSON.stringify(_self.userInfoForm));
            let params = {
              nickName: info.nickName,
              email: info.email,
              phonenumber: info.phonenumber,
              sex: info.sex,
              avatar: _self.avatar
            };
            let url = userUpdateInfoPath + "/" + userId;
            _self.userUpdateInfo({ url: url, data: params }).then(result => {
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
    /**
     * 修改密码
     */
    settingPassword() {
      let _self = this;
      _self.$refs.userPasswordForm.validate(valid => {
        if (valid) {
          let userId = util.cookies.get("uuid");
          if (userId) {
            let url = userUpdatePasswordPath + "/" + userId;
            let info = JSON.parse(JSON.stringify(_self.userPasswordForm));
            _self.userUpdatePassword({ url: url, data: info }).then(reuslt => {
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
    // 	文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      let _self = this;
      if (res.code != "BA20000") {
        $$message.error(res.data);
      } else {
        _self.avatar = res.data.filePath;
      }
    },
    //上传文件之前的钩子
    beforeAvatarUpload(file) {}
  }
};
</script>
<style>
.el-form-item__label {
  width: auto !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
