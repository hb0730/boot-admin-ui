import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {
  auth: true
}
export default {
  path: '/bootAdmin/userManager',
  name: 'userManager',
  meta,
  redirect: {
    name: 'user-manager-index'
  },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'userList',
      name: `${pre}userList`,
      component: _import('bootAdmin/system/userManager/user/index'),
      meta: {
        ...meta,
        title: '用户管理'
      }
    },
    {
      path: 'userInfo',
      name: `${pre}userInfo`,
      component: _import('bootAdmin/system/userManager/userInfo/index'),
      meta: {
        ...meta,
        title: '用戶信息'
      }
    },
    {
      path: 'post',
      name: `${pre}post`,
      component: _import('bootAdmin/system/userManager/post/index'),
      meta: {
        ...meta,
        title: '岗位管理'
      }
    }
  ])('userManager-')
}
