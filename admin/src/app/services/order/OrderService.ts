import axios from "axios";
import { HeadersUtil } from "../../utils/Headers.Util";

const BASE = process.env.REACT_APP_API_URL;

export class OrderService {
  private static _ins: OrderService;
  static getInstance() {
    if (!this._ins) this._ins = new OrderService();
    return this._ins;
  }

  // POST /api/Order/search
  search(body: {
    pageNumber: number;      // 1-based
    pageSize: number;
    keyword?: string;
    status?: string;         // optional
    sortBy?: string;
    sortDir?: string;
  }) {
    return axios.post(`${BASE}/api/Order/search`, body, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

  // GET /api/Order/detail/{orderId}
  detail(orderId: number | string) {
    return axios.get(`${BASE}/api/Order/detail/${orderId}`, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }

changeStatus(id: number | string, newStatus: string) {
  return axios.put(
    `${process.env.REACT_APP_API_URL}/api/Order/change-status/${id}`,
    { newStatus }, // ✅ gửi trong body theo Swagger
    { headers: HeadersUtil.getHeadersAuth() }
  );
}

  // DELETE /api/Order/remove/{id}
  remove(id: number | string) {
    return axios.delete(`${BASE}/api/Order/remove/${id}`, {
      headers: HeadersUtil.getHeadersAuth(),
    });
  }
}
