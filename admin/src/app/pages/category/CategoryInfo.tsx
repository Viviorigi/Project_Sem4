// CategoryInfo.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultPersonImage from '../../../assets/images/imagePerson.png';
import { HeadersUtil } from '../../utils/Headers.Util';

type CategoryInfoModel = {
  id: number;
  categoryName: string;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  description?: string | null;
};

type ProductRow = {
  id: number;
  productName: string;
  price: number;
  salePrice: number;
  image?: string | null;
  active: boolean;
  createdAt?: string | null;
  category?: { id: number; categoryName: string; active: boolean } | null;
};

type Props = {
  info: CategoryInfoModel;
  onRefresh?: () => void;    
  closeDetail: () => void;
};

const formatDate = (date?: string | null) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

const buildImg = (file?: string | null) => {
  if (!file) return defaultPersonImage;
  if (/^https?:\/\//i.test(file)) return file;
  return `${process.env.REACT_APP_API_URL}/api/Account/getImage/${file}`;
};

// component
export default function CategoryInfo({ info, onRefresh, closeDetail }: Props) {
  // ---- state cho danh sách sản phẩm thuộc danh mục ----
  const PAGE_SIZE = 8;
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'CreatedAt' | 'ProductName' | 'Price'>('CreatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const statusBadge = info.active
    ? { label: 'Đang hoạt động', className: 'badge badge-phoenix fs--2 badge-phoenix-success' }
    : { label: 'Không hoạt động', className: 'badge badge-phoenix fs--2 badge-phoenix-danger' };

  // ---- load products theo category ----
  const fetchProducts = async () => {
    if (!info?.id) return;
    try {
 
      const url = `${process.env.REACT_APP_API_URL}/api/Product/search`;
      const body = {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        keyword: keyword || '',
        status: '',
        sortBy,
        sortDir,
        fromPrice: 0,
        toPrice: 0,
        categoryId: String(info.id),
        optionIds: [],
      };
      const resp = await axios.post(url, body, {
        headers: { ...HeadersUtil.getHeadersAuth?.() },
      });

      const r = resp.data || {};
      setProducts(r.data ?? []);
      setTotalRecords(r.totalRecords ?? 0);
      const pages = Math.max(1, Math.ceil((r.totalRecords ?? 0) / (r.pageSize ?? PAGE_SIZE)));
      setTotalPages(pages);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không tải được sản phẩm của danh mục');
    } finally {

    }
  };

  useEffect(() => {
    setPage(1); // khi đổi danh mục, reset về page 1
  }, [info?.id]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info?.id, page, sortBy, sortDir]); // keyword bấm Enter mới tìm (để nhẹ)

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      fetchProducts();
  };

  const handlePageClick = (p: number) => setPage(p);
  const prev = () => setPage((cur) => Math.max(1, cur - 1));
  const next = () => setPage((cur) => Math.min(totalPages, cur + 1));

  return (
    <div>
      {/* Header */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">Chi tiết Danh mục</h2>
        </div>
        <div className="col-auto">
          <span className={statusBadge.className}>
            <span className="badge-label">{statusBadge.label}</span>
          </span>
        </div>
      </div>

      {/* Thông tin danh mục */}
      <div className="card mb-4">
        <div className="card-body d-flex flex-wrap gap-4">
          <div>
            <div className="text-800 mb-1">Tên danh mục</div>
            <div className="fs-4 fw-bold">{info.categoryName}</div>
          </div>
          <div>
            <div className="text-800 mb-1">Ngày tạo</div>
            <div className="fs-4">{formatDate(info.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Bộ lọc nhỏ trong dialog */}
      <div className="row g-3 align-items-end mb-2">
        <div className="col-md-4">
          <label className="form-label">Tìm sản phẩm trong danh mục</label>
          <input
            type="search"
            className="form-control"
            placeholder="Từ khóa"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyUp={handleSearchEnter}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Sắp xếp theo</label>
          <select className="form-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}>
            <option value="CreatedAt">Ngày tạo</option>
            <option value="ProductName">Tên sản phẩm</option>
            <option value="Price">Giá</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Thứ tự</label>
          <select className="form-select" value={sortDir} onChange={(e) => { setSortDir(e.target.value as any); setPage(1); }}>
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary mt-3" onClick={() => { setPage(1); fetchProducts(); }}>
            <span className="fas fa-search me-2" /> Tìm
          </button>
        </div>
      </div>

      {/* Bảng sản phẩm thuộc danh mục */}
      <div className="border-bottom border-200 position-relative top-1">
        <div className="table-responsive scrollbar-overlay mx-n1 px-1">
          <table className="table table-bordered fs--1 mb-2 mt-3">
            <thead>
              <tr>
                <th className="text-center" style={{ width: '6%' }}>#</th>
                <th className="text-center" style={{ width: '30%' }}>SẢN PHẨM</th>
                <th className="text-center" style={{ width: '12%' }}>GIÁ</th>
                <th className="text-center" style={{ width: '12%' }}>GIÁ KM</th>
                <th className="text-center" style={{ width: '16%' }}>NGÀY TẠO</th>
                <th className="text-center" style={{ width: '12%' }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id}>
                  <td className="text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-m">
                        <img
                          className="rounded-circle"
                          src={buildImg(p.image)}
                          alt="Product"
                          onError={(e) => {
                            const t = e.currentTarget as HTMLImageElement;
                            t.onerror = null;
                            t.src = defaultPersonImage;
                          }}
                        />
                      </div>
                      <p className="mb-0 ms-3 fw-bold">{p.productName}</p>
                    </div>
                  </td>
                  <td className="text-center">{p.price?.toLocaleString?.('vi-VN')}</td>
                  <td className="text-center">{p.salePrice?.toLocaleString?.('vi-VN')}</td>
                  <td className="text-center">{formatDate(p.createdAt)}</td>
                  <td className="text-center">
                    <span className={
                      p.active
                        ? 'badge badge-phoenix fs--2 badge-phoenix-success'
                        : 'badge badge-phoenix fs--2 badge-phoenix-danger'
                    }>
                      {p.active ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-700 py-4">Không có sản phẩm</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
          <div className="col-auto">
            <p className="mb-0 d-none d-sm-block fw-semi-bold">
              Tổng số sản phẩm: {totalRecords}
            </p>
          </div>
          <div className="col-auto d-flex">
            <button className="page-link" onClick={prev}>
              <span className="fas fa-chevron-left" />
            </button>
            <ul className="mb-0 pagination mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageClick(i + 1)}
                >
                  <span className="page-link">{i + 1}</span>
                </li>
              ))}
            </ul>
            <button className="page-link pe-0" onClick={next}>
              <span className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
