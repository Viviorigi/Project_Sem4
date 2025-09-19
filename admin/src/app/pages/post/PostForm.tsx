// src/pages/post/PostForm.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { toast } from "react-toastify";
import { PostDTO } from "../../model/PostDTO";
import { PostService, PostItem } from "../../services/post/PostService";

// 👇 import service danh mục
import {
  PostCategoryService,
  PostCategoryItem,
} from "../../services/postCategory/PostCategoryService";

type Props = {
  closeForm: () => void;
  onSave: () => void;
  post?: PostItem | null;
};

export default function PostForm({ closeForm, onSave, post }: Props) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<PostDTO>({
    id: undefined,
    title: "",
    description: "",
    postCategoryId: 0,
    content: "",
    status: "Draft",
    image: null,
  });

  const [errors, setErrors] = useState<{ title?: string; postCategoryId?: string }>({});
  const [preview, setPreview] = useState<string | undefined>(undefined);

  // 👇 state danh mục
  const [categories, setCategories] = useState<PostCategoryItem[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(false);

  // Load danh mục để chọn
  useEffect(() => {
    setLoadingCats(true);
    const body = { pageNumber: 1, pageSize: 1000, keyword: "", sortBy: "CreatedAt", sortDir: "desc" as const };

    PostCategoryService.getInstance()
      .search(body)
      .then(({ data }) => {
        // Chuẩn hoá giống nơi khác
        const items = (data?.data ?? data?.items ?? []).map((x: any) => ({
          id: x.id,
          postCategoryName: x.postCategoryName ?? "",
          active: x.active ? "1" : "0",
          createdAt: x.createdAt ?? undefined,
        })) as PostCategoryItem[];
        setCategories(items.filter(c => c.active === "1")); // chỉ lấy active nếu muốn
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Không tải được danh mục");
      })
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    if (post) {
      setForm({
        id: post.id,
        title: post.title ?? "",
        description: post.description ?? "",
        postCategoryId: post.postCategoryId ?? 0,
        content: post.content ?? "",
        status: post.status ?? "Draft",
        image: null,
      });
      setPreview(post.imageUrl);
    }
  }, [post]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: name === "postCategoryId" ? Number(value) : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setForm((prev) => ({ ...prev, image: f ?? null }));
    if (f) setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.title || form.title.trim().length === 0) next.title = "Tiêu đề không được rỗng.";
    if (!form.postCategoryId || form.postCategoryId <= 0) next.postCategoryId = "Chọn danh mục hợp lệ.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    Swal.fire({
      title: "Xác nhận",
      text: post ? "Cập nhật bài viết?" : "Tạo bài viết mới?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((r) => {
      if (!r.isConfirmed) return;
      dispatch(setLoading(true));
      const svc = PostService.getInstance();
      const req = post ? svc.update(post.id, form) : svc.create(form);
      req
        .then((resp) => {
          dispatch(setLoading(false));
          toast.success(resp?.data?.message ?? "Thành công");
          closeForm();
          onSave();
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.response?.data?.message ?? err?.message ?? "Có lỗi xảy ra");
        });
    });
  };

  return (
    <div>
      <h3>{post ? "Cập nhật bài viết" : "Thêm bài viết"}</h3>

      <div className="row">
        <div className="col-md-8 mb-3">
          <label>Tiêu đề <span className="text-danger">(*)</span></label>
          <input
            name="title"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            value={form.title}
            onChange={onChange}
            maxLength={255}
            placeholder="Nhập tiêu đề"
          />
          {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
        </div>

        {/* 👇 Dropdown chọn danh mục từ PostCategory */}
        <div className="col-md-4 mb-3">
          <label>Danh mục <span className="text-danger">(*)</span></label>
          <select
            name="postCategoryId"
            className={`form-control ${errors.postCategoryId ? "is-invalid" : ""}`}
            value={form.postCategoryId}
            onChange={onChange}
            disabled={loadingCats}
          >
            <option value={0}>{loadingCats ? "Đang tải danh mục..." : "-- Chọn danh mục --"}</option>
            {categories.map((c) => (
              <option className="text-center" key={c.id} value={c.id}>
                {c.postCategoryName}
              </option>
            ))}
          </select>
          {errors.postCategoryId && (
            <div className="invalid-feedback d-block">{errors.postCategoryId}</div>
          )}
        </div>

        <div className="col-md-12 mb-3">
          <label>Mô tả</label>
          <textarea name="description" className="form-control" rows={2} value={form.description} onChange={onChange} />
        </div>

        <div className="col-md-12 mb-3">
          <label>Nội dung</label>
          <textarea name="content" className="form-control" rows={6} value={form.content} onChange={onChange} />
        </div>

        <div className="col-md-4 mb-3">
          <label>Trạng thái</label>
          <select name="status" className="form-control" value={form.status} onChange={onChange}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>

        <div className="col-md-8 mb-3">
          <label>Ảnh</label>
          <input type="file" accept="image/*" className="form-control" onChange={onFile} />
          {preview && <img alt="preview" src={`${process.env.REACT_APP_API_URL}/api/Account/getImage/${preview}`} className="mt-2" style={{ maxHeight: 120 }} />}
        </div>
      </div>

      <button type="button" className="btn btn-primary mt-2" onClick={save}>
        {post ? "Cập nhật" : "Lưu"}
      </button>
    </div>
  );
}
