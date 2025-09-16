import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { AuthConstant } from '../../constants/AuthConstant';
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import { NotificationDTO } from '../../model/NotificationDTO';
export default function Header() {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const cookie = new Cookies();
    const [fullName,setFullName] = useState("");
    const [avatar,setAvatar] = useState("")
    // const [total, setTotal] = useState(0);
    const total = useRef(0)
    const [timer, setTimer] = useState(0)

    const isDataFetched = useRef(false);

    useEffect(()=>{
        const storedFullName = cookie.get("fullName");
        const storedAvatar = cookie.get("avatar");
        if (storedFullName) {
            setFullName(storedFullName)
        }
        if(storedAvatar){
            setAvatar(storedAvatar);
        }
      },[notifications,total])
    const logout = ()=>{
        cookie.remove(AuthConstant.ACCESS_TOKEN);
        cookie.remove("fullName");
        window.location.href = process.env.REACT_APP_ADMIN_URL + "/"
    }

    return (
        <>
            <nav className="navbar navbar-top fixed-top navbar-expand" id="navbarDefault"  >
                <div className="collapse navbar-collapse justify-content-between">
                    <div className="navbar-logo" style={{marginLeft:"30px"}}>
                        <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation"><span className="navbar-toggle-icon"><span className="toggle-line" /></span></button>
                        <Link className="navbar-brand me-1 me-sm-3" to="/dashboard">
                            <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center"><img src="assets/img/icons/logo.png" alt="phoenix" width={27} />
                                    <p className="logo-text ms-2 d-none d-sm-block">Admin</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* <div className="search-box navbar-top-search-box d-none d-lg-block" data-list="{&quot;valueNames&quot;:[&quot;title&quot;]}" style={{ width: '25rem' }}>
                        <form className="position-relative" data-bs-toggle="search" data-bs-display="static"><input className="form-control search-input fuzzy-search rounded-pill form-control-sm" type="search" placeholder="Search..." aria-label="Search" />
                            <span className="fas fa-search search-box-icon" />
                        </form>
                        <div className="btn-close position-absolute end-0 top-50 translate-middle cursor-pointer shadow-none" data-bs-dismiss="search"><button className="btn btn-link btn-close-falcon p-0" aria-label="Close" /></div>
                        <div className="dropdown-menu border border-300 font-base start-0 py-0 overflow-hidden w-100">
                            <div className="scrollbar-overlay" style={{ maxHeight: '30rem' }}>
                                <div className="list pb-3">
                                    <h6 className="dropdown-header text-1000 fs--2 py-2">24 <span className="text-500">results</span></h6>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Recently Searched </h6>
                                    <div className="py-2"><a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                        <div className="d-flex align-items-center">
                                            <div className="fw-normal text-1000 title"><span className="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2" /> Store Macbook</div>
                                        </div>
                                    </a>
                                        <a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                            <div className="d-flex align-items-center">
                                                <div className="fw-normal text-1000 title"> <span className="fa-solid fa-clock-rotate-left" data-fa-transform="shrink-2" /> MacBook Air - 13″</div>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Products</h6>
                                    <div className="py-2"><a className="dropdown-item py-2 d-flex align-items-center" href="apps/e-commerce/landing/product-details.html">
                                        <div className="file-thumbnail me-2"><img className="h-100 w-100 fit-cover rounded-3" src="https://prium.github.io/phoenix/v1.13.0/assets/img/products/60x60/3.png" alt="" /></div>
                                        <div className="flex-1">
                                            <h6 className="mb-0 text-1000 title">MacBook Air - 13″</h6>
                                            <p className="fs--2 mb-0 d-flex text-700"><span className="fw-medium text-600">8GB Memory - 1.6GHz - 128GB Storage</span></p>
                                        </div>
                                    </a>
                                        <a className="dropdown-item py-2 d-flex align-items-center" href="apps/e-commerce/landing/product-details.html">
                                            <div className="file-thumbnail me-2"><img className="img-fluid" src="https://prium.github.io/phoenix/v1.13.0/assets/img/products/60x60/3.png" alt="" /></div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 text-1000 title">MacBook Pro - 13″</h6>
                                                <p className="fs--2 mb-0 d-flex text-700"><span className="fw-medium text-600 ms-2">30 Sep at 12:30 PM</span></p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Quick Links</h6>
                                    <div className="py-2"><a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                        <div className="d-flex align-items-center">
                                            <div className="fw-normal text-1000 title"><span className="fa-solid fa-link text-900" data-fa-transform="shrink-2" /> Support MacBook House</div>
                                        </div>
                                    </a>
                                        <a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                            <div className="d-flex align-items-center">
                                                <div className="fw-normal text-1000 title"> <span className="fa-solid fa-link text-900" data-fa-transform="shrink-2" /> Store MacBook″</div>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Files</h6>
                                    <div className="py-2"><a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                        <div className="d-flex align-items-center">
                                            <div className="fw-normal text-1000 title"><span className="fa-solid fa-file-zipper text-900" data-fa-transform="shrink-2" /> Library MacBook folder.rar</div>
                                        </div>
                                    </a>
                                        <a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                            <div className="d-flex align-items-center">
                                                <div className="fw-normal text-1000 title"> <span className="fa-solid fa-file-lines text-900" data-fa-transform="shrink-2" /> Feature MacBook extensions.txt</div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                            <div className="d-flex align-items-center">
                                                <div className="fw-normal text-1000 title"> <span className="fa-solid fa-image text-900" data-fa-transform="shrink-2" /> MacBook Pro_13.jpg</div>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Members</h6>
                                    <div className="py-2"><a className="dropdown-item py-2 d-flex align-items-center" href="pages/members.html">
                                        <div className="avatar avatar-l status-online  me-2 text-900">
                                            <img className="rounded-circle " src="assets/img/team/40x40/10.webp" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="mb-0 text-1000 title">Carry Anna</h6>
                                            <p className="fs--2 mb-0 d-flex text-700">anna@technext.it</p>
                                        </div>
                                    </a>
                                        <a className="dropdown-item py-2 d-flex align-items-center" href="pages/members.html">
                                            <div className="avatar avatar-l  me-2 text-900">
                                                <img className="rounded-circle " src="assets/img/team/40x40/12.webp" alt="" />
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 text-1000 title">John Smith</h6>
                                                <p className="fs--2 mb-0 d-flex text-700">smith@technext.it</p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="text-200 my-0" />
                                    <h6 className="dropdown-header text-1000 fs--1 border-bottom border-200 py-2 lh-sm">Related Searches</h6>
                                    <div className="py-2"><a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                        <div className="d-flex align-items-center">
                                            <div className="fw-normal text-1000 title"><span className="fa-brands fa-firefox-browser text-900" data-fa-transform="shrink-2" /> Search in the Web MacBook</div>
                                        </div>
                                    </a>
                                        <a className="dropdown-item" href="apps/e-commerce/landing/product-details.html">
                                            <div className="d-flex align-items-center">
                                                <div className="fw-normal text-1000 title"> <span className="fa-brands fa-chrome text-900" data-fa-transform="shrink-2" /> Store MacBook″</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="fallback fw-bold fs-1 d-none">No Result Found.</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <ul className="navbar-nav navbar-nav-icons flex-row">
                     
                        <li className="nav-item dropdown"><a className="nav-link lh-1 pe-0" id="navbarDropdownUser" href="index.html#!" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                            <div className="avatar avatar-l ">
                                <img className="rounded-circle "  src={avatar?`${process.env.REACT_APP_API_URL}/api/auth/getImage?atchFleSeqNm=${avatar}`:defaultPersonImage} alt="" />
                            </div>
                        </a>
                            <div className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border border-300" aria-labelledby="navbarDropdownUser">
                                <div className="card position-relative border-0">
                                    <div className="card-body p-0">
                                        <div className="text-center pt-4 pb-3">
                                            <div className="avatar avatar-xl ">
                                                <img className="rounded-circle " src={avatar?`${process.env.REACT_APP_API_URL}/api/auth/getImage?atchFleSeqNm=${avatar}`:defaultPersonImage} alt="" />
                                            </div>
                                            <h6 className="mt-2 text-black">{fullName?fullName:"USER"}</h6>
                                        </div>
                                    </div>
                                    <div className="overflow-auto scrollbar" style={{ height: '10rem' }}>
                                        <ul className="nav d-flex flex-column mb-2 pb-1">
                                            <li className="nav-item"><Link className="nav-link px-3" to="/dashboard"><span className="me-2 text-900" data-feather="pie-chart" />Dashboard</Link></li>
                                            <li className="nav-item"><Link className="nav-link px-3" to="/student"> <span className="me-2 text-900" data-feather="lock" />Sinh viên </Link></li>
                                            <li className="nav-item"><Link className="nav-link px-3" to="/category"> <span className="me-2 text-900" data-feather="lock" />Danh mục </Link></li>
                                            <li className="nav-item"><Link className="nav-link px-3" to="/order"> <span className="me-2 text-900" data-feather="lock" />Đơn Đặt </Link></li>
                                            <li className="nav-item"><Link className="nav-link px-3" to="/book"> <span className="me-2 text-900" data-feather="lock" />Sách</Link></li>
                                        </ul>
                                    </div>
                                    <div className="card-footer p-0 border-top">
                                        <div className="px-3 mt-3 mb-3"> <button className="btn btn-phoenix-secondary d-flex flex-center w-100" onClick={logout}> <span className="me-2">Đăng xuất</span><i className="fa-solid fa-arrow-right-from-bracket"></i></button></div>
         
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
