import { RoleDTO } from "./RoleDTO";

export interface UserDTO {
    userUid: number;
    username: string;
    password: string;
    email: string;
    fullName: string;
    dob: string;
    className: string;
    phone: string;
    address: string;
    avatar: string;
    cre_dt: string;
    upd_dt: string;
    deleted: boolean;
    isActive: boolean;
    resetPasswordToken?: string;
    tokenExpirationDate?: string;
    roles: RoleDTO[];
  }
  