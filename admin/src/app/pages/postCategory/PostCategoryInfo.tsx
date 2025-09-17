import { format } from "date-fns";
import { useAppDispatch } from "../../store/hook";
import Swal from "sweetalert2";
import { setLoading } from "../../reducers/spinnerSlice";
import { PostCategoryItem, PostCategoryService } from "../../services/postCategory/PostCategoryService";
import { toast } from "react-toastify";

type Props = {
  info: PostCategoryItem // bắt buộc và chắc chắn không null
  setUserSearchParams?: React.Dispatch<React.SetStateAction<any>>;
  closeDetail: () => void;
};

export default function PostCategoryInfo({ info, setUserSearchParams, closeDetail }: Props) {
  const dispatch = useAppDispatch();

  const formatDate = (date?: string) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy, HH:mm");
  };

  const deleteCategory = (id: number) => {
    Swal.fire({
      title: "Confirm",
      text: "Xác nhận xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.isConfirmed) return;

      dispatch(setLoading(true));
      PostCategoryService.getInstance()
        .delete(id)
        .then((resp: any) => {
          dispatch(setLoading(false));
          // refresh list nếu hàm được truyền vào
          setUserSearchParams?.((prev: any) => ({ ...prev, timer: Date.now() }));
          closeDetail();
          toast.success(resp?.data?.message ?? "Đã xóa");
        })
        .catch((err: any) => {
          dispatch(setLoading(false));
          toast.error(err?.response?.data?.message ?? err?.message ?? "Xóa thất bại");
        });
    });
  };

  return (
    <div>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">Chi tiết danh mục</h2>
        </div>
        <div className="col-auto">
          <div className="row g-2 g-sm-3">
            <div className="col-auto">
              <button className="btn btn-phoenix-danger" onClick={() => deleteCategory(info.id)}>
                <i className="fa-solid fa-trash"></i> Xóa danh mục
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-6">
        <div className="col-12 col-lg-12">
          <div className="card h-100">
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

              <div className="pt-4">
                <h6 className="mb-2 text-800">PostCategoryName</h6>
                <div className="fs-1 text-1000">{info.postCategoryName}</div>
              </div>

              <div className="pt-4">
                <h6 className="mb-2 text-800">Active</h6>
                <span className={`badge ${info.active === "1" ? "bg-success" : "bg-secondary"}`}>
                  {info.active === "1" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="pt-4 text-end">
                <button className="btn btn-secondary me-2" onClick={closeDetail}>
                  Đóng
                </button>
                {/* Bạn có thể thêm nút Sửa nếu muốn mở form edit tại đây */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
