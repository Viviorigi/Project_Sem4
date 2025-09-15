import Cookies from "universal-cookie"
import { AuthConstant } from "../constants/AuthConstant";


const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  }
}

const getHeadersAuth = () => {
  const cookie = new Cookies();
  const token = AuthConstant.TOKEN_TYPY_KEY + cookie.get(AuthConstant.ACCESS_TOKEN)
  if (cookie.get(AuthConstant.ACCESS_TOKEN) === undefined || cookie.get(AuthConstant.ACCESS_TOKEN) === "") {
    getHeaders()
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token
  };
}

const getHeadersAuthFormData = () => {
  const cookie = new Cookies();
  const token = AuthConstant.TOKEN_TYPY_KEY + cookie.get(AuthConstant.ACCESS_TOKEN)
  if (cookie.get(AuthConstant.ACCESS_TOKEN) === undefined || cookie.get(AuthConstant.ACCESS_TOKEN) === "") {
    getHeaders()
  }
  return {
    'Content-Type': 'multi-part/formdata',
    'Authorization': token
  };
}


export const HeadersUtil = {
  getHeaders: getHeaders,
  getHeadersAuth: getHeadersAuth,
  getHeadersAuthFormData:getHeadersAuthFormData
}