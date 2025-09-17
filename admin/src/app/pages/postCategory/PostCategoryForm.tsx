import React, { useEffect, useState, ChangeEvent } from "react";
import { useAppDispatch } from "../../store/hook";
import Swal from "sweetalert2";
import { setLoading } from "../../reducers/spinnerSlice";
import { toast } from "react-toastify";
import { PostCategoryDTO } from "../../model/PostCategoryDTO";
import { PostCategoryService } from "../../services/postCategory/PostCategoryService";

type Props = {
  closeForm: () => void;
  onSave: () => void;
  // Chấp nhận cả prop tên cũ 'banner' để không phải sửa chỗ gọi
  category?: PostCategoryDTO | null;
  banner?: PostCategoryDTO | null;
};

export default function PostCategoryForm(props: Props) {
  const { closeForm, onSave, category: categoryProp, banner } = props;
  const category = categoryProp ?? banner ?? null;

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<PostCategoryDTO>({
    postCategoryName: "",
    active: "1", // "1" = hoạt động, "0" = không hoạt động
  });

  const [errors, setErrors] = useState<{ postCategoryName?: string }>({});

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        postCategoryName: category.postCategoryName ?? "",
        active: (category.active as "1" | "0") ?? "1",
      });
    }
  }, [category]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as "1" | "0" }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.postCategoryName || form.postCategoryName.trim().length === 0) {
      next.postCategoryName = "Tên danh mục không được rỗng.";
    } else if (form.postCategoryName.trim().length > 255) {
      next.postCategoryName = "Tên danh mục không vượt quá 255 ký tự.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    Swal.fire({
      title: "Xác nhận",
      text: category ? "Cập nhật danh mục?" : "Tạo danh mục mới?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.isConfirmed) return;

      dispatch(setLoading(true));
      const svc = PostCategoryService.getInstance();
      const req = category
        ? svc.update(category.id as number, form)
        : svc.create(form);

      req
        .then((resp) => {
          dispatch(setLoading(false));
          toast.success(resp?.data?.message ?? "Thành công");
          closeForm();
          onSave();
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(
            err?.response?.data?.message ?? err?.message ?? "Có lỗi xảy ra"
          );
        });
    });
  };

  return (
    <div>
      <h3>{category ? "Cập nhật danh mục bài viết" : "Thêm danh mục bài viết"}</h3>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="form-group">
            <label>
              Tên danh mục <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              name="postCategoryName"
              className={`form-control ${errors.postCategoryName ? "is-invalid" : ""}`}
              value={form.postCategoryName}
              onChange={handleChange}
              placeholder="Nhập tên danh mục"
              maxLength={255}
            />
            {errors.postCategoryName && (
              <div className="invalid-feedback d-block" style={{ color: "red" }}>
                {errors.postCategoryName}
              </div>
            )}
          </div>

          <div className="form-group mt-3">
            <label>Trạng thái</label>
            <select
              name="active"
              className="form-control"
              value={form.active}
              onChange={handleChange}
            >
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-primary mt-4" onClick={save}>
        {category ? "Cập nhật" : "Lưu"}
      </button>
    </div>
  );
}
