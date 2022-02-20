export interface Dept {
  id: string;
  name: string;
  leader: string;
  phone: string;
  email: string;
  parentId: String;
  sort: number;
  ancestors: string;
}
export interface DeptTree extends Dept {
  children: DeptTree[];
}
