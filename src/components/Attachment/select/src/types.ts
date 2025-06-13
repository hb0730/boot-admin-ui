export interface AttachmentSelectProps {
  // ------------------------------input--------------------------------------------------
  /**
   * modelValue
   */
  modelValue?: string
  /**
   *  placeholder
   */
  placeholder?: string
  /**
   * 是否只读
   */
  readonly?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  // ------------------------------select--------------------------------------------------
  /**
   * 是否多选
   */
  multiple?: boolean
}

export interface AttachmentDialogProps {
  /**
   * 是否多选
   */
  multiple?: boolean
  /**
   * 是否显示
   */
  visible: boolean

  /**
   * 标题
   */
  title?: string
  /**
   * 宽度
   */
  width?: string
}
