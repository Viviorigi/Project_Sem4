import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { AuthService } from "../../services/auth/AuthService";
import { toast } from "react-toastify";
import defaultPersonImage from "../../../assets/images/imagePerson.png";
import noImageAvailable from "../../../assets/images/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
import { UserDTORequest } from "../../model/auth/UserDTORequest";

type Props = {
  closeForm: () => void;
  onSave: () => void;
  user: any | null; // null=create, object=update
};

const ROLE_OPTIONS = ["Admin", "Manager", "User"];
const GENDER_OPTIONS = [
  { value: "1", label: "Male" },
  { value: "0", label: "Female" },
];

export default function CustomerForm({ closeForm, onSave, user }: Props) {
  const dispatch = useAppDispatch();
  const isCreate = !user;

  const [userSave, setUserSave] = useState<UserDTORequest>(new UserDTORequest());
  const [preview, setPreview] = useState<string>(defaultPersonImage);

  // load data khi edit
  useEffect(() => {
    if (user) {
      setUserSave(
        new UserDTORequest({
          id: user.id,
          email: user.email ?? "",
          username: user.userName ?? "",
          password: "", // để trống -> bắt nhập lại khi update
          role: user.roleName ?? "User",
          phone: user.phone ?? user.phoneNumber ?? "",
          address: user.address ?? "",
          gender: user.gender === true ? "1" : user.gender === false ? "0" : "",
          avatar: null,
        })
      );

      if (user.avatar) {
        setPreview(
          `${process.env.REACT_APP_API_URL}/api/Account/getImage/${user.avatar}`
        );
      } else {
        setPreview(defaultPersonImage);
      }
    } else {
      setUserSave(new UserDTORequest());
      setPreview(defaultPersonImage);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUserSave((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setUserSave((prev) => ({ ...prev, avatar: f }));
    if (f && f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else if (f) {
      toast.error("Vui lòng chọn ảnh hợp lệ.");
    }
  };

  const validate = () => {
    if (!userSave.email.trim()) return toast.error("Email không được để trống"), false;
    if (!userSave.username.trim()) return toast.error("Username không được để trống"), false;
    if (isCreate && !userSave.password.trim()) 
    return toast.error("Password không được để trống"), false;
    if (!userSave.role.trim()) return toast.error("Role không được để trống"), false;
    return true;
  };

  const buildFormData = (dto: UserDTORequest) => {
    const fd = new FormData();
    fd.append("Email", dto.email);
    fd.append("Username", dto.username);
    if (dto.password) fd.append("Password", dto.password);
    fd.append("Role", dto.role);
    if (dto.phone) fd.append("Phone", dto.phone);
    if (dto.address) fd.append("Address", dto.address);
    if (dto.gender) fd.append("Gender", dto.gender);
    if (dto.avatar) fd.append("Avatar", dto.avatar);
    return fd;
  };

  const save = async () => {
    if (!validate()) return;

    const { value } = await Swal.fire({
      title: "Confirm",
      text: isCreate
        ? "Bạn có muốn tạo mới khách hàng?"
        : "Bạn có muốn cập nhật khách hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#89B449",
      cancelButtonColor: "#E68A8C",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (!value) return;

    try {
      dispatch(setLoading(true));

      const formData = buildFormData(userSave);

      const resp = isCreate
        ? await AuthService.getInstance().create(formData)
        : await AuthService.getInstance().update(userSave.id!, formData);

      toast.success(
        resp?.data?.message ??
        (isCreate ? "Tạo mới thành công" : "Cập nhật thành công")
      );
      closeForm();
      onSave();
    } catch (err: any) {
      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <h3>{isCreate ? "Tạo mới khách hàng" : "Cập nhật Khách hàng"}</h3>

      <div className="row">
        {/* Cột trái */}
        <div className="col-md-6 mb-4">
          <div className="form-group mb-3">
            <label>
              Email <span className="text-danger">(*)</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={userSave.email}
              onChange={handleChange}
              placeholder="Nhập Email"
            />
          </div>

          <div className="form-group mb-3">
            <label>
              Username <span className="text-danger">(*)</span>
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={userSave.username}
              onChange={handleChange}
              placeholder="Nhập Username"
              readOnly={!isCreate}
            />
          </div>

          <div className="form-group mb-3">
            <label>
              Password  {isCreate && <span className="text-danger">(*)</span>}
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={userSave.password}
              onChange={handleChange}
              placeholder={isCreate ? "Nhập mật khẩu" : "Nhập mật khẩu mới"}
            />
          </div>

          <div className="form-group mb-3">
            <label>
              Role <span className="text-danger">(*)</span>
            </label>
            <select
              name="role"
              className="form-select"
              value={userSave.role}
              onChange={handleChange}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-md-6 mb-4">
          <div className="form-group mb-3">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={userSave.phone}
              onChange={handleChange}
              placeholder="Nhập SĐT"
            />
          </div>

          <div className="form-group mb-3">
            <label>Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={userSave.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="form-group mb-3">
            <label>Gender</label>
            <select
              name="gender"
              className="form-select"
              value={userSave.gender}
              onChange={handleChange}
            >
              <option value="">-- Chọn giới tính --</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-2">
            <label>Avatar</label>
            <br />
            <input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {!!preview && (
              <div className="mt-2 d-flex justify-content-center">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: 200, height: 200, objectFit: "cover" }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = noImageAvailable;
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-primary mt-3" onClick={save}>
        {isCreate ? "Tạo mới" : "Cập nhật"}
      </button>
    </div>
  );
}
