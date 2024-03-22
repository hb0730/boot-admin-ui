interface FormItemProps {
  id?: string;
  /** 角色名称 */
  name: string;
  /** 角色编号 */
  code: string;
  /** 是否启用 */
  enabled?: boolean;
  /** 备注 */
  description: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
