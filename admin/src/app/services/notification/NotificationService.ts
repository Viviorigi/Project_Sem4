import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { HeadersUtil } from "../../utils/Headers.Util";
import { ParamUtil, RequestParam } from "../../utils/ParamUtil";

export class NotificationService {
  private static _notificationService: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService._notificationService) {
      NotificationService._notificationService = new NotificationService();
    }
    return NotificationService._notificationService;
  }

  public create(data: any) {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/create`);
    return axios.post(url, data, {
      headers: HeadersUtil.getHeaders()
    });
  }

  public getList(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/getAll`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public getTotal() {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/getTotal`);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public getNewest(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/getNew`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public update(data:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/update`);
    return axios.post(url,data, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public delete(id:any){
    const params: RequestParam[] = ParamUtil.toRequestParams(id);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/notification/delete`, params);
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }
 
}