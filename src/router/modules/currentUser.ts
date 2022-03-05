const Layout = () => import("/@/layout/index.vue");
const currentUser = {
  path: "/system/user/current",
  name: "currentUser",
  redirect: "/system/user/current/setting",
  component: Layout,
  meta: {
    icon: "",
    showLink: false,
    i18n: false
  },
  children: [
    {
      path: "/system/user/current/setting",
      name: `userSetting`,
      component: () => import("/@/views/system/user/current/index.vue"),
      meta: {
        showLink: false,
        title: "用户设置",
        i18n: false
      }
    }
  ]
};
export default currentUser;
