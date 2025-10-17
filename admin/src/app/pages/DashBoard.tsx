import React from "react";
import { Link } from "react-router-dom";

export default function DashBoard() {
  return (
    <>
    
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body text-center p-5">
          {/* Icon */}
          <div style={{ fontSize: 64, lineHeight: 1 }} role="img" aria-label="phone">
            📱
          </div>

          {/* Title + Subtitle */}
          <h1 className="fw-bold mt-3 mb-2">Chào mừng, Admin!</h1>
          <p className="text-muted mb-5 fs-5">
            Đây là trang chào mừng cho <strong>cửa hàng điện thoại</strong>.  
            Chọn một mục bên dưới để đi đến trang quản trị tương ứng.
          </p>

          {/* Buttons grid */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/product" className="admin-btn w-100">
                <i className="bi bi-phone me-2"></i> Sản phẩm
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/order" className="admin-btn w-100">
                <i className="bi bi-bag-check me-2"></i> Đơn hàng
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/customer" className="admin-btn w-100">
                <i className="bi bi-people me-2"></i> Khách hàng
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/category" className="admin-btn w-100">
                <i className="bi bi-tags me-2"></i> Danh mục
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/postCategory" className="admin-btn w-100">
                <i className="bi bi-journal-text me-2"></i> Danh mục bài viết
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/post" className="admin-btn w-100">
                <i className="bi bi-pencil-square me-2"></i> Bài viết
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/comments" className="admin-btn w-100">
                <i className="bi bi-chat-dots me-2"></i> Bình luận
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to="/requestapproval" className="admin-btn w-100">
                <i className="bi bi-shield-check me-2"></i> Duyệt yêu cầu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          background-color: #fff;
          color: #495057;
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .admin-btn:hover {
          background: linear-gradient(90deg, #0d6efd, #6610f2);
          color: #fff;
          border-color: transparent;
          transform: translateY(-3px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.15);
        }

        .card {
          background-color: #fefefe;
        }
      `}</style>
    </div>

    <footer className="footer position-absolute">
        <div className="row g-0 justify-content-between align-items-center h-100">
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 mt-2 mt-sm-0 text-900">
              Admin<span className="d-none d-sm-inline-block" />
              <span className="d-none d-sm-inline-block mx-1">|</span>
              <br className="d-sm-none" />2025 ©
            </p>
          </div>
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 text-600">v1.1.0</p>
          </div>
        </div>
      </footer>
     </>
  );
}
