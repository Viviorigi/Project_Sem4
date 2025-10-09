import React from "react";
import { Link } from "react-router-dom";

export default function DashBoard() {
  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <div style={{ fontSize: 48, lineHeight: 1 }} role="img" aria-label="phone">📱</div>
          <h1 className="h3 fw-bold mt-3 mb-2">Chào mừng, Admin!</h1>
          <p className="text-muted mb-4">
            Đây là trang chào mừng cho <strong>cửa hàng điện thoại</strong>.
            Chọn một mục bên dưới để đi đến trang quản trị tương ứng.
          </p>

          <div className="row g-3 justify-content-center">
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/product" className="btn btn-outline-secondary w-100">Sản phẩm</Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/order" className="btn btn-outline-secondary w-100">Đơn hàng</Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/customer" className="btn btn-outline-secondary w-100">Khách hàng</Link>
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/category" className="btn btn-outline-secondary w-100">Danh mục</Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/postCategory" className="btn btn-outline-secondary w-100">Danh mục bài viết</Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/post" className="btn btn-outline-secondary w-100">Bài viết</Link>
            </div>

            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/comments" className="btn btn-outline-secondary w-100">Bình luận</Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Link to="/requestapproval" className="btn btn-outline-secondary w-100">Duyệt yêu cầu</Link>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-muted small mt-3 mb-0">
        v1.1.0 • © {new Date().getFullYear()} Cửa hàng Điện thoại
      </p>
    </div>
  );
}
