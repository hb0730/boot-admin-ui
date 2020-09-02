/***用户 ***/

/**
 * 登录
 */
export const userLoginUrl = "/auth/login";

/**
 * 登出
 */
export const userLogoutUrl = "/auth/logout";

/**
 * 当前已认证的用户
 */
export const currentUserInfoUrl = "";

/**
 * 根据id修改
 */
export const userUpdateByIdUrl="/update";

/**
 * 修改密码
 */
export const updatePasswordUrl="/update/password";

/****菜单 ******/
/**
 * 当前用户菜单树
 */
export const menuCurrentTreeUrl="/get/current/tree";
/**
 * 当前菜单对应的路由
 */
export const menuCurrentRouterUrl="/get/current/router"
/**
 * 菜单树
 */
export const menuQueryTreeUrl="/query/tree"

/**
 * 根据id修改
 */
export const menuUpdateByIdUrl='/update'
/**
 * 新增菜单
 */
export const menuSaveUrl='/save';

/**
 * 根据id删除菜单
 */
export const menuDeleteByIdUrl="/delete"

/*****权限**************/
/**
 * 根据菜单获取权限
 */
export const permissionPageByMenuIdUrl='/menu/page'

export const permissionListByMenuIdUrl='/menu/list'

/**
 * 新增权限
 */
export const permsisionSaveUrl='/save'
/**
 * 根据id修改
 */
export const permissionUpdateByIdUrl="/update"
/**
 * 删除
 */
export const permissionDeleteUrl='/delete'

/****组织 */
/**
 * 组织树
 */
export const deptTreeAllUrl='/tree/all';