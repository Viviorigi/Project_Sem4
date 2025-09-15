import React, { useEffect, useRef, useState } from 'react'
import { UserSearchParams } from '../../model/auth/UserSearchParams';
import { AuthService } from '../../services/auth/AuthService';
import { format } from 'date-fns';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { Dialog } from 'primereact/dialog';
import Pagination from '../../comp/common/Pagination';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import JoditEditor from '../../comp/JoditEditor';
import { AboutService } from '../../services/about/AboutService';
import AboutForm from './AboutForm';

export default function About() {
  const [listAbout, setListAbout] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [userSearchParams, setUserSearchParams] = useState<UserSearchParams>(
    new UserSearchParams("", 1, 5, new Date().getTime())
  );
  const dispatch = useAppDispatch();
  const indexOfLastItem = userSearchParams.page * userSearchParams.limit;
  const indexOfFirstItem = indexOfLastItem - userSearchParams.limit;
  const aboutRef = useRef<any>();
  const handleClickClose = () => {
    setOpen(false);
  };
  const handleClickCloseDetail = () => {
    setOpenDetail(false);
  };

  const formatDOB = (date: any) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  const formatDate = (date: any) => {
    return format(new Date(date), 'dd/MM/yyyy, hh:mm');
  };

  const prev = () => {
    if (userSearchParams.page > 1) {
      setUserSearchParams(() => ({
        ...userSearchParams,
        page: userSearchParams.page - 1,
      }));
    }
  };
  const next = () => {
    if (userSearchParams.page < totalPage) {
      setUserSearchParams(() => ({
        ...userSearchParams,
        page: userSearchParams.page + 1,
      }));
    }
  };
  const handlePageClick = (pageNumber: any) => {
    setUserSearchParams(() => ({
      ...userSearchParams,
      page: pageNumber,
    }));
  };
  const handleChangeSearch = (event: any) => {
    setUserSearchParams({
      ...userSearchParams,
      [event.target.name]: event.target.value,
      page: 1
    });
  };
  const handleKeyUpSearch = (e: any) => {
    if (e.key === "Enter") {
      setUserSearchParams({
        ...userSearchParams,
        timer: new Date().getTime(),
      });
    }
  };
  useEffect(() => {
    // dispatch(setLoading(true));
    AboutService.getInstance()
      .getList({
        keySearch: userSearchParams.keySearch,
        limit: userSearchParams.limit,
        page: userSearchParams.page,
      })
      .then((resp: any) => {
        // dispatch(setLoading(false));
        if (resp.status === 200) {
          setListAbout(resp.data.abouts);
          setTotalUsers(resp.data.totalUsers);
          setTotalPage(resp.data.totalPages);
        }
      })
      .catch((err: any) => {
        console.error(err);
      })
  }, [userSearchParams.timer, userSearchParams.page]);
  
  const addStudent = () => {
    aboutRef.current = null;
    setOpen(true);
  };

  const editUser = (u: any) => {
    aboutRef.current = u;
    setOpen(true);
  };
  const info = (u: any) => {
    aboutRef.current = u;
    setOpenDetail(true);
  };

  const deleteUser = (c_id: number) => {
    Swal.fire({
      title: `Confirm`,
      text: `Xóa about này`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        dispatch(setLoading(true));
        AboutService.getInstance()
          .delete({ id: c_id })
          .then((resp: any) => {
            dispatch(setLoading(false));
            setUserSearchParams({
              ...userSearchParams,
              timer: new Date().getTime(),
            });
            toast.success(resp.data.message);
          })
          .catch((err: any) => {
            dispatch(setLoading(false));
            toast.error(err.message);
          });
      }
    });
  };


  return (
    <div>
      <div className="mb-9">
        <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh sách About</h2>
            </div>
          </div>
          <div id="products" data-list="{&quot;valueNames&quot;:[&quot;customer&quot;,&quot;email&quot;,&quot;total-orders&quot;,&quot;total-spent&quot;,&quot;city&quot;,&quot;last-seen&quot;,&quot;last-order&quot;],&quot;page&quot;:10,&quot;pagination&quot;:true}">
            <div className="">
              <div className="row g-3">
                <div className="col-auto">
                  <div className="search-box d-flex">
                    {/* search input */}
                    <input className="form-control search-input search" type="search" placeholder="Search students" name="keySearch" aria-label="Search"
                      value={userSearchParams.keySearch || ""}
                      onChange={handleChangeSearch}
                      onKeyUp={handleKeyUpSearch} />
                    <button className='btn btn-primary' onClick={() => {
                      setUserSearchParams({
                        ...userSearchParams,
                        timer: new Date().getTime(),
                      });
                    }}><span className="fas fa-search " /></button>
                  </div>
                </div>
                <div className="col-auto scrollbar overflow-hidden-y flex-grow-1"></div>
                <div className="col-auto scrollbar overflow-hidden-y flex-grow">
                  <div className="col-auto">
                    <button className="btn btn-primary" onClick={addStudent}>
                      <span className="fas fa-plus me-2" />Khởi tạo about
                    </button></div>
                </div>
              </div>
            </div>
            <div className=" border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '2%' }}>#</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '5%' }}>Câu hỏi</th>
                      <th className="sort align-middle text-end" scope="col" style={{ width: '20%' }}>Trả lời</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>Ngày tạo</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>Ngày cập nhật</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '12%' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="list" id="customers-table-body">
                    {listAbout.map((u: any, index: number) => {
                      return <tr className="hover-actions-trigger btn-reveal-trigger position-static" key={u.about_id} >
                        <td className='align-middle white-space-nowrap  text-700 text-end pe-3'>{indexOfFirstItem + index + 1}</td>
                        <td className="email align-middle white-space-nowrap ps-3">{u.question}</td>
                        <td className="total-orders align-middle white-space-nowrap fw-semi-bold  text-end text-1000" dangerouslySetInnerHTML={{ __html: u.answer }}/>
                        <td className="last-order align-middle white-space-nowrap text-700 text-end">{formatDate(u.cre_dt)}</td>
                        <td className="last-order align-middle white-space-nowrap text-700 text-end">{formatDate(u.upd_dt)}</td>
                        <td className="last-order align-middle white-space-nowrap text-700 text-center ">
                          <button className="btn btn-phoenix-secondary me-1 mb-1" type="button" onClick={() => info(u)}><i className="far fa-eye"></i></button>
                          <button className="btn btn-phoenix-primary me-1 mb-1" type="button" onClick={() => editUser(u)}><i className="fa-solid fa-pen"></i></button>
                          <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => deleteUser(u.about_id)}><i className="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    })}

                  </tbody>
                </table>
              </div>
              <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                <div className="col-auto d-flex">
                  <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"><span className='fw-bold'>Tổng số about: </span>  {totalUsers} </p>
                </div>
                <div className="col-auto d-flex">
                  <Pagination totalPage={totalPage} currentPage={userSearchParams.page} handlePageClick={handlePageClick} prev={prev} next={next} />
                </div>
              </div>
            </div>
            <Dialog
              baseZIndex={2000}
              style={{ width: "1150px" }}
              visible={open}
              onHide={() => handleClickClose()}
            >
              <AboutForm
                about={aboutRef.current}
                closeForm={handleClickClose}
                onSave={() => {
                  setUserSearchParams((prev) => ({
                    ...prev,
                    timer: new Date().getTime(),
                  }));
                }}
              />
            </Dialog>
            <Dialog
              baseZIndex={2000}
              style={{ width: "1200px" }}
              visible={openDetail}
              onHide={() => handleClickCloseDetail()}
            >
              {/* <InfoStudent info={userRef.current} setUserSearchParams={setUserSearchParams} closeDetail={handleClickCloseDetail} /> */}
            </Dialog>

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

    </div>
  )
}
