import axios from "axios";
import { ApiUrlUtil } from "../../utils/ApiUrlUtil";
import { ParamUtil, RequestParam } from "../../utils/ParamUtil";
import { HeadersUtil } from "../../utils/Headers.Util";

export class AuthService {
  private static _cateService: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService._cateService) {
      AuthService._cateService = new AuthService();
    }
    return AuthService._cateService;
  }

  public login(login: any) {
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/Auth/login`);
    return axios.post(url, login, {
      headers: HeadersUtil.getHeaders()
    });
  }

  public getList(modelSearch: any) {
    // const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/Account/search`);

    return axios.post(url, modelSearch, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public getListActive(modelSearch: any) {
    const params: RequestParam[] = ParamUtil.toRequestParams(modelSearch);
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/admin/getAllActive`, params);

    return axios.get(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public create(auth:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/Account`);
    return axios.post(url,auth, {
      headers: HeadersUtil.getHeadersAuthFormData()
    });
  }
  
  public update(id:any,auth:any){
    
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/Account/`+id);
    return axios.put(url,auth, {
      headers: HeadersUtil.getHeadersAuthFormData()
    });
  }

  public delete(id:any){
    
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/Account/`+ id );

    return axios.delete(url, {
      headers: HeadersUtil.getHeadersAuth()
    });
  }

  public resetPass(email:any){
    const url = ApiUrlUtil.buildQueryString(process.env.REACT_APP_API_URL + `/api/auth/forgot-password`);
    return axios.post(url,email, {
      headers: HeadersUtil.getHeaders()
    });
  }
  
}