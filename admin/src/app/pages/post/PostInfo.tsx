// src/pages/post/PostInfo.tsx
import React from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { PostService, PostItem } from "../../services/post/PostService";
import { toast } from "react-toastify";

type Props = {
  info: PostItem;
  setUserSearchParams?: React.Dispatch<React.SetStateAction<any>>;
  closeDetail: () => void;
};

export default function PostInfo({ info, setUserSearchParams, closeDetail }: Props) {
  const dispatch = useAppDispatch();
  const formatDate = (d?: string) => (d ? format(new Date(d), "dd/MM/yyyy, HH:mm") : "");

  const deletePost = (id: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xác nhận xóa bài viết này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (!res.isConfirmed) return;
      dispatch(setLoading(true));
      PostService.getInstance()
        .delete(id)
        .then((resp) => {
          dispatch(setLoading(false));
          setUserSearchParams?.((prev: any) => ({ ...prev, timer: Date.now() }));
          closeDetail();
          toast.success(resp?.data?.message ?? "Đã xóa");
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.response?.data?.message ?? err?.message ?? "Xóa thất bại");
        });
    });
  };

  return (
    <div>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto"><h2 className="mb-0">Chi tiết bài viết</h2></div>
        <div className="col-auto">
          <button className="btn btn-phoenix-danger" onClick={() => deletePost(info.id)}>
            <i className="fa-solid fa-trash"></i> Xóa bài viết
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-between-center pb-2 border-bottom border-dashed border-300">
            <div>
              <h6 className="mb-1 text-800">ID</h6>
              <div className="fs-1 text-1000">{info.id}</div>
            </div>
            <div className="text-end">
              <h6 className="mb-1 text-800">CreatedAt</h6>
              <div className="fs-1 text-1000">{formatDate(info.createdAt)}</div>
            </div>
          </div>

          <div className="pt-3">
            <h6 className="mb-1">Tiêu đề</h6>
            <div className="fs-1">{info.title}</div>
          </div>

          <div className="pt-3">
            <h6 className="mb-1">Mô tả</h6>
            <div className="text-700">{info.description}</div>
          </div>

          <div className="pt-3">
            <h6 className="mb-1">Danh mục (ID)</h6>
            <div className="text-700">{info.postCategoryId}</div>
          </div>

          <div className="pt-3">
            <h6 className="mb-1">Trạng thái</h6>
            <span className={`badge ${info.status === "Published" ? "bg-success" : "bg-secondary"}`}>
              {info.status || "N/A"}
            </span>
          </div>

          {info.imageUrl && (
            <div className="pt-3">
              <h6 className="mb-1">Ảnh</h6>
              <img
                src={`${process.env.REACT_APP_API_URL}/api/Account/getImage/${info.imageUrl}`}
                alt="post"
                style={{ maxHeight: 160 }}
              />
            </div>
          )}


          <div className="pt-4 text-end">
            <button className="btn btn-secondary" onClick={closeDetail}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
