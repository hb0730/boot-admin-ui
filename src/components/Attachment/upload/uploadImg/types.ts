type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

type UploadType = 'frontEnd' | 'backEnd'

interface UploadImageProps {
  /**
   * 图片地址
   */
  modelValue: string
  /**
   * 上传类型,默认 `frontEnd`
   */
  uploadType?: UploadType
  /**
   * 是否支持拖拽上传,默认 `false`
   */
  drag?: boolean
  /**
   * 是否禁用上传组件,默认 `false`
   */
  disabled?: boolean
  /**
   * 图片大小限制,默认 `5M`
   */
  fileSize?: number
  /**
   * 图片类型限制,默认 `['image/jpeg', 'image/png', 'image/gif']`
   * @see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
   */
  fileType?: FileTypes[]
  /**
   * 组件高度,默认 `150px`
   */
  height?: string
  /**
   * 组件宽度,默认 `150px`
   */
  width?: string
  /**
   * 图片圆角,默认 `8px`
   */
  borderradius?: string
  /**
   * 是否显示删除按钮,默认 `true`
   */
  showDelete?: boolean
  /**
   * 是否显示按钮文字,默认 `true`
   */
  showBtnText?: boolean
}

export type { FileTypes, UploadImageProps }
