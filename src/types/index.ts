export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

/** TreeNode as returned by the GraphQL API */
export interface ApiTreeNode {
  id: string;
  label: string;
  name: string | null;
  description: string | null;
  is_assigned: boolean | null;
  in_library: boolean | null;
  properties: ApiProperty[] | null;
  relations: ApiRelation[] | null;
  children: ApiTreeNode[] | null;
}

export interface ApiProperty {
  name: string;
  value: string;
  value_type: string;
  measure: string;
}

export interface ApiRelation {
  name: string;
}

export interface FilterOption {
  label: string;
  checked: boolean;
}

export interface TreeFilters {
  assignedYes: boolean;
  assignedNo: boolean;
  libraryYes: boolean;
  libraryNo: boolean;
}
