import layoutHeaderAside from '@/layout/header-aside'
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const meta = {
    auth: true
}
export default {
    path: "/boot/admin/system",
    name: 'bootAdmin',
    meta,
    redirect: {
        name: 'system-manager-index'
    },
    component: layoutHeaderAside,
    children: [
        {
            path: '/boot/admin/system/menu',
            name: `menu-Manager`,
            component: _import('bootAdmin/system/menu/index'),
            meta: {
              ...meta,
              title: '菜单管理'
            }
          },
    ]
}