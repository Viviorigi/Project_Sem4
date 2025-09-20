import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckoutDetailDTO } from "../../model/CheckoutDetailDTO";
import Pagination from "../../comp/common/Pagination";
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";

const BASE_URL = process.env.REACT_APP_API_URL + "/api/checkoutdt";

interface OrderDetailProps {
  orderId: number;
  onHide: () => void;
  tab: string
}

interface OrderSearchParams {
  page: number;
  limit: number;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onHide, tab }) => {
  const [details, setDetails] = useState<CheckoutDetailDTO[]>([]);
  const [addDetailOpen, setAddDetailOpen] = useState(false);
  const [totalDetails, setTotalDetails] = useState<number>(0);
  const [selectedDetail, setSelectedDetail] =
    useState<CheckoutDetailDTO | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [searchParams]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${orderId}`);
      setDetails(response.data);
      setTotalDetails(parseInt(response.headers["x-total-count"], 10));
    } catch (error) {
      console.error("Error fetching checkout details", error);
    }
  };

  const handlePageClick = (page: number) => {
    setSearchParams((prevState) => ({ ...prevState, page }));
  };

  const handleAdd = () => {
    setSelectedDetail(null);
    setMode("add");
    setAddDetailOpen(true);
  };

  const handleEdit = (detail: CheckoutDetailDTO) => {
    setSelectedDetail(detail);
    setMode("edit");
    setAddDetailOpen(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Xóa bản ghi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/delete/${id}`);
          fetchOrderDetails();
          Swal.fire("Đã xóa!", "Bản ghi đã xóa.", "success");
        } catch (error) {
          console.error("Error deleting checkout detail", error);
          Swal.fire("Error!", "Xóa bản ghi thất bại.", "error");
        }
      }
    });
  };

  const handleSave = async (detail: CheckoutDetailDTO) => {
    const action = mode === "edit" ? "update" : "add";
    const url = `${BASE_URL}/${action}${mode === "edit" ? `/${detail.id}` : ""}`;
  
    try {
      if (action === "update") {
        await axios.put(url, detail);
        Swal.fire("Đã cập nhật!", "Bản ghi này đã được cập nhật.", "success");
      } else {
        await axios.post(url, detail);
        Swal.fire("Đã thêm!", "Bản ghi này đã được thêm.", "success");
      }
      setAddDetailOpen(false);
      fetchOrderDetails();
    } catch (error) {
    }
  };
  

  const handleCancel = () => {
    setAddDetailOpen(false);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-3">

      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Mã Sách</th>
              <th>Tên danh mục</th>
              <th>Tên sách</th>
              <th>Số lượng sách</th>
              {tab === "ORDER" ? <th>Hành động</th>: ""}
              
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {details.length > 0 ? (
              details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.bookId}</td>
                  <td>{detail.categoryName}</td>
                  <td>{detail.bookTitle}</td>
                  <td>{detail.quantity}</td>
                  <td>
                    {tab === "ORDER" ? <button className="btn btn-phoenix-danger me-1 mb-1" type="button" onClick={() => handleDelete(detail.id)}><i className="fa-solid fa-trash"></i></button> : ""}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  Không tìm thấy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <Pagination
          totalItems={totalDetails}
          currentPage={searchParams.page}
          totalPages={Math.ceil(totalDetails / searchParams.limit)}
          onPageChange={handlePageClick}
        />
      </div>
     
    </div>
  );
};

export default OrderDetail;
