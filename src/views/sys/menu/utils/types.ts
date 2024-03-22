interface FormItemProps {
  id?: number;
  parentId?: number;
  children?: FormItemProps[];
  path?: string;
  routeName?: string;
  redirect?: string;
  component?: string;
  title?: string;
  icon?: string;
  showLink?: boolean;
  rank?: number;
  showParent?: boolean;
  keepAlive?: boolean;
  frameSrc?: string;
  menuType?: number;
  permission?: string;
  enabled?: boolean;
  menuTypeName?: string;
}

interface TableColumnsProps extends FormItemProps {
  hasChildren: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, TableColumnsProps, FormProps };
