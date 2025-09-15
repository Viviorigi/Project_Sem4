import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { HeadersUtil } from "../../utils/Headers.Util";
import { ParamUtil, RequestParam } from "../../utils/ParamUtil";

export class ContactService {
  private static _contactService: ContactService;

  public static getInstance(): ContactService {
    if (!ContactService._contactService) {
        ContactService._contactService = new ContactService();
    }
    return ContactService._contactService;
  }

  public create(data: any) {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/contact/create`);
    return axios.post(url, data, {
      headers: HeadersUtil.getHeaders()
    });
  }

  public getList(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/contact/getAll`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public update(data:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/contact/update`);
    return axios.post(url,data, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public delete(id:any){
    const params: RequestParam[] = ParamUtil.toRequestParams(id);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/contact/delete`, params);
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }
 
}