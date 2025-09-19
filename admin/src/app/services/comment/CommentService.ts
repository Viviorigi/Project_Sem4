import axios from "axios";
import { HeadersUtil } from "../../utils/Headers.Util";

export class CommentService {
  private static _commentService: CommentService;

  public static getInstance(): CommentService {
    if (!CommentService._commentService) {
      CommentService._commentService = new CommentService();
    }
    return CommentService._commentService;
  }

  // Tạo comment
  public create(data: any) {
    const url = `${process.env.REACT_APP_API_URL}/api/Comment`;
    return axios.post(url, data, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  // Search comment (POST body)
  public search(body: any) {
    const url = `${process.env.REACT_APP_API_URL}/api/Comment/search`;
    return axios.post(url, body, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  // Lấy chi tiết comment theo id
  public getById(id: number | string) {
    const url = `${process.env.REACT_APP_API_URL}/api/Comment/${id}`;
    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  // Xoá comment theo id
  public delete(id: number | string) {
    const url = `${process.env.REACT_APP_API_URL}/api/Comment/${id}`;
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }
}
