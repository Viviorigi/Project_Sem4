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
                                        <ul className="nav " id="nv-home" >
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/customer" ? "nav-link active" : "nav-link"} to="customer"  >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }} ><i className="fa-regular fa-user"></i> Quản lý Khách Hàng </span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/category" ? "nav-link active" : "nav-link"} to="category" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-layer-group"></i> Quản lý Danh Mục</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/product" ? "nav-link active" : "nav-link"} to="product" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-book"></i> Quản lý Sản phẩm</span></div>
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
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/postCategory" ? "nav-link active" : "nav-link"} to="postCategory" >
                                                <div className="d-flex align-items-start"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa-solid fa-mask"></i> Quản lý danh mục bài viết</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/post" ? "nav-link active" : "nav-link"} to="post" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa fa-commenting-o" aria-hidden="true"></i> Quản lý bài viết</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2"><Link className={location.pathname === "/requestApproval" ? "nav-link active" : "nav-link"} to="requestApproval" >
                                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}><i className="fa fa-comments"></i>Xử lý Bình luận</span></div>
                                            </Link>
                                            </li>
                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/comments" ? "nav-link active" : "nav-link"}to="comments" >
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-message"></i> Danh sách bình luận
                                                        </span>
                                                    </div>
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
