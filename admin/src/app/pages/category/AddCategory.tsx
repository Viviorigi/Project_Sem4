import { useEffect, useState } from "react";
import { CategoryDTO } from "../../model/CategoryDTO";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import JoditEditor, { Jodit } from "jodit-react";
import DOMPurify from 'dompurify';
import { useAppDispatch } from "../../store/hook";
import { setLoading } from "../../reducers/spinnerSlice";

export default function AddCategory(props: any) {
    const { hideForm, categoryDTO, onSave } = props;
    const [category, setCategory] = useState<CategoryDTO>(new CategoryDTO());
    const [editorContent, setEditorContent] = useState('');
    const currentDate = new Date().toISOString();
    const dispatch = useAppDispatch();

    //xử lý text-editor 
    const handleContentChange = (newContent: any) => {
        setEditorContent(newContent);
        setCategory({
            ...category,
            description: newContent,
        });
    };

    // xử lý nhập ký tự không phải số
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'E' || e.key === 'e' || e.key === '.' || e.key === ',') {
            e.preventDefault();
        }
    }

    //xử lý active
    const handleActiveChange = (e: any) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value,
        });
    };

    //xử lý edit
    useEffect(() => {
        if (categoryDTO != null) {
            setCategory({
                ...categoryDTO,
                upd_dt: new Date().toISOString()
            })
            setEditorContent(categoryDTO.description || '');
        } else {
            setCategory({
                ...categoryDTO,
                active: true,
                description: '',
                cre_dt: new Date().toISOString(),
                upd_dt: new Date().toISOString()
            })
        }
    }, [])

    //lấy dữ liệu từ ô input
    const handleChangeText = (event: any) => {
        setCategory({
            ...category,
            [event.target.name]: event.target.value,
        })
    }

    const handleChangeNumber = (event: any) => {
        const newValue = event.target.value;
        setCategory({
            ...category,
            [event.target.name]: newValue,
        })
    }

    //check input 
    const chk = () => {
        if (category.name === undefined || category.name === '') {
            setCategoryState();
            return false;
        }
        // if (category.description === undefined || category.description === '') {
        //     setCategoryState();
        //     return false;
        // }
        return true;
    }

    const setCategoryState = () => {
        setCategory((prev: CategoryDTO) => {
            return {
                ...prev,
                name: prev.name || '',
                description: prev.description || ''
            }
        })
    }

    //Xử lý sự kiện save
    const save = () => {
        if (!chk()) {
            return;
        }
        // setVisible(false);
        // hideForm(true);

        Swal.fire({
            title: `Xác nhận`,
            text: `Bạn có muốn thực hiện ...`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#89B449',
            cancelButtonColor: '#E68A8C',
            confirmButtonText: `Yes`,
            cancelButtonText: `No`
        }).then((result) => {
            if (result.value) {
                // logic
                let url = `${process.env.REACT_APP_API_URL}/category/add`;
                axios.post(url, category).then((resp: any) => {
                    if (resp.data === "success") {
                        dispatch(setLoading(true));
                        setTimeout(() => {
                            hideForm(true);
                            dispatch(setLoading(false));
                            toast.success("Lưu thể loại thành công");
                            onSave()
                        }, 1000);
                    }
                }).catch((err: any) => {
                    dispatch(setLoading(false));
                    // console.log(err);

                })
            }
        })
    }

    const cancel = () => {
        hideForm(false);
    }
    const [visible, setVisible] = useState(true);
    const showDialog = () => {
        setVisible(true);
    }

    // Close dialog
    const hideDialog = () => {
        setVisible(false);
        // hideForm(true);
    }

    return (
        <div>
            {/* <Button label="Show Form" icon="pi pi-plus" onClick={showDialog} /> */}
            <Dialog
                visible={visible}
                // onHide={hideDialog}
                onHide={() => hideForm(true)}
                style={{ width: '1150px', backgroundColor: '#f5f5f5' }}
                baseZIndex={1100}>

                <h3>{categoryDTO === null ? "Add Category" : "Edit Category"}</h3>
                <div className="row">
                    {/* cột 1 */}
                    <div className="col-md-6 mb-5">
                        <div className="form-group">
                            <label>
                                Tên thể loại<span className="text-danger">(*)</span>
                            </label>
                            <input type='text'
                                className="form-control"
                                name="name"
                                value={category.name || ""}
                                onChange={handleChangeText}
                                placeholder="Nhập tên thể loại" />
                            <div className={`invalid-feedback ${category.name?.toString() == '' ? "d-block" : ""}`} style={{ fontSize: "100%" }}>Không được để trống</div>
                        </div>

                        {categoryDTO !== null && (
                            <div className="form-group">
                                <label>
                                    Active <span className="text-danger"></span>
                                </label>
                                <select
                                    className="form-select"
                                    value={category.active ? "true" : "false"}
                                    onChange={handleActiveChange}
                                    name="active"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">InActive</option>
                                </select>
                            </div>
                        )}

                    </div>

                    <div className="col-md-6 mb-5">
                        <div className="form-group">
                            {/* <label>
                                Description<span className="text-danger">(*)</span>
                            </label>
                            <input type='text'
                                className="form-control"
                                name="description"
                                value={category.description || ""}
                                onChange={handleChangeText}
                                placeholder="Nhập tên danh mục" /> */}
                            <label>
                                Mô tả<span className="text-danger">(*)</span>
                            </label>
                            <JoditEditor
                                value={editorContent}
                                onChange={(newContent) => handleContentChange(newContent)}
                            />
                            {/* <div className={`invalid-feedback ${category.description?.toString() == '' ? "d-block" : ""}`} style={{ fontSize: "100%" }}>Không được để trống</div> */}
                        </div>
                    </div>

                </div>

                <div className="text-center mt-3">
                    <button onClick={save} className="btn btn-primary btn-sm me-2">Save</button>
                    <button onClick={cancel} className="btn btn-danger btn-sm">Cancel</button>
                </div>

            </Dialog>
        </div>
    )
}
