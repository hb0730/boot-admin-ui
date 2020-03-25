// 菜单 侧边栏
export default [
  {
    title: '系统设置',
    icon: '',
    children: (pre => [
      {
        title: '百度',
        path: 'https://www.baidu.com/'
      },
      {
        title: '菜单管理',
        path: `${pre}/menu`
      }
    ])('/bootAdmin/systemManager')
  },
  {
    title: '用户中心',
    icon: '',
    children: (pre => [
      {
        title: '用户管理',
        path: `${pre}/userList`,
        icon: ''
      }
    ])('/bootAdmin/userManager')
  }
]
