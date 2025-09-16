import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginRequest } from '../../model/auth/LoginRequest'
import { toast } from 'react-toastify';
import { AuthService } from '../../services/auth/AuthService';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import Cookies from 'universal-cookie';
import { AuthConstant } from '../../constants/AuthConstant';
import CryptoJS from 'crypto-js';

export default function Login() {
  const [loginRequest, setLoginRequest] = useState<LoginRequest>(new LoginRequest());
  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [msg, setMsg] = useState('');
  const cookie = new Cookies();
  const navigate = useNavigate();

  const handleChangeText = (event: any) => {
    const { name, value } = event.target;
    setLoginRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const storedEmail = cookie.get("email");
    const storedPassword = cookie.get("password");
    if (storedEmail) {
      setLoginRequest(prev => ({
        ...prev,
        email: storedEmail
      }));
    }
    if(storedPassword) {
      setLoginRequest(prev => ({
        ...prev,
        password: decryptPassword(storedPassword,'1234')
      }));
    }
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const setLoginState = () => {
    setLoginRequest((prev: LoginRequest) => {
      return {
        ...prev,
        email: prev.email || "",
        password: prev.password || ""
      };
    });
  };
  const chk = () => {
    if (loginRequest.email === undefined || loginRequest.email === "") {
      setLoginState();
      return false;
    }
    if (loginRequest.password === undefined || loginRequest.password === "") {
      setLoginState();
      return false;
    }

    return true;
  };
  
  const encryptPassword = (password:any, secretKey:any) => {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  };
  const decryptPassword = (encryptedPassword: string, secretKey: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const login = () => {
    if (!chk()) {
      return;
    }
    dispatch(setLoading(true));
    AuthService.getInstance().login(loginRequest).then((resp: any) => {
      console.log(resp);
      
      if (resp) {
        dispatch(setLoading(false))
        const expires = new Date();
        expires.setDate(expires.getDate() + AuthConstant.EXPIRES_TOKEN)
        cookie.set(AuthConstant.ACCESS_TOKEN, resp.data.token, { path: '/', expires: expires })
        console.log(cookie.get(AuthConstant.ACCESS_TOKEN));
        
        // cookie.set('fullName', resp.data.fullName)
        // cookie.set('avatar', resp.data.avatar)
        navigate('/')
        if (rememberMe) {
          cookie.set('email', loginRequest.email)
          cookie.set('password', encryptPassword(loginRequest.password,'1234'), { expires: expires})
        } else {
          cookie.remove('email')
          cookie.remove('password')
        };
      }
    }).catch((error: any) => {
      dispatch(setLoading(false));
      if (error.response.data.message === "You don't have access, login account admin") {
        setMsg(error.response.data.message)
      }
      toast.error("Username or Password wrong");
    });
  }

  return (
    <div>
      <main className="main" id="top">
        <div className="container">
          <div className="row flex-center min-vh-100 py-5">
            <div className="col-sm-10 col-md-8 col-lg-5 col-xl-5 col-xxl-3"><label className="d-flex flex-center text-decoration-none mb-4" >
              <div className="d-flex align-items-center fw-bolder fs-5 d-inline-block"><img src="../../../assets/img/icons/logo.png" alt="phoenix" width={80} /></div>
            </label>
              <div className="text-center mb-7">
                <h3 className="text-1000">Đăng nhập Admin</h3>
                <h5 className="text-1000 text-danger">{msg}</h5>
              </div>
              <div className="mb-3 text-start"><label className="form-label" htmlFor="email">Tài khoản</label>
                <div className="form-icon-container"><input className="form-control form-icon-input" id="email" value={loginRequest.email || ""}
                  onChange={handleChangeText} name='email' type="text" placeholder="Email" /><span className="fas fa-user text-900 fs--1 form-icon" /></div>
                <div
                  className={`invalid-feedback ${loginRequest.email?.toString() === "" ? "d-block" : ""}`}
                  style={{ fontSize: "100%", color: "red" }}
                >
                  Tài khoản không được để trống
                </div>
              </div>
              <div className="mb-3 text-start"><label className="form-label" htmlFor="password">Mật khẩu</label>
                <div className="form-icon-container"><input className="form-control form-icon-input" id="password" value={loginRequest.password || ""}
                  onChange={handleChangeText} name='password' type="password" placeholder="Password" /><span className="fas fa-key text-900 fs--1 form-icon" /></div>
                <div
                  className={`invalid-feedback ${loginRequest.password?.toString() === "" ? "d-block" : ""}`}
                  style={{ fontSize: "100%", color: "red" }}
                >
                  Mật khẩu không được để trống
                </div>
              </div>
              <div className="row flex-between-center mb-5">
                <div className="col-auto">
                  <div className="form-check  mb-0"><input className="form-check-input" id="basic-checkbox" type="checkbox" checked={rememberMe}
                    onChange={handleCheckboxChange} /><label className="form-check-label mb-0" htmlFor="basic-checkbox">Ghi nhớ Đăng nhập</label></div>
                </div>
                <div className="col-auto">
                <Link className="fs--1 fw-semi-bold" to="/forgot-password">Quên mật khẩu?</Link>
                </div>
              </div><button className="btn btn-primary w-100 mb-3" onClick={login}>Đăng nhập</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
