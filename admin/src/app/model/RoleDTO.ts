import { UserDTO } from "./UserDTO";

export interface RoleDTO {
    roleId: string;
    roleName: string;
    users?: UserDTO[];
  }
  