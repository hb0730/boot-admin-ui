<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
<<<<<<< HEAD
    <el-dropdown-menu slot="dropdown" @click.native="settingUser">
      <el-dropdown-item>
        <i class="fa fa-cogs" aria-hidden="true"></i>
        设置
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />注销
=======
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
>>>>>>> 8c114cca1c6ff08c5c62205b85af71da3afa454e
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
<<<<<<< HEAD
import router from '@/router'
=======
>>>>>>> 8c114cca1c6ff08c5c62205b85af71da3afa454e
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
<<<<<<< HEAD
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
        name: 'userManger-userInfo'
      })
=======
>>>>>>> 8c114cca1c6ff08c5c62205b85af71da3afa454e
    }
  }
}
</script>
