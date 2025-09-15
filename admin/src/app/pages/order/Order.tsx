import React, { useEffect, useState, useRef } from "react";
import { CheckoutDTO, CheckoutStatus } from "../../model/CheckoutDTO";
import { format } from "date-fns";
import OrderForm from "./OrderForm";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { CheckoutService } from "../../services/checkout/CheckoutService";
import OrderDetail from "./OrderDetail";
import { Dialog } from "primereact/dialog";
import { AuthService } from "../../services/auth/AuthService";
import { UserDTO } from "../../model/UserDTO";

const Order = () => {
  const [orders, setOrders] = useState<CheckoutDTO[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [searchDto, setSearchDto] = useState({
    keySearch: "",
    page: 1,
    limit: 5,
    timer: new Date().getTime(),
  });
  const [statusFilter, setStatusFilter] = useState<CheckoutStatus>(CheckoutStatus.REQUESTED);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const indexOfLastItem = searchDto.page * searchDto.limit;
  const indexOfFirstItem = indexOfLastItem - searchDto.limit;
  const dispatch = useAppDispatch();
  const orderRef = useRef<CheckoutDTO | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [searchDto.page, searchDto.timer, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = {
        keySearch: searchDto.keySearch,
        status: statusFilter,
        limit: searchDto.limit,
        page: searchDto.page - 1,
      };

      const data = await CheckoutService.findAll(params);

      setOrders(data.content);
      setTotalOrders(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu đơn mượn", error);
      dispatch(setLoading(false));
    }
  };

  const fetchAllUsers = async () => {
    try {
      const modelSearch = {
        keySearch: "",
        page: 1,
        limit: 50,
      };

      const response = await AuthService.getInstance().getListActive(modelSearch);
      const { users, totalUsers } = response.data;

      setUsers(users);
      setTotalUsers(totalUsers);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect (() => {
    fetchAllUsers();
  }, []);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDto((prevParams) => ({
      ...prevParams,
      keySearch: event.target.value,
      page: 1,
    }));
  };

  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchDto((prevParams) => ({
        ...prevParams,
        page: 1,
      }));
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as CheckoutStatus);
  };

  const addOrder = () => {
    setMode("add");
    orderRef.current = null;
    setOpen(true);
  };

  const editOrder = (order: CheckoutDTO) => {
    setMode("edit");
    orderRef.current = order;
    setOpen(true);
  };

  const viewOrderDetail = (order: CheckoutDTO) => {
    orderRef.current = order;
    setOrderDetailOpen(true);
  };

  const deleteOrder = (id: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xóa đơn mượn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.value) {
        dispatch(setLoading(true));
        try {
          await CheckoutService.deleteById(id);
          dispatch(setLoading(false));
          setSearchDto((prevParams) => ({
            ...prevParams,
            page: 1,
            timer: new Date().getTime(),
          }));
          toast.success("Đã xóa thành công đơn mượn!");
        } catch (error) {
          dispatch(setLoading(false));
          toast.error("Error deleting order");
        }
      }
    });
  };

  const handlePageClick = (pageNumber: number) => {
    setSearchDto((prevParams) => ({
      ...prevParams,
      page: pageNumber,
    }));
  };

  const handlePrevClick = () => {
    if (searchDto.page > 1) {
      setSearchDto((prevParams) => ({
        ...prevParams,
        page: searchDto.page - 1,
      }));
    }
  };

  const handleNextClick = () => {
    if (searchDto.page < totalPages) {
      setSearchDto((prevParams) => ({
        ...prevParams,
        page: searchDto.page + 1,
      }));
    }
  };

  return (
    <div>
      <div className="mb-9">
        <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
          <div className="row g-2 mb-4">
            <div className="col-auto">
              <h2 className="mt-4">Danh sách đơn mượn</h2>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-auto">
              <div className="search-box d-flex">
                <input
                  className="form-control search-input search"
                  type="search"
                  placeholder="Search orders by Student"
                  name="keySearch"
                  aria-label="Search"
                  value={searchDto.keySearch || ""}
                  onChange={handleChangeSearch}
                  onKeyUp={handleKeyUpSearch}
                />
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setSearchDto((prevParams) => ({
                      ...prevParams,
                      page: 1,
                    }))
                  }
                >
                  <span className="fas fa-search" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <select
                className="form-select"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value={CheckoutStatus.REQUESTED}>Requested</option>
                <option value={CheckoutStatus.APPROVED}>Approved</option>
                <option value={CheckoutStatus.REJECTED}>Rejected</option>
              </select>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" onClick={addOrder}>
                <span className="fas fa-plus me-2" />
                Tạo đơn mượn
              </button>
            </div>
          </div>

          <div className="table-responsive scrollbar-overlay mx-n1 px-1 mt-5">
          <table className="table table-bordered fs--1 mb-2">
              <thead>
                <tr>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "3%" }}
                  >
                    #
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "10%" }}
                  >
                    Người mượn
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "5%" }}
                  >
                    Trạng thái
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "10%" }}
                  >
                    Ngày mượn
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "10%" }}
                  >
                    Cập nhật
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "5%" }}
                  >
                    Ngày trả
                  </th>
                  <th
                    className="sort align-middle text-center"
                    scope="col"
                    style={{ width: "10%" }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="align-middle text-center">{indexOfFirstItem + index + 1}</td>
                    <td className="align-middle text-center">{order.user?.fullName}</td>
                    <td className="align-middle text-center">
                      <span
                        className={`badge ${
                          order.status === CheckoutStatus.REQUESTED
                            ? "bg-info"
                            : order.status === CheckoutStatus.APPROVED
                            ? "bg-warning"
                            : order.status === CheckoutStatus.REJECTED
                            ? "bg-danger"
                            : ""
                        }`}
                      >
                        {order.status}
                      </span>
                      </td>
                    <td className="align-middle text-center">
                      {format(new Date(order.startTime), "dd/MM/yyyy, hh:mm")}
                    </td>
                    <td className="align-middle text-center">
                      {format(new Date(order.endTime), "dd/MM/yyyy, hh:mm")}
                    </td>
                    <td className="align-middle text-center text-900">
                      {order.endTime
                        ? format(new Date(order.endTime), "dd/MM/yyyy")
                        : "N/A"}
                    </td>
                    <td className="align-middle text-center">
                      <button aria-label='d' className="btn btn-phoenix-primary me-1 mb-1" type="button" 
                        onClick={() => editOrder(order)}><i className="fa-solid fa-pen"></i>
                      </button>
                      <button aria-label='d' className="btn btn-phoenix-danger me-1 mb-1" type="button" 
                        onClick={() => deleteOrder(order.id)}><i className="fa-solid fa-trash"></i>
                      </button>
                      <button aria-label='d' className="btn btn-phoenix-secondary me-1 mb-1" type="button" 
                        onClick={() => viewOrderDetail(order)}><i className="far fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto d-flex">
              <p className="mb-0">
                Tổng số đơn mượn: <strong>{totalOrders}</strong>
              </p>
            </div>
            <div className="col-auto d-flex">
            <Pagination totalPage={totalPages} currentPage={searchDto.page} handlePageClick={handlePageClick} prev={handlePrevClick} next={handleNextClick} />
            </div>
          </div>
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

      <Dialog
        visible={open}
        onHide={() => {
          setOpen(false);
          fetchOrders();
          fetchAllUsers();
        }}
        style={{ width: "1150px" }}
        header={mode === "add" ? "Add New Order" : "Edit Order"}
      >
        <OrderForm
          mode={mode}
          order={orderRef.current}
          onClose={() => {
            setOpen(false);
            fetchOrders();
            fetchAllUsers();
          }}
          onSave={() => {
            setOpen(false);
            fetchOrders();
          }}
          users={users}
        />
      </Dialog>

      <Dialog
        visible={orderDetailOpen}
        onHide={() => setOrderDetailOpen(false)}
        style={{ width: "80vw" }}
        header="Order Details"
      >
        <OrderDetail
          tab={"ORDER"}
          orderId={orderRef.current ? orderRef.current.id : 0}
          onHide={() => setOrderDetailOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Order;
