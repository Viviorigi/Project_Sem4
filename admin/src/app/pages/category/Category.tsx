import React, { useEffect, useRef, useState } from 'react';
import { CategorySearch } from './category-search';
import Swal from 'sweetalert2';
import axios from 'axios';
import AddCategory from './AddCategory';
import { toast } from 'react-toastify';
import Pagination from '../../comp/common/Pagination';
import { formatDate } from "../../utils/FunctionUtils";
import "../../../assets/css/category/cate.scss";
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { HeadersUtil } from '../../utils/Headers.Util';
import { Dialog } from 'primereact/dialog';
import CategoryInfo from './CategoryInfo';

type CategoryItem = {
  id: number;
  categoryName: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function Book() {
  const [searchDto, setSearchDto] = useState(new CategorySearch('', 1, 0, Date.now()));
  const [list, setList] = useState<CategoryItem[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const categoryRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const [sortBy, setSortBy] = useState("CreatedAt");  // default
  const [sortDir, setSortDir] = useState("desc");
  const [openDetail, setOpenDetail] = useState(false);
  const handleClickCloseDetail = () => setOpenDetail(false);

  const PAGE_SIZE = 5;
  const indexOfFirstItem = (searchDto.page - 1) * PAGE_SIZE;

  // phân trang
  const handlePageClick = (pageNumber: number) => {
    setSearchDto(prev => ({ ...prev, page: pageNumber }));
  };
  const prev = () => {
    if (searchDto.page > 1)
      setSearchDto(prev => ({ ...prev, page: prev.page - 1 }));
  };
  const next = () => {
    if (searchDto.page < totalPages)
      setSearchDto(prev => ({ ...prev, page: prev.page + 1 }));
  };

  // tìm kiếm
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchDto(prev => ({ ...prev, [name]: value }));
  };
  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchDto(prev => ({ ...prev, page: 1, timer: Date.now() }));
    }
  };

  // thêm/sửa
  const addCategory = () => { categoryRef.current = null; setShowForm(true); };
  const editCategory = (row: CategoryItem) => { categoryRef.current = row; setShowForm(true); };
  const info = (row: CategoryItem) => {
    categoryRef.current = row;
    setOpenDetail(true);
  };


  // xóa
  const delCategory = (id: number) => {
    Swal.fire({
      title: `Xác nhận`,
      text: `Bạn có muốn xóa danh mục này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#89B449',
      cancelButtonColor: '#E68A8C',
      confirmButtonText: `Yes`,
      cancelButtonText: `No`
    }).then(async (res) => {
      if (!res.value) return;
      try {
        dispatch(setLoading(true));
        const url = `${process.env.REACT_APP_API_URL}/api/Category/${id}`;
        await axios.delete(url, { headers: HeadersUtil.getHeadersAuth() });
        toast.success("Đã xóa");
        setSearchDto(prev => ({ ...prev, timer: Date.now() }));
      } catch {
        toast.error("Xóa thất bại");
      } finally {
        dispatch(setLoading(false));
      }
    })
  }

  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/Category/search`;
        const body = {
          pageNumber: searchDto.page,
          pageSize: PAGE_SIZE,
          keyword: searchDto.keySearch || "",
          status: "",       // dùng state filter status
          sortBy: sortBy,       // state sortBy
          sortDir: sortDir,
        };
        const resp = await axios.post(url, body, { headers: HeadersUtil.getHeadersAuth() });
        const r = resp.data;

        // map theo response mới
        setList((r?.data ?? []) as CategoryItem[]);
        setTotalItems(r?.totalRecords ?? 0);
        const pages = Math.max(1, Math.ceil((r?.totalRecords ?? 0) / (r?.pageSize ?? PAGE_SIZE)));
        setTotalPages(pages);
      } catch (err) {
        console.error("Search category error:", err);
      }
    };
    fetchData();
  }, [searchDto.page, searchDto.timer, searchDto.keySearch]);

  // Ẩn/hiện form
  const hideForm = (refresh?: boolean) => {
    setShowForm(false);
    if (refresh) {
      setSearchDto(prev => ({ ...prev, page: 1, timer: Date.now() }));
    }
  };

  return (
    <div>
      <div className="mb-9">
        <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh Sách Danh Mục</h2>
            </div>
          </div>

          <div id="products">
            <div className="row g-3">
              <div className="col-auto">
                <div className="search-box d-flex">
                  <input
                    className="form-control search-input search"
                    type="search"
                    placeholder="Tìm kiếm danh mục"
                    name="keySearch"
                    value={searchDto.keySearch || ""}
                    onChange={handleChangeText}
                    onKeyUp={handleKeyUpSearch}
                  />
                  <button
                    className='btn btn-primary'
                    onClick={() => setSearchDto(prev => ({ ...prev, page: 1, timer: Date.now() }))}
                  >
                    <span className="fas fa-search " />
                  </button>
                </div>
              </div>

              <div className="col-auto">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setSearchDto(prev => ({
                      ...prev,
                      page: 1,
                      timer: Date.now()
                    }));
                  }}
                >
                  <option value="CreatedAt">Ngày tạo</option>
                  <option value="CategoryName">Tên danh mục</option>
                </select>
              </div>

              <div className="col-auto">
                <select
                  className="form-select"
                  value={sortDir}
                  onChange={(e) => {
                    setSortDir(e.target.value);
                    setSearchDto(prev => ({
                      ...prev,
                      page: 1,
                      timer: Date.now()
                    }));
                  }}
                >
                  <option value="ASC">Tăng dần</option>
                  <option value="DESC">Giảm dần</option>
                </select>
              </div>


              <div className="col-auto scrollbar overflow-hidden-y flex-grow-1" />
              <div className="col-auto scrollbar overflow-hidden-y flex-grow">
                <div className="col-auto">
                  <button className="btn btn-primary" onClick={addCategory}>
                    <span className="fas fa-plus me-2" />
                    Thêm Danh Mục
                  </button>
                </div>

              </div>
            </div>



            <div className="border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="align-middle text-center" style={{ width: '6%' }}>#</th>
                      <th className="align-middle text-center" style={{ width: '30%' }}>DANH MỤC</th>
                      <th className="align-middle text-center" style={{ width: '25%' }}>NGÀY TẠO</th>
                      {/* <th className="align-middle text-center" style={{ width: '18%' }}>NGÀY CẬP NHẬT</th> */}
                      <th className="align-middle text-center" style={{ width: '10%' }}>TRẠNG THÁI</th>
                      <th className="align-middle text-center" style={{ width: '20%' }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>

                  <tbody className="list" id="customers-table-body">
                    {list.map((c, idx) => (
                      <tr className="hover-actions-trigger btn-reveal-trigger position-static" key={c.id}>
                        <td className='align-middle text-center text-700'>
                          {indexOfFirstItem + idx + 1}
                        </td>

                        <td className="align-middle text-center">
                          <div className="d-flex justify-content-center">
                            <p className="mb-0 text-1100 fw-bold">{c.categoryName}</p>
                          </div>
                        </td>

                        <td className="align-middle text-center text-700">{formatDate(c.createdAt)}</td>
                        {/* <td className="align-middle text-center text-700">{formatDate(u.updatedAt)}</td> */}

                        <td className="align-middle text-center">
                          <span className={c.active ? 'badge badge-phoenix fs--2 badge-phoenix-success' : 'badge badge-phoenix fs--2 badge-phoenix-danger'}>
                            <span className="badge-label">{c.active ? "Đang hoạt động" : "Không hoạt động"}</span>
                          </span>
                        </td>

                        <td className="align-middle text-center">
                             <button className="btn btn-phoenix-primary me-1 mb-1" onClick={() => info(c)}>
                            <i className="far fa-eye"></i>
                          </button>
                          <button className="btn btn-phoenix-primary me-1 mb-1" type="button" onClick={() => editCategory(c)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => delCategory(c.id)}>
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
                    <span className='fw-bold'>Tổng số danh mục: </span> {totalItems}
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
          <AddCategory
            hideForm={hideForm}
            categoryDTO={categoryRef.current}
            onSave={() => setSearchDto(prev => ({ ...prev, timer: Date.now() }))}
          />
        )}

        <Dialog baseZIndex={2000} style={{ width: "1200px" }} visible={openDetail} onHide={handleClickCloseDetail}>
          <CategoryInfo
            info={categoryRef.current}
            onRefresh={() => setSearchDto(prev => ({ ...prev, timer: Date.now() }))}
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
