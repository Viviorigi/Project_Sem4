import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import AddProductForm from './ProductForm';
import { toast } from 'react-toastify';
import Pagination from '../../comp/common/Pagination';
import { formatDate } from '../../utils/FunctionUtils';
import defaultPersonImage from '../../../assets/images/imagePerson.png';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { HeadersUtil } from '../../utils/Headers.Util';
import ProductInfo from './ProductInfo';
import { Dialog } from 'primereact/dialog';

// ---------- Types ----------
type ProductRow = {
  id: number;
  productName: string;
  price: number;
  salePrice: number;
  image?: string | null;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  category?: { id: number; categoryName: string; active: boolean } | null;
  album?: string | null;
};

type SearchDto = {
  keySearch: string;
  page: number;
  cate_id: number;
  sortBy: 'CreatedAt' | 'ProductName' | 'Price';
  sortDir: 'asc' | 'desc';
  fromPrice: number | '';
  toPrice: number | '';
  timer: number; // dùng để trigger reload
};

// ---------- Component ----------
export default function Product() {
  const dispatch = useAppDispatch();

  const [searchDto, setSearchDto] = useState<SearchDto>({
    keySearch: '',
    page: 1,
    cate_id: 0,
    sortBy: 'CreatedAt',
    sortDir: 'desc',
    fromPrice: '',
    toPrice: '',
    timer: Date.now(),
  });

  const [list, setList] = useState<ProductRow[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const productRef = useRef<any>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const handleClickCloseDetail = () => setOpenDetail(false);

  const PAGE_SIZE = 5;

  // ---------- Helpers ----------
  const buildImg = (filename?: string | null) =>
    filename ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${filename}` : defaultPersonImage;

  const triggerReload = () =>
    setSearchDto(prev => ({ ...prev, page: 1, timer: Date.now() }));

  // ---------- CRUD ----------
  const addProduct = () => {
    productRef.current = null;
    setShowForm(true);
  };

  const editProduct = (row: ProductRow) => {
    productRef.current = row;
    setShowForm(true);
  };

  const info = (row: ProductRow) => {
    productRef.current = row;
    setOpenDetail(true);
  };

  const delProduct = (id: number) => {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#89B449',
      cancelButtonColor: '#E68A8C',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async res => {
      if (!res.value) return;
      try {
        dispatch(setLoading(true));
        const url = `${process.env.REACT_APP_API_URL}/api/Product/${id}`;
        await axios.delete(url, { headers: HeadersUtil.getHeadersAuth() });
        toast.success('Đã xóa');
        triggerReload();
      } catch {
        toast.error('Xóa thất bại');
      } finally {
        dispatch(setLoading(false));
      }
    });
  };

  // ---------- Fetch categories (filter) ----------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/Category/search`;
        const body = {
          pageNumber: 1,
          pageSize: 200,
          keyword: "",
          status: "1",          // nếu BE hiểu "1" = active
          sortBy: "CategoryName",
          sortDir: "asc",
        };
        const resp = await axios.post(url, body, {
          headers: HeadersUtil.getHeadersAuth(),
        });

        const data = resp.data?.data ?? resp.data?.content ?? [];
        setCategoryList(
          data.map((c: any) => ({
            id: c.id,
            categoryName: c.categoryName ?? c.name ?? "",
          }))
        );
      } catch (err) {
        console.error("Load categories error:", err);
        setCategoryList([]);
      }
    };

    fetchCategories();
  }, []);


  // ---------- Fetch products ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/Product/search`;
        const body = {
          pageNumber: searchDto.page,
          pageSize: PAGE_SIZE,
          keyword: searchDto.keySearch || '',
          status: '', // '1' | '0' nếu cần
          sortBy: searchDto.sortBy,
          sortDir: searchDto.sortDir,
          fromPrice: Number(searchDto.fromPrice) || 0,
          toPrice: Number(searchDto.toPrice) || 0,
          categoryId: searchDto.cate_id ? String(searchDto.cate_id) : '',
          optionIds: [],
        };

        const resp = await axios.post(url, body, {
          headers: { 'Content-Type': 'application/json' },
        });

        const r = resp.data || {};
        setList(r.data ?? []);
        setTotalItems(r.totalRecords ?? 0);
        const pages = Math.max(1, Math.ceil((r.totalRecords ?? 0) / (r.pageSize ?? PAGE_SIZE)));
        setTotalPages(pages);
      } catch (err) {
        console.error('Fetch product error:', err);
      }
    };
    fetchData();
  }, [
    searchDto.page,
    searchDto.timer,
    searchDto.keySearch,
    searchDto.cate_id,
    searchDto.sortBy,
    searchDto.sortDir,
    searchDto.fromPrice,
    searchDto.toPrice,
  ]);

  // ---------- Events ----------
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchDto(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') triggerReload();
  };

  const handlePageClick = (pageNumber: number) =>
    setSearchDto(prev => ({ ...prev, page: pageNumber }));
  const prev = () =>
    searchDto.page > 1 && setSearchDto(prev => ({ ...prev, page: prev.page - 1 }));
  const next = () =>
    searchDto.page < totalPages && setSearchDto(prev => ({ ...prev, page: prev.page + 1 }));

  const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as SearchDto['sortBy'];
    setSearchDto(prev => ({ ...prev, sortBy: v, page: 1, timer: Date.now() }));
  };

  const onChangeSortDir = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as SearchDto['sortDir'];
    setSearchDto(prev => ({ ...prev, sortDir: v, page: 1, timer: Date.now() }));
  };

  const onChangeFromPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchDto(prev => ({ ...prev, fromPrice: v === '' ? '' : Number(v), page: 1, timer: Date.now() }));
  };

  const onChangeToPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchDto(prev => ({ ...prev, toPrice: v === '' ? '' : Number(v), page: 1, timer: Date.now() }));
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = parseInt(e.target.value, 10);
    setSearchDto(prev => ({ ...prev, cate_id: v, page: 1, timer: Date.now() }));
  };

  const clearFilters = () =>
    setSearchDto(prev => ({
      ...prev,
      sortBy: 'CreatedAt',
      sortDir: 'desc',
      fromPrice: '',
      toPrice: '',
      cate_id: 0,
      page: 1,
      timer: Date.now(),
    }));

  // ---------- Render ----------
  return (
    <div>
      <div className="mb-9">
        <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh Sách Sản Phẩm</h2>
            </div>
          </div>

          <div id="products">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-md-3">
                <label className="form-label">Tìm kiếm</label>
                <div className="d-flex">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Từ khóa"
                    name="keySearch"
                    value={searchDto.keySearch}
                    onChange={handleChangeText}
                    onKeyUp={handleKeyUpSearch}
                  />
                  <button className="btn btn-primary " onClick={triggerReload}>
                    <span className="fas fa-search" />
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="col-md-1">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  value={searchDto.cate_id}
                  onChange={onChangeCategory}
                >
                  <option value={0}>Tất cả</option>
                  {categoryList.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>

              </div>

              {/* SortBy */}
              <div className="col-md-2">
                <label className="form-label">Sắp xếp theo</label>
                <select className="form-select" value={searchDto.sortBy} onChange={onChangeSortBy}>
                  <option value="CreatedAt">Ngày tạo</option>
                  <option value="ProductName">Tên sản phẩm</option>
                  <option value="Price">Giá</option>
                </select>
              </div>

              {/* SortDir */}
              <div className="col-md-2">
                <label className="form-label">Thứ tự</label>
                <select className="form-select" value={searchDto.sortDir} onChange={onChangeSortDir}>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>

              {/* Price range */}
              <div className="col-md-2">
                <label className="form-label">Giá từ</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={searchDto.fromPrice}
                  onChange={onChangeFromPrice}
                  min={0}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Đến</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={searchDto.toPrice}
                  onChange={onChangeToPrice}
                  min={0}
                />
              </div>
              <div className="col-auto scrollbar overflow-hidden-y flex-grow-1" />
              <div className="col-auto">
                <div className="btn-group" role="group" aria-label="Actions">
                  <button className="btn btn-outline-secondary" onClick={clearFilters} title="Xóa lọc">
                    <i className="fa-solid fa-rotate-left me-2" />
                    Xóa lọc
                  </button>
                  <button className="btn btn-primary" onClick={addProduct} title="Thêm sản phẩm">
                    <span className="fas fa-plus me-2" />
                    Thêm Sản Phẩm
                  </button>
                </div>
              </div>

            </div>
            {/* Table */}
            <div className="border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="align-middle text-center" style={{ width: '5%' }}>#</th>
                      <th className="align-middle text-center" style={{ width: '25%' }}>SẢN PHẨM</th>
                      <th className="align-middle text-center" style={{ width: '10%' }}>GIÁ</th>
                      <th className="align-middle text-center" style={{ width: '10%' }}>GIÁ KM</th>
                      <th className="align-middle text-center" style={{ width: '15%' }}>DANH MỤC</th>
                      <th className="align-middle text-center" style={{ width: '12%' }}>NGÀY TẠO</th>
                      <th className="align-middle text-center" style={{ width: '8%' }}>TRẠNG THÁI</th>
                      <th className="align-middle text-center" style={{ width: '18%' }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="align-middle text-center">
                          {(searchDto.page - 1) * PAGE_SIZE + idx + 1}
                        </td>

                        <td className="align-middle text-start">
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-m">
                              <img
                                className="rounded-circle"
                                src={buildImg(p.image)}
                                alt="Product"
                                onError={e => {
                                  const t = e.currentTarget as HTMLImageElement;
                                  t.onerror = null;
                                  t.src = defaultPersonImage;
                                }}
                              />
                            </div>
                            <p className="mb-0 ms-3 text-1100 fw-bold">{p.productName}</p>
                          </div>
                        </td>

                        <td className="align-middle text-center">{p.price?.toLocaleString?.('vi-VN')}</td>
                        <td className="align-middle text-center">{p.salePrice?.toLocaleString?.('vi-VN')}</td>
                        <td className="align-middle text-center">{p.category?.categoryName ?? ''}</td>
                        <td className="align-middle text-center">{formatDate(p.createdAt)}</td>

                        <td className="align-middle text-center">
                          <span
                            className={
                              p.active
                                ? 'badge badge-phoenix fs--2 badge-phoenix-success'
                                : 'badge badge-phoenix fs--2 badge-phoenix-danger'
                            }
                          >
                            <span className="badge-label">
                              {p.active ? 'Đang hoạt động' : 'Không hoạt động'}
                            </span>
                          </span>
                        </td>

                        <td className="align-middle text-center">
                          <button className="btn btn-phoenix-primary me-1 mb-1" onClick={() => info(p)}>
                            <i className="far fa-eye"></i>
                          </button>
                          <button className="btn btn-phoenix-primary me-1 mb-1" onClick={() => editProduct(p)}>
                            <i className="fa-solid fa-pen">abc</i>
                          </button>
                          <button className="btn btn-phoenix-danger me-1 mb-1" onClick={() => delProduct(p.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                <div className="col-auto d-flex">
                  <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900">
                    <span className="fw-bold">Tổng số sản phẩm: </span>
                    {totalItems}
                  </p>
                </div>
                <div className="col-auto d-flex">
                  <Pagination
                    totalPage={totalPages}
                    currentPage={searchDto.page}
                    handlePageClick={handlePageClick}
                    prev={prev}
                    next={next}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <AddProductForm
            hideForm={(refresh) => {
              setShowForm(false);
              if (refresh) triggerReload();
            }}
            productDTO={productRef.current}
            onSave={triggerReload}
          />
        )}

        <Dialog baseZIndex={2000} style={{ width: "1200px" }} visible={openDetail} onHide={handleClickCloseDetail}>
          <ProductInfo
            info={productRef.current}
            onRefresh={triggerReload}
            closeDetail={handleClickCloseDetail}
          />
        </Dialog>
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
    </div>

  );
}
