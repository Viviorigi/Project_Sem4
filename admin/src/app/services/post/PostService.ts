// src/services/post/PostService.ts
import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { HeadersUtil } from "../../utils/Headers.Util";
import { PostDTO } from "../../model/PostDTO";

// --- Kiểu dữ liệu gợi ý cho search ---
export type SortDir = "asc" | "desc";

export interface PostSearchReq {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  sortBy?: string;    // "CreatedAt" | "Title" | "Id"
  sortDir?: SortDir;  // "asc" | "desc"
}

export interface PostItem {
  id: number;
  title: string;
  description?: string;
  postCategoryId: number;
  content: string;
  status?: string;
  imageUrl?: string;   // nếu BE trả link ảnh
  createdAt?: string;
}

export interface PostSearchResp {
  items: PostItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export class PostService {
  private static _inst: PostService;

  public static getInstance(): PostService {
    if (!PostService._inst) {
      PostService._inst = new PostService();
    }
    return PostService._inst;
  }

  private base = `${process.env.REACT_APP_API_URL}/api/Post`;

  /** POST /api/Post/search */
  public search(body: PostSearchReq) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/search`);
    return axios.post(url, body, {
      headers: HeadersUtil.getHeadersAuth(), // JSON + token
    });
  }

  /** GET /api/Post/{id} */
  public getById(id: number) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
    return axios.get<PostItem>(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  /** POST /api/Post  (multipart/form-data) */
  public create(dto: PostDTO) {
    const fd = new FormData();
    fd.append("Title", dto.title ?? "");
    fd.append("Description", dto.description ?? "");
    fd.append("PostCategoryId", String(dto.postCategoryId ?? 0));
    fd.append("Content", dto.content ?? "");
    if (dto.status) fd.append("Status", dto.status);
    if (dto.image) fd.append("Image", dto.image); // đổi "Image" nếu BE dùng tên field khác

    const url = ApiUrlUtil.buildQueryString(this.base);
    return axios.post(url, fd, {
      headers: HeadersUtil.getHeadersAuthFormData(), // <-- dùng đúng HeaderUtil
    });
  }

  /** PUT /api/Post/{id}  (multipart/form-data) */
  public update(id: number, dto: PostDTO) {
    const fd = new FormData();
    fd.append("Title", dto.title ?? "");
    fd.append("Description", dto.description ?? "");
    fd.append("PostCategoryId", String(dto.postCategoryId ?? 0));
    fd.append("Content", dto.content ?? "");
    if (dto.status) fd.append("Status", dto.status);
    if (dto.image) fd.append("Image", dto.image);

    const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
    return axios.put(url, fd, {
      headers: HeadersUtil.getHeadersAuthFormData(), // <-- dùng đúng HeaderUtil
    });
  }

  /** DELETE /api/Post/{id} */
  public delete(id: number) {
    const url = ApiUrlUtil.buildQueryString(`${this.base}/${id}`);
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }
}
