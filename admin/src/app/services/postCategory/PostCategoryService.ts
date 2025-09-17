// src/services/postCategory/PostCategoryService.ts
import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { HeadersUtil } from "../../utils/Headers.Util";
import { PostCategoryDTO } from "../../model/PostCategoryDTO";

// --- (không bắt buộc) Kiểu dữ liệu gợi ý cho search ---
export type SortDir = "asc" | "desc";

export interface PostCategorySearchReq {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  sortBy?: string;     // ví dụ: "CreatedAt" | "PostCategoryName" | "Id"
  sortDir?: SortDir;   // "asc" | "desc"
}

export interface PostCategoryItem {
  id: number;
  postCategoryName: string;
  active: string;      // "1" | "0"
  createdAt?: string;  // tuỳ backend có trả hay không
}

export interface PostCategorySearchResp {
  items: PostCategoryItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export class PostCategoryService {
  private static _inst: PostCategoryService;

  public static getInstance(): PostCategoryService {
    if (!PostCategoryService._inst) {
      PostCategoryService._inst = new PostCategoryService();
    }
    return PostCategoryService._inst;
  }

  private base = `${process.env.REACT_APP_API_URL}/api/PostCategory`;

  /** POST /api/PostCategory/search */
  public search(body: PostCategorySearchReq) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/search`);
    // Gửi đúng key backend: pageNumber, pageSize, keyword, sortBy, sortDir
    return axios.post(url, body, {
      headers: HeadersUtil.getHeadersAuth(), // application/json + token
    });
  }

  /** GET /api/PostCategory/{id} */
  public getById(id: number) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
    return axios.get<PostCategoryItem>(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  /** POST /api/PostCategory */
  public create(dto: PostCategoryDTO) {
    // Map FE -> BE PascalCase
    const payload = {
      postCategoryName: dto.postCategoryName ?? "",
      active: dto.active ?? "1", // mặc định active
    };
    const url = ApiUrlUtil.buildQueryString(this.base);
    return axios.post(url, payload, {
      headers: HeadersUtil.getHeadersAuth(), // JSON
    });
  }

  /** PUT /api/PostCategory/{id} */
public update(id: number, dto: PostCategoryDTO) {
  const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
  const payload = {
    PostCategoryName: dto.postCategoryName ?? "",
    Active: (dto.active ?? "1"),          // "1" | "0"  ==> STRING
  };
  return axios.put(url, payload, { headers: HeadersUtil.getHeadersAuth() });
}

  /** DELETE /api/PostCategory/{id} */
  public delete(id: number) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }
}
