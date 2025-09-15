import React, { useEffect, useRef, useState } from 'react'
import { BookSearch } from './book-search'
import Swal from 'sweetalert2';
import axios from 'axios';
import AddBook from './AddBook';
import { Dialog } from 'primereact/dialog';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from '../../comp/common/Pagination';
import { format } from 'date-fns';
import { formatCurrency, formatDate } from "../../utils/FunctionUtils";
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';

export default function Book() {

  const [searchDto, setSearchDto] = useState(new BookSearch('', 1, 0, new Date().getTime()))
  const [bookList, setBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const bookRef = useRef<any>();
  const visible = useRef<any>(true);
  const dispatch = useAppDispatch();

  //phân trang
  const handlePageClick = (pageNumber: any) => {
    setSearchDto(() => ({
      ...searchDto,
      page: pageNumber,
    }));
  };

  const prev = () => {
    if (searchDto.page > 1) {
      setSearchDto(() => ({
        ...searchDto,
        page: searchDto.page - 1,
      }));
    }
  };
  const next = () => {
    if (searchDto.page < totalPages) {
      setSearchDto(() => ({
        ...searchDto,
        page: searchDto.page + 1,
      }));
    }
  };

  // xử lý khi chữ thay đổi
  const handleChangeText = (event: any) => {
    setSearchDto({
      ...searchDto,
      [event.target.name]: event.target.value
    });
  }

  //
  const handleKeyUpSearch = (e: any) => {
    if (e.key === "Enter") {
      setSearchDto({
        ...searchDto,
        timer: new Date().getTime(),
      });
    }
  };

  // Thêm sách
  const addBook = () => {
    bookRef.current = null;
    setShowForm(true);
  }

  // edit
  const editBook = (bookDTO: any) => {
    bookRef.current = bookDTO;
    setShowForm(true);
  }

  //delete
  //xóa
  const delBook = (id: number) => {
    Swal.fire({
      title: `Xác nhận`,
      text: `Bạn có muốn thực hiện ...`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#89B449',
      cancelButtonColor: '#E68A8C',
      confirmButtonText: `Yes`,
      cancelButtonText: `No`
    }).then((result) => {
      if (result.value) {
        dispatch(setLoading(true));
        let url = `${process.env.REACT_APP_API_URL}/book/delete?id=${id}`;
        axios.delete(url).then((resp: any) => {
          dispatch(setLoading(false));
          toast.success("Đã xóa");
          setSearchDto({
            ...searchDto,
            timer: new Date().getTime()
          })
        }).catch((err: any) => {
          dispatch(setLoading(false));
          // console.log(err);
          toast.error("Xóa thất bại");
        })
      }
    })
  }

  //Lây du lieu
  useEffect(() => {
    let url = `${process.env.REACT_APP_API_URL}/book/list?page=${searchDto.page}&keySearch=${searchDto.keySearch}&cateId=${searchDto.cate_id}`;
    axios.get(url).then((resp: any) => {
      console.log(resp.data);
      if (resp.data) {
        setBookList(resp.data.content);
        setTotalPages(resp.data.totalPages);
        setTotalItems(resp.data.totalElements);
        // console.log(bookList);
      }
    }).catch((err: any) => {

    })
  }, [searchDto.page, searchDto.timer])

  useEffect(() => {
    let url = `${process.env.REACT_APP_API_URL}/category/list?page=1&keySearch=`;
    axios.get(url).then((resp: any) => {
      console.log("Test cate");
      console.log(resp.data);
      if (resp.data) {
        setCategoryList(resp.data.content);
      }
    }).catch((err: any) => {

    })
  }, [])

  // Ẩn hiện form 
  const hideForm = (isCRUD: boolean) => {
    setShowForm(false);
    if (isCRUD) {
      setSearchDto({
        ...searchDto,
        page: 1,
        timer: new Date().getTime()
      })
    }
  }


  return (
    <div>
      <div className="mb-9">
        <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
          <div className="row g-2 mb-4">
            <div className="col-auto">
              {/* title */}
              <h2 className="mt-4">Danh sách Sách</h2>
            </div>
          </div>
          <div id="products" data-list="{&quot;valueNames&quot;:[&quot;customer&quot;,&quot;email&quot;,&quot;total-orders&quot;,&quot;total-spent&quot;,&quot;city&quot;,&quot;last-seen&quot;,&quot;last-order&quot;],&quot;page&quot;:10,&quot;pagination&quot;:true}">
            <div className="">
              <div className="row g-3">
                <div className="col-auto">
                  {/* Search input-------------------------------------------------------------------------------------------- */}
                  <div className="search-box d-flex">
                    {/* search input */}
                    <input className="form-control search-input search" type="search" placeholder="Tìm kiếm sách" name="keySearch" aria-label="Search"
                      value={searchDto.keySearch || ""}
                      onChange={handleChangeText}
                      onKeyUp={handleKeyUpSearch}
                    />
                    <button className='btn btn-primary' onClick={() => {
                      setSearchDto({
                        ...searchDto,
                        page: 1,
                        timer: new Date().getTime(),
                      });
                    }}><span className="fas fa-search " /></button>
                  </div>
                </div>
                <div className="col-auto scrollbar overflow-hidden-y flex-grow-1">
                  <div className="btn-group position-static" role="group">
                    {/*------------------------Lọc theo category  */}
                    <div>
                      <select
                        style={{
                          backgroundColor: '#f0f0f0', /* Màu nền xám sáng */
                          border: '1px solid #ccc', /* Viền xám sáng */
                        }}
                        className="form-select"
                        value={searchDto.cate_id}
                        onChange={(e) => {
                          setSearchDto({
                            ...searchDto,
                            cate_id: parseInt(e.target.value, 10),
                            page: 1,
                            timer: new Date().getTime(),
                          });
                        }}
                      >
                        <option value={0}>Tất cả</option>
                        {categoryList && categoryList.map((u: any, index: number) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <button className="btn btn-primary" onClick={addBook}><span className="fas fa-plus me-2" />Thêm sách</button>
                </div>
              </div>
            </div>
            <div className=" border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '3%' }}>#</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '11%' }}>TIÊU ĐỀ</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '13%' }}>TÁC GIẢ</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>NĂM XUẤT BẢN</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>SỐ LƯỢNG</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '6%' }}>GIÁ</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '14%' }}>Nhà xuất bản</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>NGÀY TẠO</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>NGÀY CẬP NHẬT</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '5%' }}>TRẠNG THÁI</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '20%' }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody className="list" id="customers-table-body">
                    {bookList.map((u: any, index: number) => {
                      return <tr className="hover-actions-trigger btn-reveal-trigger position-static" key={u.id}>
                        <td className='align-middle text-center text-700'>{index + 1}</td>
                        <td className="align-middle text-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-m">
                              <img className="rounded-circle" src={u.image ? `${process.env.REACT_APP_API_URL}/getImage?atchFleSeqNm=${u.image}` : defaultPersonImage} alt="PersonAvatar" onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop in case fallback image also fails
                                target.src = noImageAvailable; // Set the fallback image
                              }} />
                            </div>
                            <p className="mb-0 ms-3 text-1100 fw-bold">{u.title}</p>
                          </div>
                        </td>
                        <td className="align-middle text-center">{u.publisher}</td>
                        <td className="align-middle text-center text-1000">{u.publicationYear}</td>
                        <td className="align-middle text-center text-1100">{u.quantity}</td>
                        <td className="align-middle text-start text-700">{formatCurrency(u.price)}</td>
                        {/* <td className="align-middle text-center text-1100" dangerouslySetInnerHTML={{ __html: u.description }} /> */}
                        {/* <td className="total-orders align-middle white-space-nowrap fw-semi-bold  text-start text-1000"  dangerouslySetInnerHTML={{ __html: u.description }}/> */}
                        <td className="align-middle text-center text-1100">{u.nxb}</td>
                        <td className="align-middle text-center text-700">{formatDate(u.cre_dt)}</td>
                        <td className="align-middle text-center text-700">{formatDate(u.upd_dt)}</td>
                        <td className="align-middle text-center">
                          <span className={u.active ? 'badge badge-phoenix fs--2 badge-phoenix-success' : 'badge badge-phoenix fs--2 badge-phoenix-danger'}>
                            <span className="badge-label">{u.active ? "Hoạt động" : "Không hoạt động"}</span>
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          {/* <button className="btn btn-phoenix-secondary me-1 mb-1" type="button" onClick={() => info(u)}>
                            <i className="far fa-eye"></i>
                          </button> */}
                          <button className="btn btn-phoenix-primary me-1 mb-1" type="button" onClick={() => editBook(u)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => delBook(u.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
              <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                <div className="col-auto d-flex">
                  <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"><span className='fw-bold'>Tổng số sách: </span> {totalItems} </p>
                </div>
                <div className="col-auto d-flex">
                  <Pagination totalPage={totalPages} currentPage={searchDto.page} handlePageClick={handlePageClick} prev={prev} next={next} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {showForm && <AddBook hideForm={hideForm} bookDTO={bookRef.current} onSave={() => {
            setSearchDto((prev) => ({
              ...prev,
              timer: new Date().getTime(),
            }));
          }} />}
        </div>
      </div>

      <footer className="footer position-absolute">
        <div className="row g-0 justify-content-between align-items-center h-100">
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 mt-2 mt-sm-0 text-900">ATWOM BOOk<span className="d-none d-sm-inline-block" /><span className="d-none d-sm-inline-block mx-1">|</span><br className="d-sm-none" />2024 ©</p>
          </div>
          <div className="col-12 col-sm-auto text-center">
            <p className="mb-0 text-600">v1.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
