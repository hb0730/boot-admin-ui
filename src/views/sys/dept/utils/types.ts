interface FormItemProps {
  id?: number;
  parentId?: number;
  code?: string;
  name?: string;
  principal?: string;
  phone?: string | number;
  email?: string;
  sort?: number;
  enabled?: boolean;
  description?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
