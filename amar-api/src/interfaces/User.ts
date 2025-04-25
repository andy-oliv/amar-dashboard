import Role from './Role';

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  pictureUrl?: string;
  roleId?: string[];
  roles?: { roleId: string }[];
}
