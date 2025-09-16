import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";
import { HeadersUtil } from "../../utils/Headers.Util";

type CategoryDTO = {
    id?: string;
    categoryName?: string;
    status?: string; // "1" (Active) | "0" (Inactive) - chỉ dùng ở FE
};

type Props = {
    hideForm: (refresh: boolean) => void;
    categoryDTO: CategoryDTO | null; // null = create, object = edit
    onSave: () => void;
};

export default function AddCategory({ hideForm, categoryDTO, onSave }: Props) {
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(true);
    const [category, setCategory] = useState<CategoryDTO>({
        categoryName: "",
        status: "1",
    });

    const isEdit = !!categoryDTO?.id;
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/Category`;

    // nạp data khi edit / default khi create
    useEffect(() => {
        if (categoryDTO) {
            setCategory({
                id: categoryDTO.id,
                categoryName: categoryDTO.categoryName ?? "",
                status: categoryDTO.status ?? "1",
            });
        } else {
            setCategory({ categoryName: "", status: "1" });
        }
    }, [categoryDTO]);

    // đóng dialog
    const close = (refresh?: boolean) => {
        setVisible(false);
        hideForm(!!refresh);
    };

    // input text
    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory((prev) => ({ ...prev, [name]: value }));
    };

    // select status ("1"/"0")
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory((prev) => ({ ...prev, status: e.target.value }));
    };

    // validate
    const validate = () => {
        if (!category.categoryName || !category.categoryName.trim()) {
            toast.error("Tên danh mục không được để trống");
            return false;
        }
        if (category.status !== "1" && category.status !== "0") {
            toast.error("Trạng thái không hợp lệ");
            return false;
        }
        return true;
    };

    // save
    const save = async () => {
        if (!validate()) return;

        const { value: ok } = await Swal.fire({
            title: "Xác nhận",
            text: isEdit ? "Bạn có muốn cập nhật danh mục?" : "Bạn có muốn tạo mới danh mục?",
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

            // Map đúng payload theo Swagger
            const payload = {
                categoryName: category.categoryName!.trim(),
                active: category.status!, // "1" | "0"
            };

            const url = isEdit ? `${baseUrl}/${category.id}` : baseUrl;

            // DÙNG HEADER AUTH (có Bearer token)
            const headers = HeadersUtil.getHeadersAuth();

            const resp = isEdit
                ? await axios.put(url, payload, { headers })
                : await axios.post(url, payload, { headers });

            toast.success(isEdit ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công");
            close(true);
            onSave?.();
        } catch (err: any) {
            // Ưu tiên hiển thị lỗi ModelState từ ASP.NET
            const modelErrors = err?.response?.data?.errors;
            if (modelErrors && typeof modelErrors === "object") {
                const messages = Object.values(modelErrors).flat().join("\n");
                toast.error(messages || "Có lỗi xảy ra");
            } else if (err?.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    err?.message ||
                    "Có lỗi xảy ra";
                toast.error(msg);
            }
        } finally {
            dispatch(setLoading(false));
        }

    };

    const cancel = () => close(false);

    return (
        <div>
            <Dialog
                visible={visible}
                onHide={() => close(false)}
                style={{ width: "650px", backgroundColor: "#f5f5f5" }}
                baseZIndex={1100}
            >
                <h3>{isEdit ? "Edit Danh mục" : "Add Danh mục"}</h3>

                <div className="row">
                    <div className="col-md-12 mb-5">
                        <div className="form-group">
                            <label>
                                Tên danh mục <span className="text-danger">(*)</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="categoryName"
                                value={category.categoryName || ""}
                                onChange={handleChangeText}
                                placeholder="Nhập tên danh mục"
                            />
                            <div
                                className={`invalid-feedback ${(category.categoryName ?? "") === "" ? "d-block" : ""
                                    }`}
                            >
                                Không được để trống
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select
                                className="form-select"
                                value={category.status}
                                onChange={handleStatusChange}
                                name="status"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <button onClick={save} className="btn btn-primary btn-sm me-2">
                        Save
                    </button>
                    <button onClick={cancel} className="btn btn-danger btn-sm">
                        Cancel
                    </button>
                </div>
            </Dialog>
        </div>
    );
}
