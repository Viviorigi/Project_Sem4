import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hook";
import { Dialog } from "primereact/dialog";
import { OrderService } from "../../services/order/OrderService";

type OrderRow = {
  orderId: number;
  userName: string;
  email: string;
  orderDate: string;
  status: string;
};

type OrderDetail = {
  orderId: number;
  userName: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  orderDate: string;
  status: string;
  shippingAddress?: string | null;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
  }>;
  totalPrice: number;
};

// --- STATUS + RULES ---
const STATUS_OPTIONS = ["Pending", "Ordered", "Shipping", "Completed", "Cancelled"] as const;
type Status = typeof STATUS_OPTIONS[number];

const getNextStatusOptions = (current: Status): Status[] => {
  switch (current) {
    case "Pending": return ["Ordered", "Cancelled"];
    case "Ordered": return ["Shipping", "Cancelled"];
    case "Shipping": return ["Completed"];
    case "Completed": return [];
    case "Cancelled": return [];
    default: return [];
  }
};

const confirmChangeStatus = async (from: Status, to: Status) => {
  const rs = await Swal.fire({
    title: "Xác nhận đổi trạng thái?",
    text: `Từ "${from}" → "${to}"`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
  });
  return rs.isConfirmed;
};

export default function Order() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState({ keyword: "", page: 1, limit: 10, timer: Date.now() });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [detailOpen, setDetailOpen] = useState(false);
  const detailRef = useRef<OrderDetail | null>(null);

  const dispatch = useAppDispatch();
  const indexOfLast = search.page * search.limit;
  const indexOfFirst = indexOfLast - search.limit;

  // fetch list
  useEffect(() => {
    const body: any = {
      pageNumber: search.page, // 1-based
      pageSize: search.limit,
      keyword: search.keyword || "",
      sortBy: "",
      sortDir: "",
    };
    if (statusFilter) body.status = statusFilter;

    OrderService.getInstance()
      .search(body)
      .then((res) => {
        const data = res.data || {};
        const items = Array.isArray(data.data) ? data.data : [];
        const mapped: OrderRow[] = items.map((i: any) => ({
          orderId: i.orderId,
          userName: i.userName,
          email: i.email,
          orderDate: i.orderDate,
          status: i.status,
        }));
        setRows(mapped);
        setTotal(data.totalRecords ?? 0);
        setTotalPages(Math.ceil((data.totalRecords ?? 0) / search.limit));
      })
      .catch((err) => console.error(err));
  }, [search.page, search.limit, search.timer, statusFilter, search.keyword]);

  const handlePageClick = (p: number) => setSearch((s) => ({ ...s, page: p }));
  const prev = () => search.page > 1 && setSearch((s) => ({ ...s, page: s.page - 1 }));
  const next = () => search.page < totalPages && setSearch((s) => ({ ...s, page: s.page + 1 }));

  const openDetail = async (orderId: number) => {
    try {
      const res = await OrderService.getInstance().detail(orderId);
      detailRef.current = res.data as OrderDetail;
      setDetailOpen(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Không lấy được chi tiết đơn");
    }
  };

  const changeStatus = async (orderId: number, status: string) => {
    try {
      await OrderService.getInstance().changeStatus(orderId, status);
      toast.success("Đã cập nhật trạng thái");
      setSearch((s) => ({ ...s, timer: Date.now() }));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const remove = (orderId: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xóa đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (rs) => {
      if (rs.value) {
        try {
          await OrderService.getInstance().remove(orderId);
          toast.success("Đã xóa đơn hàng");
          setSearch((s) => ({ ...s, page: 1, timer: Date.now() }));
        } catch (e: any) {
          toast.error(e?.response?.data?.message || "Xóa thất bại");
        }
      }
    });
  };

  // confirm & apply filter (giữ như bạn đang dùng)
  const applyStatusFilter = (newStatus: string) => {
    setStatusFilter(newStatus);
    setSearch((s) => ({ ...s, page: 1 }));
  };

  return (
    <div className="mb-9">
      <div className="card mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white">
        <div className="row g-2 mb-4">
          <div className="col-auto">
            <h2 className="mt-4">List Orders</h2>
          </div>
        </div>

        {/* Search + status filter */}
        <div className="row g-3">
          <div className="col-auto">
            <div className="search-box d-flex">
              <input
                className="form-control search-input search"
                type="search"
                placeholder="Search by user/email"
                value={search.keyword}
                onChange={(e) => setSearch({ ...search, keyword: e.target.value, page: 1 })}
                onKeyDown={(e) => e.key === "Enter" && setSearch({ ...search, page: 1, timer: Date.now() })}
              />
              <button className="btn btn-primary" onClick={() => setSearch({ ...search, page: 1, timer: Date.now() })}>
                <span className="fas fa-search" />
              </button>
            </div>
          </div>

          <div className="col-auto">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => applyStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive scrollbar-overlay mx-n1 px-1 mt-4">
          <table className="table table-bordered fs--1 mb-2">
            <thead>
              <tr>
                <th className="align-middle text-center" style={{ width: "10%" }}>MÃ ĐƠN</th>
                <th className="align-middle text-start" style={{ width: "20%" }}>TÊN NGƯỜI DÙNG</th>
                <th className="align-middle text-start" style={{ width: "25%" }}>EMAIL</th>
                <th className="align-middle text-center" style={{ width: "20%" }}>NGÀY ĐẶT</th>
                <th className="align-middle text-center" style={{ width: "15%" }}>TRẠNG THÁI</th>
                <th className="align-middle text-center" style={{ width: "10%" }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const current = r.status as Status;
                const nextOptions = getNextStatusOptions(current);
                return (
                  <tr key={r.orderId}>
                    <td className="align-middle text-center">{r.orderId}</td>
                    <td className="align-middle text-start">{r.userName}</td>
                    <td className="align-middle text-start">{r.email}</td>
                    <td className="align-middle text-center">
                      {r.orderDate ? format(new Date(r.orderDate), "dd/MM/yy, HH:mm") : "—"}
                    </td>
                    <td className="align-middle text-center">
                      <select
                        className="form-select form-select-sm"
                        value={current}
                        onChange={async (e) => {
                          const next = e.target.value as Status;
                          if (next === current) return;

                          if (!nextOptions.includes(next)) {
                            toast.warn("Chuyển trạng thái không hợp lệ");
                            e.target.value = current;
                            return;
                          }

                          const ok = await confirmChangeStatus(current, next);
                          if (!ok) {
                            e.target.value = current;
                            return;
                          }

                          await changeStatus(r.orderId, next);
                        }}
                        style={{ minWidth: 140 }}
                      >
                        {/* trạng thái hiện tại - disabled */}
                        <option value={current} disabled>
                          {current} (hiện tại)
                        </option>

                        {/* các trạng thái tiếp theo hợp lệ */}
                        {nextOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="align-middle text-center">
                      <button className="btn  btn-phoenix-secondary p-0" onClick={() => openDetail(r.orderId)}>
                        <i className="far fa-eye" /> Chi tiết
                      </button>
                      <button className="btn btn-phoenix-danger btn-sm ms-2" onClick={() => remove(r.orderId)}>
                        <i className="fa-solid fa-trash" /> Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td className="text-center" colSpan={6}>Không có đơn hàng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Footer: total + pagination */}
        <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
          <div className="col-auto d-flex">
            <p className="mb-0">Tổng số đơn hàng: <strong>{total}</strong></p>
          </div>
          <div className="col-auto d-flex">
            <Pagination
              totalPage={totalPages}
              currentPage={search.page}
              handlePageClick={handlePageClick}
              prev={prev}
              next={next}
            />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog
        visible={detailOpen}
        onHide={() => setDetailOpen(false)}
        style={{ width: "950px" }}
        header="Chi tiết đơn hàng"
      >
        {detailRef.current && (
          <div className="p-2">
            {/* Header Order Info */}
            <div className="mb-4 p-3 bg-light border rounded">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fa-solid fa-receipt me-2 text-primary" />
                  Mã đơn:{" "}
                  <span className="fw-bold text-dark">
                    {detailRef.current.orderId}
                  </span>
                </h5>
                <span
                  className={`badge px-3 py-2 fs--1 ${detailRef.current.status === "Pending"
                      ? "bg-warning text-dark"
                      : detailRef.current.status === "Ordered"
                        ? "bg-info"
                        : detailRef.current.status === "Shipping"
                          ? "bg-primary"
                          : detailRef.current.status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                    }`}
                >
                  {detailRef.current.status}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 border rounded h-100">
                  <h6 className="fw-bold mb-3">Thông tin khách hàng</h6>
                  <p className="mb-1">
                    <strong>Người dùng:</strong> {detailRef.current.userName}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {detailRef.current.email}
                  </p>
                  {detailRef.current.shippingAddress && (
                    <p className="mb-0">
                      <strong>Địa chỉ:</strong> {detailRef.current.shippingAddress}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded h-100">
                  <h6 className="fw-bold mb-3">Thông tin đơn hàng</h6>
                  <p className="mb-1">
                    <strong>Ngày đặt:</strong>{" "}
                    {detailRef.current.orderDate
                      ? format(
                        new Date(detailRef.current.orderDate),
                        "dd/MM/yyyy, HH:mm"
                      )
                      : "—"}
                  </p>
                  <p className="mb-0">
                    <strong>Trạng thái:</strong> {detailRef.current.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-3">
              <h6 className="fw-bold mb-3">Danh sách sản phẩm</h6>
              <div className="table-responsive">
                <table className="table table-sm table-striped table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Tên sản phẩm</th>
                      <th className="text-end">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                      <th className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailRef.current.orderItems?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{it.productName}</td>
                        <td className="text-end">{it.quantity}</td>
                        <td className="text-end">
                          {Number(it.price).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="text-end fw-semibold">
                          {Number(it.subTotal).toLocaleString("vi-VN")} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="text-end mt-3">
              <h5 className="fw-bold text-success">
                Tổng tiền: {Number(detailRef.current.totalPrice).toLocaleString("vi-VN")} ₫
              </h5>
            </div>
          </div>
        )}
      </Dialog>


    </div>
  );
}
