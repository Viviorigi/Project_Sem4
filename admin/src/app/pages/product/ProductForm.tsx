import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import defaultPersonImage from "../../../assets/images/imagePerson.png";
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
import JoditEditor from "jodit-react";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { HeadersUtil } from "../../utils/Headers.Util";

type Props = {
  hideForm: (refresh: boolean) => void;
  productDTO?: any | null;
  onSave: () => void;
};

type CategoryItem = {
  id: number;
  categoryName: string;
  active: boolean;
};

type FormState = {
  productName: string;
  price: string;
  salePrice: string;
  active: "1" | "0";
  categoryId: string;
  description: string;
  imageFile: File | null;
  albumFiles: File[];
};

/* ---------------- helpers ---------------- */

const buildImg = (file?: string | null) => {
  if (!file) return defaultPersonImage;
  if (/^https?:\/\//i.test(file)) return file; // đã là URL
  // đổi path này đúng BE trả ảnh của bạn
  // ví dụ: /api/Account/getImage/{fileName}
  return `${process.env.REACT_APP_API_URL}/api/Account/getImage/${file}`;
};

/* ---------------- component ---------------- */

export default function ProductForm({ hideForm, productDTO, onSave }: Props) {
  const dispatch = useAppDispatch();
  const isEdit = !!productDTO?.id;
  const [visible] = useState(true);

    const [categories, setCategories] = useState<
    { id: number; categoryName: string; active: boolean }[]
    >([]);

  const [form, setForm] = useState<FormState>({
    productName: "",
    price: "",
    salePrice: "0",
    active: "1",
    categoryId: "",
    description: "",
    imageFile: null,
    albumFiles: [],
  });

  const [previewMain, setPreviewMain] = useState<string>(defaultPersonImage);
  const [previewAlbum, setPreviewAlbum] = useState<string[]>([]);

  /* ---------- load categories ---------- */
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/Category/search`;
      const body = {
        pageNumber: 1,
        pageSize: 200,
        keyword: "",
        status: "1",            // chỉ lấy active nếu backend hiểu "1" = active
        sortBy: "CategoryName",
        sortDir: "asc",
      };
      const resp = await axios.post(url, body, {
        headers: HeadersUtil.getHeadersAuth(), // đã import sẵn
      });

      const data = resp.data?.data ?? [];
      setCategories(
        data
          .filter((c: any) => c?.active === true)
          .map((c: any) => ({
            id: c.id,
            categoryName: c.categoryName,
            active: true,
          }))
      );
    } catch (err) {
      console.error("Load categories error:", err);
      setCategories([]); // fallback
    }
  };

  fetchCategories();
}, []);


  /* ---------- map when edit ---------- */
  useEffect(() => {
    if (!productDTO) return;

    setForm((prev) => ({
      ...prev,
      productName: productDTO.productName ?? "",
      price: productDTO.price?.toString?.() ?? "",
      salePrice: productDTO.salePrice?.toString?.() ?? "0",
      active:
        productDTO.active === true || productDTO.active === "1" ? "1" : "0",
      categoryId:
        (productDTO.categoryId ??
          productDTO.category?.id ??
          "").toString(),
      description: productDTO.description ?? "",
      attributes: productDTO.attributes ?? "",
      imageFile: null,
      albumFiles: [],
    }));

    setPreviewMain(buildImg(productDTO.image));

    let albumList: string[] = [];
    if (Array.isArray(productDTO.album)) {
      albumList = productDTO.album;
    } else if (
      typeof productDTO.album === "string" &&
      productDTO.album.trim() !== ""
    ) {
      try {
        albumList = JSON.parse(productDTO.album);
      } catch {
        albumList = [];
      }
    }
    setPreviewAlbum(albumList.map((f) => buildImg(f)));
  }, [productDTO]);

  /* ---------- handlers ---------- */
  const handleText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as any }));
  };

  const handlePriceNumberOnly = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const allowed = "0123456789.";
    if (e.key.length === 1 && !allowed.includes(e.key)) e.preventDefault();
  };

  const onMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: f }));
    if (f && f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewMain(reader.result as string);
      reader.readAsDataURL(f);
    } else if (f) {
      toast.error("Vui lòng chọn ảnh hợp lệ.");
    } else {
      setPreviewMain(defaultPersonImage);
    }
  };

  const onAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setForm((prev) => ({ ...prev, albumFiles: files }));
    const previews = files.map((f) => URL.createObjectURL(f));
    setPreviewAlbum(previews);
  };

  /* ---------- validate & submit ---------- */
  const validate = () => {
    if (!form.productName.trim())
      return toast.error("ProductName không được để trống"), false;
    if (!form.price.trim() || isNaN(Number(form.price)))
      return toast.error("Price không hợp lệ"), false;
    if (form.salePrice && isNaN(Number(form.salePrice)))
      return toast.error("SalePrice không hợp lệ"), false;
    if (!form.categoryId)
      return toast.error("Vui lòng chọn Category"), false;
    return true;
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("ProductName", form.productName.trim());
    fd.append("Price", form.price);
    fd.append("SalePrice", form.salePrice || "0");
    fd.append("Active", form.active);
    fd.append("CategoryId", form.categoryId);
    if (form.description?.trim())
      fd.append("Description", form.description);
    if (form.imageFile) fd.append("Image", form.imageFile);
    form.albumFiles.forEach((f) => fd.append("Album", f));
    return fd;
  };

  const save = async () => {
    if (!validate()) return;

    const { value: ok } = await Swal.fire({
      title: "Xác nhận",
      text: isEdit
        ? "Bạn có muốn cập nhật sản phẩm?"
        : "Bạn có muốn tạo mới sản phẩm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (!ok) return;

    try {
      dispatch(setLoading(true));
      const fd = buildFormData();
      const url = isEdit
        ? `${process.env.REACT_APP_API_URL}/api/Product/${productDTO.id}`
        : `${process.env.REACT_APP_API_URL}/api/Product`;

      // KHÔNG đặt Content-Type, để axios tự thêm boundary
      const headers = {
        ...HeadersUtil.getHeadersAuthFormData(),
      };

      const resp = isEdit
        ? await axios.put(url, fd, { headers })
        : await axios.post(url, fd, { headers });

      if (resp.status >= 200 && resp.status < 300) {
        toast.success(
          isEdit ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công"
        );
        hideForm(true);
        onSave();
      } else {
        toast.error("Thao tác thất bại");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ---------------- render ---------------- */

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={() => hideForm(true)}
        style={{ width: "1150px", backgroundColor: "#f5f5f5" }}
        baseZIndex={1100}
      >
        <h3>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h3>

        <div className="row">
          {/* Column 1 */}
          <div className="col-md-6 mb-5">
            <div className="form-group mb-3">
              <label>
                Product Name <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                name="productName"
                className="form-control"
                value={form.productName}
                onChange={handleText}
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="form-group mb-3">
              <label>
                Price <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                name="price"
                className="form-control"
                value={form.price}
                onKeyDown={handlePriceNumberOnly}
                onChange={handleText}
                placeholder="Giá (ví dụ: 199000 hoặc 199000.5)"
              />
            </div>

            <div className="form-group mb-3">
              <label>Sale Price</label>
              <input
                type="text"
                name="salePrice"
                className="form-control"
                value={form.salePrice}
                onKeyDown={handlePriceNumberOnly}
                onChange={handleText}
                placeholder="Giá khuyến mãi (mặc định 0)"
              />
            </div>

            <div className="form-group mb-3">
              <label>
                Category <span className="text-danger">(*)</span>
              </label>
              <select
                name="categoryId"
                className="form-select"
                value={form.categoryId}
                onChange={handleSelect}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Active</label>
              <select
                name="active"
                className="form-select"
                value={form.active}
                onChange={handleSelect}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-md-6 mb-5">
            <div className="form-group mb-3">
              <label>Description</label>
              <JoditEditor
                value={form.description}
                onChange={(content) =>
                  setForm((p) => ({ ...p, description: content }))
                }
              />
            </div>

            {/* Image */}
            <div className="form-group mb-3">
              <label>Image (ảnh bìa)</label>
              <br />
              <input type="file" accept="image/*" onChange={onMainImageChange} />
              {!!previewMain && (
                <div className="mt-2 d-flex justify-content-center">
                  <img
                    src={previewMain}
                    alt="Preview"
                    style={{ width: 140, height: 140, objectFit: "cover" }}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = noImageAvailable;
                    }}
                  />
                </div>
              )}
            </div>

            {/* Album */}
            <div className="form-group mb-3">
              <label>Album (nhiều ảnh)</label>
              <br />
              <input type="file" multiple accept="image/*" onChange={onAlbumChange} />
              {previewAlbum.length > 0 && (
                <div
                  className="mt-2"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {previewAlbum.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Album-${idx}`}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.onerror = null;
                        img.src = noImageAvailable;
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <button onClick={save} className="btn btn-primary btn-sm me-2">
            {isEdit ? "Cập nhật" : "Lưu"}
          </button>
          <button onClick={() => hideForm(false)} className="btn btn-danger btn-sm">
            Hủy
          </button>
        </div>
      </Dialog>
    </div>
  );
}
