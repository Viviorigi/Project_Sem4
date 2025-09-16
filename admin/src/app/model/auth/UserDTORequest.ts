export class UserDTORequest {
  id?: string;             // chỉ cần khi update (GUID)
  email: string;
  username: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
  gender?: string;         // backend khai báo string? nên để string
  avatar?: File | null;    // multipart file

  constructor(init?: Partial<UserDTORequest>) {
    this.id = init?.id;
    this.email = init?.email ?? "";
    this.username = init?.username ?? "";
    this.password = init?.password ?? "";
    this.role = init?.role ?? "User";  // default
    this.phone = init?.phone ?? "";
    this.address = init?.address ?? "";
    this.gender = init?.gender ?? "";
    this.avatar = init?.avatar ?? null;
  }
}
