import React, { useState, useEffect } from "react";
import { CheckoutDTO } from "../../model/CheckoutDTO";
import { CheckoutStatus } from "../../model/CheckoutStatus";
import { UserDTO } from "../../model/UserDTO";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { CheckoutService } from "../../services/checkout/CheckoutService";
import Pagination from "../../comp/common/Pagination";
import { BookSearch } from "../book/book-search";
import axios from "axios";
import { formatCurrency, formatDate } from "../../utils/FunctionUtils";
import defaultPersonImage from "../../../assets/images/imagePerson.png"
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
import { BookDTO } from "../../model/BookDTO";
import { CheckoutDetailDTO } from "../../model/CheckoutDetailDTO";
import { CheckoutBookDTO } from "../../model/CheckoutBookDTO";
import { CheckoutDetailBookDTO } from "../../model/CheckoutDetailsBookDTO";

interface OrderFormProps {
  order: CheckoutDTO | null;
  users: UserDTO[];
  onSave: (order: CheckoutDTO) => void;
  onClose: (status: boolean) => void;
  mode: string;
}

const defaultCheckout: CheckoutDTO = {
  id: 0,
  user: { userUid: 0, username: "", fullName: "", password: "", email: "", dob: "", className: "", phone: "", address: "", avatar: "", cre_dt: "", upd_dt: "", deleted: false, isActive: true, resetPasswordToken: "", tokenExpirationDate: "", roles: [] },
  userUid: 0,
  userFullName: "",
  startTime: "",
  endTime: "",
  status: CheckoutStatus.REQUESTED,
  checkoutDetails: [],
  expiredTime: "",
  fine: 0
};

export default function OrderForm({ order, users, onSave, onClose }: OrderFormProps) {
  const [currentOrder, setCurrentOrder] = useState<CheckoutDTO>(defaultCheckout);
  const [statusOptions, setStatusOptions] = useState<CheckoutStatus[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date>(
    order?.startTime ? new Date(order.startTime) : new Date()
  );
  const [endTime, setEndTime] = useState<Date>(
    order?.endTime ? new Date(order.endTime) : new Date()
  );
  const [newStatus, setNewStatus] = useState<CheckoutStatus>(CheckoutStatus.REQUESTED);
  const [errors, setErrors] = useState({ user: '', status: '' ,issue:''});

  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchDto, setSearchDto] = useState(new BookSearch('', 1, 0, new Date().getTime()))
  const [bookList, setBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  

  const [products, setProducts] = useState<BookDTO[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

  const handleCheckboxChange = (productId: number, checked: boolean) => {
    setSelectedProductIds(prevSelectedProductIds => {
      const newSelectedProductIds = new Set(prevSelectedProductIds);
      if (checked) {
        newSelectedProductIds.add(productId);
      } else {
        newSelectedProductIds.delete(productId);
      }
      return newSelectedProductIds;
    });
  };

  const handleChangeSearch = (event: any) => {
    setSearchDto({
      ...searchDto,
      [event.target.name]: event.target.value,
      page: 1
    });
  };

  const handleKeyUpSearch = (e: any) => {
    if (e.key === "Enter") {
      setSearchDto({
        ...searchDto,
        timer: new Date().getTime(),
      });
    }
  };

  useEffect(() => {
    if (order != null) {
      setCurrentOrder({ ...order });
      setSelectedUser(order.userUid);
      setStartTime(order.startTime ? new Date(order.startTime) : new Date());
      setEndTime(order.endTime ? new Date(order.endTime) : new Date());
      updateStatusOptions(order.status);
      setNewStatus(order.status);
    } else {
      setCurrentOrder(defaultCheckout);
    }

    let url = process.env.REACT_APP_API_URL + `/book/list?page=${searchDto.page}&keySearch=${searchDto.keySearch}&cateId=${searchDto.cate_id}`;
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
  }, [order,searchDto.page, searchDto.timer]);

  useEffect(() => {
    let url = process.env.REACT_APP_API_URL + `/category/list?page=1&keySearch=`;
    axios.get(url).then((resp: any) => {
      // console.log(resp.data.name);
      if (resp.data) {
        setCategoryList(resp.data.content);
      }
    }).catch((err: any) => {

    })
  }, [])

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

  const handlePageClick = (pageNumber: any) => {
    setSearchDto(() => ({
      ...searchDto,
      page: pageNumber,
    }));
  };

  

  const updateStatusOptions = (status: CheckoutStatus) => {
    switch (status) {
      case CheckoutStatus.REQUESTED:
        setStatusOptions([
          CheckoutStatus.REQUESTED,
          CheckoutStatus.APPROVED,
          CheckoutStatus.REJECTED
        ]);
        break;
      case CheckoutStatus.APPROVED:
        setStatusOptions([
          CheckoutStatus.REJECTED,
          CheckoutStatus.BORROWED,
        ]);
        break;
      case CheckoutStatus.REJECTED:
        setStatusOptions([
          CheckoutStatus.APPROVED,
          CheckoutStatus.REJECTED,
        ]);
        break;
      case CheckoutStatus.BORROWED:
        setStatusOptions([
          CheckoutStatus.BORROWED,
          CheckoutStatus.EXPIRED,
          CheckoutStatus.RETURNED
        ]);
        break;
      default:
        setStatusOptions([]);
        break;
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors = { user: '', status: '', issue: '' };

    if (isAddMode && !selectedUser) {
      errors.user = 'Sinh viên không để rỗng';
      valid = false;
    }

    if (!currentOrder.status) {
      errors.status = 'Trạng thái không để rỗng';
      valid = false;
    }

    if (selectedProductIds.size === 0){
      errors.issue = 'Sách không để rỗng';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value as CheckoutStatus);
  };

  const checkoutDetails: CheckoutDetailBookDTO[] = Array.from(selectedProductIds).map((id:any) => ({
    bookId: id,
    quantity: 1,
  }));

  const handleAdd = async () => {
    if (!validateForm()) return;

    Swal.fire({
      title: "Confirm",
      text: "Xác nhận thêm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const selectedUserObj = users.find(user => user.userUid === selectedUser);

        const newOrder: CheckoutBookDTO = {
          userUid: selectedUser || 0,
          status: CheckoutStatus.REQUESTED,
          checkoutDetails: checkoutDetails,
          expiredTime: "",
          fine: 0
        };

        try {
          await CheckoutService.save(newOrder);
          toast.success("Thêm đơn mượn thành công");
          onClose(true);
        } catch (error) {
          toast.error("Thêm đơn mượn thất bại");
        }
      }
    });
  };

  const handleEdit = async () => {
    // if (!validateForm()) return;

    Swal.fire({
      title: "Confirm",
      text: "Xác nhận lưu lại thay đổi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedOrder: CheckoutDTO = {
          ...currentOrder,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        };

        try {
          if (newStatus !== currentOrder.status) {
            switch (newStatus) {
              case CheckoutStatus.APPROVED:
                await CheckoutService.approveCheckout(currentOrder.id);
                break;
              case CheckoutStatus.REJECTED:
                await CheckoutService.rejectCheckout(currentOrder.id);
                break;
              case CheckoutStatus.BORROWED:
                await CheckoutService.borrowCheckout(currentOrder.id);
                break;
              case CheckoutStatus.EXPIRED:
                await CheckoutService.expiredCheckout(currentOrder.id);
                break;
              case CheckoutStatus.RETURNED:
                await CheckoutService.returnedCheckout(currentOrder.id);
                break;
              default:
                break;
            }
            updatedOrder.status = newStatus;
          } else {
            updatedOrder.status = currentOrder.status;
          }

          onSave(updatedOrder);
          onClose(true);
          toast.success("Lưu đơn mượn thành công");
        } catch (error) {
          toast.error("Lưu đơn mượn thất bại");
        }
      }
    });
  };

  const handleSave = async () => {
    console.log(selectedProductIds);
    
    if (isAddMode) {
      await handleAdd();
    } else {
      await handleEdit();
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  const getSelectedProducts = () => {
    return products.filter((product:any) => selectedProductIds.has(product.id));
  };

  const isAddMode = order === null;

  return (
    <div className="row container-fluid w-100">
      {isAddMode && (
        <>
          <div className="row mb-3" >
          <div className="col-2">Sinh viên</div>
          <div className="col-10" >
            <select
              className="form-select overflow-y-auto"
              name="user"
              value={selectedUser || ''}
              onChange={e => setSelectedUser(parseInt(e.target.value, 10))}
              
              required
            >
              <option value="" >Lựa chọn sinh viên</option>
              {users.map(user => (
                <option key={user.userUid} value={user.userUid}>
                  {user.fullName}
                </option>
              ))}
            </select>
            {errors.user && <div className="text-danger">{errors.user}</div>}
          </div>
        </div>

        <div className="row mb-3" >
          <div className="col-2">Sách</div>
          <div className="search-box d-flex">
                    {/* search input */}
                    <input className="form-control search-input search" type="search" placeholder="Search students" name="keySearch" aria-label="Search"
                      value={searchDto.keySearch || ""}
                      onChange={handleChangeSearch}
                      onKeyUp={handleKeyUpSearch}
                       />
                    <button className='btn btn-primary' onClick={() => {
                      setSearchDto({
                        ...searchDto,
                        timer: new Date().getTime(),
                      });
                    }}><span className="fas fa-search " /></button>
                  </div>
        </div>

        <div className=" border-bottom border-200 position-relative top-1">
              <div className="table-responsive scrollbar-overlay mx-n1 px-1">
                <table className="table table-bordered fs--1 mb-2 mt-5">
                  <thead>
                    <tr>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '3%' }}>#</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '11%' }}>Tiêu đề</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '13%' }}>Tác giả</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '9%' }}>Số lượng</th>
                      <th className="sort align-middle text-center" scope="col" style={{ width: '6%' }}>Giá mặc định</th>
                      {/* <th className="sort align-middle text-center" scope="col" style={{ width: '14%' }}>DESCRIPTION</th> */}
                      <th className="sort align-middle text-center" scope="col" style={{ width: '5%' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="list" id="customers-table-body">
                    {bookList.map((u: any, index: number) => {
                      return <tr className={selectedProductIds.has(u.id) ? 'table-primary hover-actions-trigger btn-reveal-trigger position-static':'hover-actions-trigger btn-reveal-trigger position-static'} key={u.id}>
                      <td className='align-middle text-center text-700'><input
                        type="checkbox"
                        checked={selectedProductIds.has(u.id)}
                        onChange={e => handleCheckboxChange(u.id, e.target.checked)}
                  /></td>
                      <td className="align-middle text-center">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-m">
                            <img className="rounded-circle" src={u.image ? process.env.REACT_APP_API_URL + `/getImage?atchFleSeqNm=${u.image}` : defaultPersonImage} alt="PersonAvatar" onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop in case fallback image also fails
                              target.src = noImageAvailable; // Set the fallback image
                            }} /></div>
                          <p className="mb-0 ms-3 text-1100 fw-bold">{u.title}</p>
                        </div>
                      </td>
                      <td className="align-middle text-center">{u.publisher}</td>
                      <td className="align-middle text-center text-1100">{u.quantity}</td>
                      <td className="align-middle text-start text-700">{formatCurrency(u.price)}</td>
                      {/* <td className="align-middle text-center text-1100" dangerouslySetInnerHTML={{ __html: u.description }}/> */}
                      {/* <td className="total-orders align-middle white-space-nowrap fw-semi-bold  text-start text-1000"  dangerouslySetInnerHTML={{ __html: u.description }}/> */}
                      <td className="align-middle text-center">
                        <span className={u.active ? 'badge badge-phoenix fs--2 badge-phoenix-success' : 'badge badge-phoenix fs--2 badge-phoenix-danger'}>
                          <span className="badge-label">{u.active ? "Active" : "Inactive"}</span>
                        </span>
                      </td>
                    </tr>
                    })}
                    

                  </tbody>
                  
                </table>
                {errors.issue && <div className="text-danger">{errors.issue}</div>}
              </div>
              <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                <div className="col-auto d-flex">
                  <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"><span className='fw-bold'>Tổng số đơn mượn: </span>  {totalPages} </p>
                </div>
                <div className="col-auto d-flex">
                  <Pagination totalPage={totalPages} currentPage={searchDto.page} handlePageClick={handlePageClick} prev={prev} next={next} />
                </div>
              </div>
            </div>
        </>
        
        
      )}
      {!isAddMode && (
        <div className="row mb-3">
          <div className="col-2">Trạng thái</div>
          <div className="col-9">
            <label className="me-2">Trạng thái hiện tại: {currentOrder.status}</label>
            <select
              className="form-control"
              name="Trạng thái"
              value={newStatus}
              onChange={handleChange}
              required
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <div className="text-danger">{errors.status}</div>}
          </div>
        </div>
      )}
      <div className="text-center mt-3">
        <button onClick={handleSave} className="btn btn-primary btn-sm me-2">
          {isAddMode ? 'Lưu' : 'Chỉnh sửa'}
        </button>
        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
          Đóng
        </button>
      </div>
    </div>
  );
}
