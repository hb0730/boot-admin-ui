<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown" >
      <el-dropdown-item @click.native="settingUser">
        <i class="fa fa-cogs" aria-hidden="true"></i>
        设置
      </el-dropdown-item>
      <el-dropdown-item @click.native="uCahce">
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
import router from '@/router'
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout',
      'updateCache'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
      /**
     * 用户设置
     */
    settingUser () {
      let _self = this
      _self.getUserInfo()
    },
    /**
     * 获取用户信息
     */
    getUserInfo () {
      router.push({
        name: 'userManager-userInfo'
      })
    },
    /**
     * 更新缓存
     */
    uCahce() {
      let _self = this;
      _self.updateCache().then(result => {
        _self.$message.success("更新成功");
      });
    }

  }
}
</script>
