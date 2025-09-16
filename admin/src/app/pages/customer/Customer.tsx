import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns';
import { useAppDispatch } from '../../store/hook';
import { setLoading } from '../../reducers/spinnerSlice';
import { Dialog } from 'primereact/dialog';
import CustomerForm from './CustomerForm';
import Pagination from '../../comp/common/Pagination';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
import InfoStudent from './InfoCustomer';
import { AuthService } from '../../services/auth/AuthService';
import { CustomerSearch } from '../../model/auth/CustomerSearch';

type ApiUser = {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  createdAt: string | null;
  lockoutEnd: string | null;
  // ... các field khác nếu cần
};

type ApiResponse = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: ApiUser[];
};

export default function Customer() {
  const [listUser, setListUser] = useState<ApiUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [userSearchParams, setUserSearchParams] = useState<CustomerSearch>(
    new CustomerSearch("", 1, 5, Date.now(), "", "CreatedAt", "DESC", "")
  );

  const dispatch = useAppDispatch();
  const indexOfLastItem = userSearchParams.pageNumber * userSearchParams.pageSize;
  const indexOfFirstItem = indexOfLastItem - userSearchParams.pageSize;
  const userRef = useRef<any>();

  const handleClickClose = () => setOpen(false);
  const handleClickCloseDetail = () => setOpenDetail(false);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return 'N/A';
    }
  };

  const prev = () => {
    if (userSearchParams.pageNumber > 1) {
      setUserSearchParams(prev => ({
        ...prev,
        pageNumber: prev.pageNumber - 1,
        timer: new Date().getTime(), // để kích useEffect gọi API
      }));
    }
  };

  const next = () => {
    if (userSearchParams.pageNumber < totalPage) {
      setUserSearchParams(prev => ({
        ...prev,
        pageNumber: prev.pageNumber + 1, // FIX: đúng key
        timer: new Date().getTime(),
      }));
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setUserSearchParams(prev => ({
      ...prev,
      pageNumber, // FIX: đúng key
      timer: new Date().getTime(),
    }));
  };

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchParams(prev => ({
      ...prev,
      // FIX: input name phải là "keyword"
      [event.target.name]: event.target.value,
      pageNumber: 1
    }) as any);
  };

  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setUserSearchParams(prev => ({
        ...prev,
        timer: new Date().getTime(),
      }));
    }
  };

  useEffect(() => {
    AuthService.getInstance()
      .getList({
        keyword: userSearchParams.keyword,
        pageNumber: userSearchParams.pageNumber,
        pageSize: userSearchParams.pageSize,
        status: userSearchParams.status,
        sortBy: userSearchParams.sortBy,
        sortDir: userSearchParams.sortDir,
        roleId: userSearchParams.roleId,
      })
      .then((resp: any) => {
        if (resp.status === 200) {
          const data: ApiResponse = resp.data;
          setListUser(data.data);
          setTotalUsers(data.totalRecords);

          const pages = Math.max(1, Math.ceil((data.totalRecords ?? 0) / (data.pageSize || userSearchParams.pageSize || 1)));
          setTotalPage(pages);
        }
      })
      .catch((err: any) => {
        console.error(err);
      })
  }, [userSearchParams.timer, userSearchParams.pageNumber, userSearchParams.pageSize, userSearchParams.keyword]);

  const addUser = () => {
    userRef.current = null;
    setOpen(true);
  };

  const editUser = (u: ApiUser) => {
    userRef.current = u;
    setOpen(true);
  };

  const info = (u: ApiUser) => {
    userRef.current = u;
    setOpenDetail(true);
  };

  const deleteUser = (id: string) => { // FIX: id là GUID string
    Swal.fire({
      title: `Confirm`,
      text: `Bạn có muốn xóa sinh viên này`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: `Có`,
      cancelButtonText: `Không`,
    }).then((result) => {
      if (result.value) {
        dispatch(setLoading(true));
        AuthService.getInstance()
          .delete(id)
          .then((resp: any) => {
            dispatch(setLoading(false));
            setUserSearchParams(prev => ({
              ...prev,
              timer: new Date().getTime(),
            }));
            toast.success(resp.data.message ?? "Đã xóa");
          })
          .catch((err: any) => {
            dispatch(setLoading(false));
            toast.error(err.message ?? "Xóa thất bại");
          });
      }
    });
  };

  // xác định trạng thái từ Identity fields
  const getStatus = (u: ApiUser) => {
    // lockoutEnd != null coi như Locked, ngược lại Active
    const isLocked = !!u.lockoutEnd;
    return isLocked ? { label: 'Locked', className: 'badge-phoenix-danger' }
      : { label: 'Active', className: 'badge-phoenix-success' };
  };

  return (
    <div>
      <div className="mb-9">
        <div className='card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white'>
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh sách Khách hàng</h2>
            </div>
          </div>

          <div id="products">
            <div className="">
              <div className="row g-3">
                <div className="col-auto">
                  <div className="search-box d-flex">
                    {/* FIX: name="keyword" để map đúng */}
                    <input
                      className="form-control search-input search"
                      type="search"
                      placeholder="Tìm kiếm khách hàng"
                      name="keyword"
                      aria-label="Search"
                      value={userSearchParams.keyword || ""}
                      onChange={handleChangeSearch}
                      onKeyUp={handleKeyUpSearch}
                    />
                    <button
                      className='btn btn-primary'
                      onClick={() => {
                        setUserSearchParams(prev => ({
                          ...prev,
                          timer: new Date().getTime(),
                        }));
                      }}>
                      <span className="fas fa-search " />
                    </button>
                  </div>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select"
                    value={userSearchParams.sortBy}
                    onChange={(e) =>
                      setUserSearchParams(prev => ({
                        ...prev,
                        sortBy: e.target.value,   // "CreatedAt" | "UserName" | "Email" (phụ thuộc backend)
                        pageNumber: 1,
                        timer: Date.now(),
                      }))
                    }
                  >
                    <option value="CreatedAt">Sắp xếp: Ngày tạo</option>
                    <option value="UserName">Tài khoản</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                {/* Sort dir */}
                <div className="col-auto">
                  <select
                    className="form-select"
                    value={userSearchParams.sortDir}
                    onChange={(e) =>
                      setUserSearchParams(prev => ({
                        ...prev,
                        sortDir: e.target.value as "ASC" | "DESC",
                        pageNumber: 1,
                        timer: Date.now(),
                      }))
                    }
                  >
                    <option value="DESC">Giảm dần</option>
                    <option value="ASC">Tăng dần</option>
                  </select>
                </div>

                <div className="col-auto scrollbar overflow-hidden-y flex-grow-1" />
                <div className="col-auto scrollbar overflow-hidden-y flex-grow">
                  <div className="col-auto">
                    <button className="btn btn-primary" onClick={addUser}>
                      <span className="fas fa-plus me-2" />
                      Tạo mới khách hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className=" border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="align-middle text-center" style={{ width: '4%' }}>#</th>
                      <th className="align-middle text-center" style={{ width: '20%' }}>Khách Hàng</th>
                      <th className="align-middle text-center" style={{ width: '20%' }}>EMAIL</th>
                      <th className="align-middle text-center" style={{ width: '12%' }}>SĐT</th>
                      <th className="align-middle text-center" style={{ width: '15%' }}>Địa chỉ</th>
                      <th className="align-middle text-center" style={{ width: '12%' }}>Ngày tạo</th>
                      <th className="align-middle text-center" style={{ width: '7%' }}>Trạng Thái</th>
                      <th className="align-middle text-center" style={{ width: '10%' }}>Hành động</th>
                    </tr>
                  </thead>

                  <tbody className="list" id="customers-table-body">
                    {listUser.map((u, index) => {
                      const status = getStatus(u);
                      const displayName = u.userName || u.email || 'N/A';
                      const emailText = u.email || 'N/A';
                      const phoneText = u.phoneNumber || 'N/A';
                      const addressText = u.address || 'N/A';

                      return (
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static" key={u.id}>
                          {/* # */}
                          <td className="align-middle white-space-nowrap text-700 text-end pe-3">
                            {indexOfFirstItem + index + 1}
                          </td>

                          {/* Khách hàng (avatar + tên) */}
                          <td className="customer align-middle pe-5">
                            <div className="d-flex align-items-center text-1100">
                              <div className="avatar avatar-m">
                                <img
                                  className="rounded-circle"
                                  src={
                                    u.avatar
                                      ? `${process.env.REACT_APP_API_URL}/api/Account/getImage/${u.avatar}`
                                      : defaultPersonImage
                                  }
                                  alt="Avatar"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = defaultPersonImage;
                                  }}
                                />
                              </div>
                              <p className="mb-0 ms-3 text-1100 fw-bold text-truncate" style={{ maxWidth: 220 }} title={displayName}>
                                {displayName}
                              </p>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="email align-middle ps-3">
                            {u.email ? (
                              <a
                                href={`mailto:${u.email}`}
                                className="text-decoration-none text-1100 text-truncate d-inline-block"
                                style={{ maxWidth: 240 }}
                                title={emailText}
                              >
                                {emailText}
                              </a>
                            ) : (
                              <span className="text-700">N/A</span>
                            )}
                          </td>

                          {/* SĐT */}
                          <td className="align-middle text-center fw-bold text-1100">
                            {phoneText}
                          </td>

                          {/* Địa chỉ */}
                          <td className="align-middle ps-3">
                            <span
                              className="text-700 d-inline-block text-truncate"
                              style={{ maxWidth: 260 }}
                              title={addressText}
                            >
                              {addressText}
                            </span>
                          </td>

                          {/* Ngày tạo */}
                          <td className="align-middle text-center text-700">
                            {formatDate(u.createdAt)}
                          </td>

                          {/* Trạng thái */}
                          <td className="align-middle text-center">
                            <span className={`badge badge-phoenix fs--2 ${status.className}`}>
                              <span className="badge-label">{status.label}</span>
                            </span>
                          </td>

                          {/* Hành động */}
                          <td className="align-middle text-center">
                            <div className="btn-group" role="group" aria-label="Actions">
                              <button
                                className="btn btn-phoenix-secondary me-1 mb-1"
                                type="button"
                                onClick={() => info(u)}
                                title="Xem chi tiết"
                              >
                                <i className="far fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-phoenix-primary me-1 mb-1"
                                type="button"
                                onClick={() => editUser(u)}
                                title="Chỉnh sửa"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                className="btn btn-phoenix-danger me-1 mb-1"
                                type="button"
                                onClick={() => deleteUser(u.id)}
                                title="Xóa"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>

              <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                <div className="col-auto d-flex">
                  <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900">
                    <span className='fw-bold'>Tổng số khách hàng: </span> {totalUsers}
                  </p>
                </div>
                <div className="col-auto d-flex">
                  <Pagination
                    totalPage={totalPage}
                    currentPage={userSearchParams.pageNumber}
                    handlePageClick={handlePageClick}
                    prev={prev}
                    next={next}
                  />
                </div>
              </div>
            </div>

            <Dialog baseZIndex={2000} style={{ width: "1150px" }} visible={open} onHide={handleClickClose}>
              <CustomerForm
                user={userRef.current}
                closeForm={handleClickClose}
                onSave={() => {
                  setUserSearchParams(prev => ({ ...prev, timer: new Date().getTime() }));
                }}
              />
            </Dialog>

            <Dialog baseZIndex={2000} style={{ width: "1200px" }} visible={openDetail} onHide={handleClickCloseDetail}>
              <InfoStudent
                info={userRef.current}
                setUserSearchParams={setUserSearchParams}
                closeDetail={handleClickCloseDetail}
              />
            </Dialog>
          </div>
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
    </div>
  )
}
