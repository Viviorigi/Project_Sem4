import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { HeadersUtil } from "../../utils/Headers.Util";
import { ParamUtil, RequestParam } from "../../utils/ParamUtil";

export class AboutService {
  private static _aboutService: AboutService;

  public static getInstance(): AboutService {
    if (!AboutService._aboutService) {
        AboutService._aboutService = new AboutService();
    }
    return AboutService._aboutService;
  }

  public create(data: any) {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/about/create`);
    return axios.post(url, data, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public getList(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/about/getAll`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public update(data:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/about/update`);
    return axios.post(url,data, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public delete(id:any){
    const params: RequestParam[] = ParamUtil.toRequestParams(id);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/about/delete`, params);
    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }
 
}