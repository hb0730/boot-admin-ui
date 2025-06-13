export interface IconType {
  /**
   * 图标名称, `svg-icon:`开头为本地svg图标, `iconify:`开头为iconify在线图标，其余为本地图标(离线图标)
   * , 例如: `svg-icon:el-icon-edit`, `iconify:mdi-light:home`, `el-icon-edit`
   */
  icon: string
  /**
   * @description: 图标大小
   */
  size?: string | number
  /**
   * @description: 图标颜色
   */
  color?: string

}
