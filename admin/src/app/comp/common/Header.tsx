import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { AuthConstant } from '../../constants/AuthConstant';
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
    Id?: string;        // theo ảnh JWT của bạn là "Id"
    id?: string;
    sub?: string;
    role?: string | string[];
    exp?: number;
    iat?: number;
    email?: string;
    name?: string;
};

export default function Header() {
    const cookie = new Cookies();
    const [fullName, setFullName] = useState("");
    const [avatar, setAvatar] = useState("")
    // const [total, setTotal] = useState(0);
    const total = useRef(0)

    useEffect(() => {
        const token = cookie.get("access_token"); // hoặc AuthConstant.ACCESS_TOKEN
        if (!token) {
            // chưa đăng nhập
            return;
        }

        let payload: JwtPayload;
        try {
            payload = jwtDecode<JwtPayload>(token);
        } catch {
            // token lỗi -> logout
            cookie.remove("access_token");
            window.location.href = process.env.REACT_APP_ADMIN_URL + "/";
            return;
        }

        // check hết hạn
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            cookie.remove("access_token");
            window.location.href = process.env.REACT_APP_ADMIN_URL + "/";
            return;
        }

        const userId = payload.Id || payload.id || payload.sub;
        if (!userId) return;

        // gọi API lấy thông tin user
        axios.get(`${process.env.REACT_APP_API_URL}/api/Account/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const { userName, avatar } = res.data || {};
                if (userName) {
                    cookie.set("fullName", userName, { path: "/" });
                    setFullName(userName);
                }
                if (avatar) {
                    cookie.set("avatar", avatar, { path: "/" });
                    setAvatar(avatar);
                }
            })
            .catch(err => {
                console.error(err);
                // nếu 401/403 thì logout
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    cookie.remove("access_token");
                    window.location.href = process.env.REACT_APP_ADMIN_URL + "/";
                }
            });
        // chạy 1 lần khi mount
    }, []);
    const logout = () => {
        cookie.remove(AuthConstant.ACCESS_TOKEN);
        window.location.href = process.env.REACT_APP_ADMIN_URL + "/"
    }

    return (
        <>
            <nav className="navbar navbar-top fixed-top navbar-expand" id="navbarDefault"  >
                <div className="collapse navbar-collapse justify-content-between">
                    <div className="navbar-logo" style={{ marginLeft: "30px" }}>
                        <button className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation"><span className="navbar-toggle-icon"><span className="toggle-line" /></span></button>
                        <Link className="navbar-brand me-1 me-sm-3" to="/dashboard">
                            <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center"><img src="assets/img/icons/logo.png" alt="phoenix" width={27} />
                                    <p className="logo-text ms-2 d-none d-sm-block">Admin</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <ul className="navbar-nav navbar-nav-icons flex-row align-items-center">
                        {/* Avatar + Dropdown */}
                        <li className="nav-item dropdown d-flex align-items-center">
                            {/* Text hello */}
                            <span className="me-2 fw-semibold d-none d-md-inline">
                                 Hello, {fullName ? fullName : "USER"}
                            </span>

                            <a
                                className="nav-link lh-1 pe-0"
                                id="navbarDropdownUser"
                                href="#!"
                                role="button"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <div className="avatar avatar-l">
                                    <img
                                        className="rounded-circle"
                                        src={
                                            avatar
                                                ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${avatar}`
                                                : defaultPersonImage
                                        }
                                        alt="avatar"
                                    />
                                </div>
                            </a>

                            {/* Dropdown */}
                            <div
                                className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border border-300"
                                aria-labelledby="navbarDropdownUser"
                            >
                                <div className="card position-relative border-0">
                                    <div className="card-body p-0">
                                        <div className="text-center pt-4 pb-3">
                                            <div className="avatar avatar-xl">
                                                <img
                                                    className="rounded-circle"
                                                    src={
                                                        avatar
                                                            ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${avatar}`
                                                            : defaultPersonImage
                                                    }
                                                    alt="avatar"
                                                />
                                            </div>
                                            <h6 className="mt-2 text-black">
                                                {fullName ? fullName : "USER"}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="overflow-auto scrollbar" style={{ height: "10rem" }}>
                                        <ul className="nav d-flex flex-column mb-2 pb-1">
                                            <li className="nav-item">
                                                <Link className="nav-link px-3" to="/dashboard">
                                                    <i className="fa-solid fa-chart-pie me-2"></i>Dashboard
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link px-3" to="/customer">
                                                    <i className="fa-regular fa-user me-2"></i>Khách hàng
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link px-3" to="/category">
                                                    <i className="fa-solid fa-layer-group me-2"></i>Danh mục
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link px-3" to="/post">
                                                    <i className="fa-regular fa-newspaper me-2"></i>Bài viết
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link px-3" to="/product">
                                                    <i className="fa-solid fa-box me-2"></i>Sản phẩm
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-footer p-0 border-top">
                                        <div className="px-3 mt-3 mb-3">
                                            <button
                                                className="btn btn-phoenix-secondary d-flex flex-center w-100"
                                                onClick={logout}
                                            >
                                                <span className="me-2">Đăng xuất</span>
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            </button>
                                        </div>
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
