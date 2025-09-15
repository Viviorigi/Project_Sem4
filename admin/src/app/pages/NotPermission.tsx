import React from 'react'
import { Link } from 'react-router-dom'

export default function NotPermission() {
  return (
    <div>
      <main className="main" id="top">
        <div className="px-3">
          <div className="row min-vh-100 flex-center p-5">
            <div className="col-12 col-xl-10 col-xxl-8">
              <div className="row justify-content-center align-items-center g-5">
                <div className="col-12 col-lg-6 text-center order-lg-1"><img className="img-fluid w-lg-100 d-dark-none" src="../../assets/img/spot-illustrations/403-illustration.png" alt="" width={400} /><img className="img-fluid w-md-50 w-lg-100 d-light-none" src="../../assets/img/spot-illustrations/dark_403-illustration.png" alt="" width={540} /></div>
                <div className="col-12 col-lg-6 text-center text-lg-start"><img className="img-fluid mb-6 w-50 w-lg-75 d-dark-none" src="../../assets/img/spot-illustrations/403.png" alt="" /><img className="img-fluid mb-6 w-50 w-lg-75 d-light-none" src="../../assets/img/spot-illustrations/dark_403.png" alt="" />
                  <h2 className="text-800 fw-bolder mb-3">Access Forbidden!</h2>
                  <p className="text-900 mb-5">Halt! Thou art endeavouring to trespass upon a realm not granted unto thee.<br className="d-none d-sm-block" />granted unto thee.</p><Link className="btn btn-lg btn-primary" to="/login">Back to login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
