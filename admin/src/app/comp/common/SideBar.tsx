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
                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/customer" ? "nav-link active" : "nav-link"} to="customer">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-users"></i> Quản lý Khách Hàng
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/category" ? "nav-link active" : "nav-link"} to="category">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-list"></i> Quản lý Danh Mục
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/product" ? "nav-link active" : "nav-link"} to="product">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-box"></i> Quản lý Sản Phẩm
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/order" ? "nav-link active" : "nav-link"} to="order">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-cart-shopping"></i> Quản lý Đơn Hàng
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/postCategory" ? "nav-link active" : "nav-link"} to="postCategory">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-book-open"></i> Quản lý Danh Mục Bài Viết
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/post" ? "nav-link active" : "nav-link"} to="post">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-pen-to-square"></i> Quản lý Bài Viết
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/requestApproval" ? "nav-link active" : "nav-link"} to="requestApproval">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-solid fa-check-to-slot"></i> Xử lý Bình luận
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item mb-2">
                                                <Link className={location.pathname === "/comments" ? "nav-link active" : "nav-link"} to="comments">
                                                    <div className="d-flex align-items-center">
                                                        <span className="nav-link-text" style={{ fontSize: "16px", paddingLeft: "0" }}>
                                                            <i className="fa-regular fa-comments"></i> Danh sách Bình Luận
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
