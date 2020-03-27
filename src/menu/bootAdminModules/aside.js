// 菜单 侧边栏
export default [
  {
    title: '系统设置',
    icon: '',
    children: [
      {
        title: '菜单管理',
        path: `/bootAdmin/systemManager/menu`
      },
      {
        title: '组织管理',
        path: '/bootAdmin/systemManager/org',
        icon: ''
      },
      {
        title: '角色管理',
        path: '/bootAdmin/systemManager/role',
        icon: ''
      }
    ]
  },
  {
    title: '用户中心',
    icon: '',
    children: [
      {
        title: '用户管理',
        path: `/bootAdmin/userManager/userList`,
        icon: ''
      }
    ]
  }
]
