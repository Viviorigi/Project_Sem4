import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { ParamUtil, RequestParam } from "../../utils/ParamUtil";
import { HeadersUtil } from "../../utils/Headers.Util";

export class BannerService {
  private static _bannerService: BannerService;

  public static getInstance(): BannerService {
    if (!BannerService._bannerService) {
        BannerService._bannerService = new BannerService();
    }
    return BannerService._bannerService;
  }

  public login(login: any) {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/login`);
    return axios.post(url, login, {
      headers: HeadersUtil.getHeaders()
    });
  }

  public getList(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/banner/getAll`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public create(auth:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/banner/create`);
    return axios.post(url,auth, {
      headers: HeadersUtil.getHeadersAuthFormData()
    });
  }
  
  public update(data:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/banner/update`);
    return axios.post(url,data, {
      headers: HeadersUtil.getHeadersAuthFormData()
    });
  }

  public delete(id:any){
    const params: RequestParam[] = ParamUtil.toRequestParams(id);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/banner/delete`, params);

    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }
}