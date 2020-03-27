/**************用户操作 start*******************/
/**
 * 用户登录
 * @type {string}
 */
export const loginPath = '/auth/login'

/**
 * 登出
 * @type {string}
 */
export const logoutPath = '/auth/logout'

/**
 * 用户详情
 */
export const userInfoPath='/info'
/**
 * 修改用户详情
 */
export const userUpdateInfoPath='/update/info'
/**
 * 修改用户密码
 */
export const userUpdatePasswordPath = '/update/password'
/*************用户操作 end**********************/

/*************菜单操作 start*******************/
/**
 *树形菜单
 */
export const menuTreePath ='/tree'

/**
 * 菜单新增
 */
export const menuSavePath = '/save'

/**
 * 菜单修改
 */
export const menuUpdatePath = '/update'

/**
 * 删除
 */
export const menuDeletePath = '/delete'

/**
 * 获取权限
 */
export const permissionSavePath= '/permission/save'

/**
 * 分页后的权限
 */
export const permissionPagePath = '/permission'

/**
 * 修改权限
 */
export const permissionUpdatePath='/permission/update'
/**
 * 删除
 */
export const permissionDeletePath='/permission/delete'
/*************菜单操作 end*******************/

/*************组织操作 start*****************/
/**
 * 组织保存
 */
export const orgSavePath='/save'

/**
 * 组织树
 */
export const orgTreePath='/tree'

/**
 * 修改组织信息
 */
export const orgUpdatePath = '/update'

/**
 * 删除
 */
export const orgDeletePath = '/delete'
/*************组织操作 end*******************/
/*************角色操作 start*****************/
/**
 * 全部角色
 */
export const roleAllPath = '/all'
/**
 * 分页后的全部角色
 */
export const roleAllPathPath = '/all/page'
/**
 * 保存角色
 */
export const roleSavePath = '/save'
/**
 * 修改角色
 */
export const roleUpdatePath = '/update'
/**
 * 删除角色
 */
export const roleDeletePath = '/delete'
/*************角色操作 end*******************/
