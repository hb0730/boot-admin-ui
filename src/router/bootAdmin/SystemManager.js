import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {
    auth: true
}

export default {
    path: '/bootAdmin/systemManager',
    name: 'systemManager',
    meta,
    redirect: {
        name: 'system-manger-index'
    },
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'menu',
            name: `${pre}menu`,
            component: _import('bootAdmin/system/systemManager/menu/index'),
            meta: {
              ...meta,
              title: '菜单管理'
            }
          },
          {
            path: 'org',
            name: `${pre}org`,
            component: _import('bootAdmin/system/systemManager/org/index'),
            meta: {
              ...meta,
              title: '组织管理'
            }
          },
          {
            path:'role',
            name:`${pre}role`,
            component:_import('bootAdmin/system/systemManager/role/index'),
            meta:{
              ...meta,
              title:'角色管理'
            }
          },
          {
            path:'dict',
            name:`${pre}dict`,
            component:_import('bootAdmin/system/systemManager/dict/index'),
            meta:{
              ...meta,
              title:'字典管理'
            }
          }
    ])('systemManager-')

}