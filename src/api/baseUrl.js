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

/***
 * 分页后的用户
 */
export const userAllPagePath ='/all'

/**
 * 用户保存
 */
export const userSavePath = '/save'

/**
 *用户修改
 */
export const userUpdatePath ='/update/user'
/**
 * 获取用户详情(用户角色岗位等)
 */
export const userInfoAllPath='/user/info'
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
 * 当前用户菜单
 */
export const currentMenuPath='/current'

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

/**
 * 获取权限id(角色赋权)
 */
export const permissionIdsAllPath = '/permission/menu/all'
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
export const roleAllPagePath = '/all/page'
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

/**
 * 获取角色权限
 */
export const rolePermissionAllPath= '/permission/id'
/**
 * 获取键值对方式的权限
 */
export const rolePermissionMapAllPath= '/permission/map'
/**
 * 更新角色权限
 */
export const rolePermissionSavePath = '/permission/save'

/**
 * 保存数据范围
 */
export const roleOrgSavePath='/org/role/save'

/**
 * 获取数据范围
 */
export const roleOrgAllPath ='/org/role'
/*************角色操作 end*******************/
/*************岗位操作 start*****************/
/**
 * 岗位分页
 */
export const postAllPagePath ='/all'
/**
 * 岗位
 */
export const postAllPath = '/all'

/**
 * 岗位保存
 */
export const postSavePath='/save'

/**
 * 岗位更新
 */
export const postUpdatePath ='/update'

/**
 * 岗位删除
 */
export const postDeletePath='/delete'
/*************岗位操作 end*******************/
/*************数据字典操作 start*************/
/**
 * 保存
 */
export const dictSavePath='/save'
/**
 * 修改
 */
export const dictUpdatePath='/update'
/**
 * 分页
 */
export const dictPageAllPath='/page/all'
/**
 * 分页项
 */
export const dictDataPageAllPath = '/page/all/data'

/**
 * 删除
 */
export const dictDeletePath = '/delete/id'

/**
 * 字典类型
 */
export const dictMapPath='/map'
/*************数据字典操作 end***************/