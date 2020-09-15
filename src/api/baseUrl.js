/***用户 ***/
//登录
export const userLoginUrl = "/auth/login";
//登出
export const userLogoutUrl = "/auth/logout";
// 当前已认证的用户
export const currentUserInfoUrl = "";
//根据id修改
export const userUpdateByIdUrl = "/update";
//修改密码
export const updatePasswordUrl = "/update/password";
//////////用户列表/////////////////
//用户列表
export const userPageUrl = '/list/page'
//用户保存
export const userSaveUrl = '/save'
//用户修改
export const userUpdateUrl = '/update'
//删除
export const userDeleteUrl = '/delete';
//重置密码
export const userRestPasswordUrl = '/rest/password'

/////////////菜单///////////////////////
//当前用户菜单树
export const menuCurrentTreeUrl = "/get/current/tree";
//当前菜单对应的路由
export const menuCurrentRouterUrl = "/get/current/router"
//更新当前用户缓存
export const menuCurrentUpdateUrl = "/update/current"
//菜单树
export const menuQueryTreeUrl = "/query/tree"
//菜单权限树
export const menuPermissionQueryTreeUrl = '/query/tree/permission';
//根据id修改
export const menuUpdateByIdUrl = '/update'
//新增菜单
export const menuSaveUrl = '/save';
//根据id删除菜单
export const menuDeleteByIdUrl = "/delete"
////////////权限///////////////////////////////
//根据菜单获取权限
export const permissionPageByMenuIdUrl = '/menu/page'

export const permissionListByMenuIdUrl = '/menu/list'
//新增权限
export const permsisionSaveUrl = '/save'
//根据id修改
export const permissionUpdateByIdUrl = "/update"
//删除
export const permissionDeleteUrl = '/delete'
/////////////组织///////////////////
//组织树
export const deptTreeAllUrl = '/tree/all';
//修改
export const deptUpdateById = '/update';
//新增
export const deptSaveUrl = "/save"
//删除
export const deptDeleteUrl = "/delete";
///////////角色///////////////////////////
//角色新增
export const roleSaveUrl = '/save';
//分页查询
export const rolePageUrl = '/list/page';
//列表
export const roleListUrl = '/list'
//根据id修改
export const roleUpdateByIdUrl = '/update'
//根据id修改权限
export const rolePermissionUpdateUrl = '/update/permission'
//删除
export const roleDeleteUrl = '/delete'
///////////岗位///////////////
//新增
export const postSaveUrl = '/save'
//分页查询
export const postPageListUrl = '/list/page';
//列表查询
export const postListUrl = '/list'
// 根据id修改
export const postUpdateByIdUrl = '/update'
//删除
export const postDeleteUrl = '/delete';
//导出
export const postExportUrl = '/export'
/////////数据字典///////////////////
// 保存
export const dictSaveUrl = '/save';
//修改
export const dictUpdateByIdUrl = '/update'
//分页
export const dictPageListUrl = '/list/page'
//删除
export const dictDeleteUrl = '/delete'
//更新缓存
export const dictUpdateCacheUrl = '/cache/update'
//获取缓存
export const dictGetCacheUrl = '/cache/get';
////数据字典项/////
// 保存
export const dictEntrySaveUrl = '/save';
//修改
export const dictEntryUpdateByIdUrl = '/update'
//分页
export const dictEntryPageListUrl = '/list/page'
//删除
export const dictEntryDeleteUrl = '/delete'
/////定时任务/////
//page
export const jobListPageUrl = '/list/page'
//列表
export const jobListUrl = '/list'
//保存
export const jobSaveUrl = '/save'
//修改
export const jobUpdateByIdUrl = '/update'
//删除
export const jobDeleteUrl = '/delete'
//立即执行
export const jobExecUrl = '/exec'
///////定时任务日志//////////
//page
export const jobLogListPageUrl = '/list/page';
//////在线用户///////////////
//page
export const userOnlineListPageUrl = '/list/page'
//logout 强制登出
export const userOnlineLogoutUrl = '/logout'
//////操作日志//////////
//page
export const operLogListPageUrl = '/list/page'
//删除
export const operLogDeleteUrl = '/delete'
//清除
export const operLogCleanUrl = '/clean'
//////登录日志/////////
//page
export const loginLogListPageUrl = '/list/page'
//删除
export const loginLogDeleteUrl = '/delete'
//清除
export const loginLogCleanUrl = '/clean'
/////////mail/////////////////
//info
export const mailInfoUrl='/'
// 保存
export const mailSaveUrl='/save'
//test
export const mailTestUrl='/test'