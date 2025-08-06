export interface User {
  id: number;
  auth0Sub: string;
  firstName: string;
  lastName: string;
  email: string;
  doc?: string;
  pic?: string;
  profileCompleted: boolean;
}
