<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="setting">
        <d2-icon name="cog" class="d2-mr-5" />设置
      </el-dropdown-item>
      <el-dropdown-item @click.native="updateVueCache">
        <i class="fa fa-trash" aria-hidden="true"></i>
        清除缓存
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
export default {
  computed: {
    ...mapState("d2admin/user", ["info"]),
  },
  methods: {
    ...mapActions("d2admin/account", ["logout", "updateCache"]),
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        confirm: true,
      });
    },
    /**
     * 设置打开页签
     */
    setting() {
      router.push({
        name: "user-setting",
      });
    },
    /**
     * 更新缓存
     */
    updateVueCache() {
      let _self = this;
      _self
        .updateCache({ to: this.$route.fullPath || "/" })
        .then((result) => {
          _self.$message.success("更新成功");
        });
    },
  },
};
</script>
