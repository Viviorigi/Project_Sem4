import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AuthConstant } from '../constants/AuthConstant';


export default function AuthGuard(props: any) {
  const cookie = new Cookies();
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);

  // const [accessToken, setAccessToken] = useSearchParams()
  // const _token = accessToken.get(AuthConstant.ACCESS_TOKEN)

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const _token = params.get('access_token');

  if (_token) {
    const expires = new Date();
    expires.setDate(expires.getDate() + AuthConstant.EXPIRES_TOKEN)
    cookie.remove(AuthConstant.ACCESS_TOKEN)
    cookie.remove(AuthConstant.PUBLIC_KEY)
    cookie.set(AuthConstant.ACCESS_TOKEN, _token, { path: '/', expires: expires })
    window.location.href = "/"
  }

  useEffect(() => {
    if (cookie.get('access_token') !== undefined && cookie.get('access_token') !== '') {
      setAuth(true)
    } else {
      // let domain = window.location.origin;
      window.location.href = process.env.REACT_APP_ADMIN_URL + "/login"
    }
  }, [navigate]);

  return auth && props.children;
}