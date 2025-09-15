import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SideBar() {
    const location = useLocation();

    return (
        <>
            <nav className="navbar navbar-vertical navbar-expand-lg">
                <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
                    {/* scrollbar removed*/}
                    <div className="navbar-vertical-content">
                        <ul className="navbar-nav flex-column" id="navbarVerticalNav">
                            <li className="nav-item">
                                {/* parent pages*/}
                                <div className="nav-item-wrapper">
                                    <div className="parent-wrapper mt-5 label-1">
                                        <ul className="nav " id="nv-home">
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/student" ? "nav-link active" : "nav-link"} to="student" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-regular fa-user"></i> Quản lý Sinh viên</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/category" ? "nav-link active" : "nav-link"} to="category" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-layer-group"></i> Quản lý Thể loại</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/book" ? "nav-link active" : "nav-link"} to="book" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-book"></i> Quản lý Sách</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/order" ? "nav-link active" : "nav-link"} to="order" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-brands fa-first-order"></i> Quản lý Đơn đặt</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/returnbook" ? "nav-link active" : "nav-link"} to="returnbook" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-rotate-left"></i> Quản lý Đơn trả</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/banner" ? "nav-link active" : "nav-link"} to="banner" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-mask"></i> Quản lý Banner</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/contact" ? "nav-link active" : "nav-link"} to="contact" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa fa-commenting-o" aria-hidden="true"></i> Quản lý Liên hệ</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/about" ? "nav-link active" : "nav-link"} to="about" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-boxes-stacked"></i> Quản lý về chúng tôi</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/notification" ? "nav-link active" : "nav-link"} to="notification" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa fa-bell-o"></i> Quản Lý thông báo</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/feedback" ? "nav-link active" : "nav-link"} to="feedback" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa fa-comments"></i> Quản Lý feed back</span></div>
                                            </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
