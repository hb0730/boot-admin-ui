export interface Dept {
  id: string;
  name: string;
  leader: string;
  phone: string;
  email: string;
  parentId: string;
  sort: number;
  ancestors: string;
  description: string;
  isEnabled: number;
}
export interface DeptTree extends Dept {
  children: DeptTree[];
}
