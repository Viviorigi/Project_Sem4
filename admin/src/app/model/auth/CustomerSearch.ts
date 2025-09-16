export class CustomerSearch {
  keyword?: string;
  pageNumber: number;
  pageSize: number;
  timer: number;
  status?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  roleId?: string;

  constructor(
    keyword: string = "",
    pageNumber: number = 1,
    pageSize: number = 5,
    timer: number = Date.now(),
    status: string = "",
    sortBy: string = "createdAt",
    sortDir: "ASC" | "DESC" = "DESC",
    roleId: string = ""
  ) {
    this.keyword = keyword;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.timer = timer;
    this.status = status;
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.roleId = roleId;
  }
}
