import React, { useState } from 'react'
import { ResetpwdRequest } from '../../model/auth/ResetPwdRequest';
import { AuthService } from '../../services/auth/AuthService';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';

export default function ForgotPassword() {
  const [resetPassword, SetResetPassword] = useState<ResetpwdRequest>(new ResetpwdRequest());
  const dispatch = useAppDispatch();
  const handleChangeText = (event: any) => {
    const { name, value } = event.target;
    SetResetPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const setResetPasswordState = () => {
    SetResetPassword((prev: ResetpwdRequest) => {
      return {
        ...prev,
        email: prev.email || "",
      };
    });
  };
  const chk = () => {
    if (resetPassword.email === undefined || resetPassword.email === "") {
      setResetPasswordState();
      return false;
    }
    return true;
  };
  const send = () => {
    if (!chk()) {
      return;
    }
    dispatch(setLoading(true))
    AuthService.getInstance().resetPass(resetPassword).then((resp: any) => {
      if (resp) {
        dispatch(setLoading(false))
        toast.success(resp.data.message)
      }
    }).catch((error: any) => {
      dispatch(setLoading(false));
      toast.error("Email not found");
    });

  }
  return (
    <div>
      <main className="main" id="top">
        <div className="container">
          <div className="row flex-center min-vh-100 py-5">
            <div className="col-sm-10 col-md-8 col-lg-5 col-xxl-4"><label className="d-flex flex-center text-decoration-none mb-4" >
              <div className="d-flex align-items-center fw-bolder fs-5 d-inline-block"><img src="../../../assets/img/icons/book.avif" alt="phoenix" width={120} /></div>
            </label>
              <div className="px-xxl-5">
                <div className="text-center mb-6">
                  <h4 className="text-1000">Forgot your password?</h4>
                  <p className="text-700 mb-5">Enter your email below and we will send <br className="d-sm-none" />you a reset link</p>
                  <div className="d-flex align-items-center mb-5">
                    <input className="form-control flex-1" id="email" name='email' onChange={handleChangeText} type="email" value={resetPassword.email} placeholder="Email" />
                    <button className="btn btn-primary ms-2" onClick={send}>Send<span className="fas fa-chevron-right ms-2" /></button>
                  </div>
                  <div
                    className={`invalid-feedback ${resetPassword.email?.toString() === "" ? "d-block" : ""
                      }`}
                    style={{ fontSize: "100%", color: "red" }}
                  >
                    Email must not be empty.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
